import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import { supabase } from "@/src/lib/supabase";
import { COUNTRY_OPTIONS, FieldLabel, fieldClass } from "../ServicePage";

/* Slide-in cart for the Shop page. Replaces the old /cart page:
   1. Items  — edit quantities / remove
   2. Details — who we contact and where it ships
   3. Review — confirm and send the quote request */

interface CartItem {
  id: string;
  productId: string | number | null;
  name: string;
  quantity: number;
  image: string;
}

const STEPS = ["Items", "Details", "Review"];

const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");
const getCustomerId = () => {
  const user = getUser();
  return user?.customerID ?? user?.customerId ?? user?.id;
};

export function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestCode, setRequestCode] = useState<string | null>(null);
  const [details, setDetails] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    country: "United States",
    notes: "",
  });

  const updateDetail = (key: keyof typeof details, value: string) =>
    setDetails((current) => ({ ...current, [key]: value }));

  const fetchCart = async () => {
    const customerId = getCustomerId();
    if (!customerId) return setCartItems([]);
    setIsLoading(true);
    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("customer_id", customerId);
    setIsLoading(false);
    if (error) return toast.error("Could not load your selected products.");
    setCartItems(
      (data || []).map((item) => ({
        id: String(item.id),
        productId: item.product_id ?? null,
        name: item.name,
        quantity: Number(item.quantity) || 1,
        image: item.image || "",
      })),
    );
  };

  // Refresh on open, and prefill contact details from the signed-in profile.
  useEffect(() => {
    if (!isOpen) return;
    void fetchCart();
    setStep(0);
    setRequestCode(null);
    const user = getUser();
    setDetails((current) => ({
      ...current,
      name:
        current.name ||
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.name ||
        "",
      phone: current.phone || user.phoneNumber || "",
      email: current.email || user.emailID || "",
    }));
  }, [isOpen]);

  // Keep in sync when items are added while the drawer is open.
  useEffect(() => {
    const refresh = () => isOpen && void fetchCart();
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, [isOpen]);

  // Close on Escape and lock page scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [isOpen, onClose]);

  const removeItem = async (id: string) => {
    const { error } = await supabase.from("cart").delete().eq("id", id);
    if (error) return toast.error("Could not remove this item.");
    await fetchCart();
    window.dispatchEvent(new Event("cart-updated"));
    toast.success("Item removed.");
  };

  const updateQuantity = async (id: string, delta: number) => {
    const item = cartItems.find((cartItem) => cartItem.id === id);
    if (!item) return;
    const { error } = await supabase
      .from("cart")
      .update({ quantity: Math.max(1, item.quantity + delta) })
      .eq("id", id);
    if (error) return toast.error("Could not update the quantity.");
    await fetchCart();
    window.dispatchEvent(new Event("cart-updated"));
  };

  const detailsValid =
    details.name.trim() &&
    details.phone.trim() &&
    /^\S+@\S+\.\S+$/.test(details.email.trim()) &&
    details.location.trim();

  const goNext = () => {
    if (step === 1 && !detailsValid) {
      toast.error("Please complete your name, phone, a valid email and delivery location.");
      return;
    }
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const requestQuote = async () => {
    const customerId = getCustomerId();
    if (!customerId) return toast.error("Please log in to request a quote.");
    if (!cartItems.length || isRequesting) return;
    setIsRequesting(true);

    const orderCode = `POP-QUOTE-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;

    // Open WhatsApp inside the click gesture (popup blockers kill async opens).
    const waMessage = [
      `Hello Pick O Pick, new *Shop quote request* (${orderCode}):`,
      `Name: ${details.name}`,
      `Phone: ${details.phone}`,
      `Email: ${details.email}`,
      `Deliver to: ${details.location}, ${details.country}`,
      "",
      "Items:",
      ...cartItems.map((item) => `• ${item.name} × ${item.quantity}`),
      details.notes.trim() ? `\nNotes: ${details.notes}` : "",
    ]
      .filter((line) => line !== null)
      .join("\n");
    window.open(
      `https://wa.me/919790361222?text=${encodeURIComponent(waMessage)}`,
      "_blank",
      "noopener,noreferrer",
    );

    try {
      const { data: quote, error: quoteError } = await supabase
        .from("orders")
        .insert({
          order_code: orderCode,
          customer_id: String(customerId),
          status: "QUOTE_REQUESTED",
          payment_status: "PENDING",
          payment_method: "QUOTE",
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          customer_name: details.name,
          customer_phone: details.phone,
          customer_email: details.email,
        })
        .select("id")
        .single();

      if (quoteError || !quote)
        throw quoteError || new Error("Quote request was not created.");

      const { error: itemsError } = await supabase.from("order_items").insert(
        cartItems.map((item) => ({
          order_id: quote.id,
          product_id: item.productId != null ? String(item.productId) : null,
          name: item.name,
          price: 0,
          quantity: item.quantity,
          image: item.image || null,
        })),
      );

      if (itemsError) {
        await supabase.from("orders").delete().eq("id", quote.id);
        throw itemsError;
      }

      // Confirmation email with product details (CC info@pickopick.com).
      try {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "cart_quote",
            code: orderCode,
            name: details.name,
            email: details.email,
            phone: details.phone,
            items: cartItems.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              image: item.image || "",
            })),
          }),
        });
      } catch (emailErr) {
        console.warn("Quote confirmation email trigger failed:", emailErr);
      }

      const { error: clearError } = await supabase
        .from("cart")
        .delete()
        .eq("customer_id", customerId);
      if (clearError) throw clearError;

      setCartItems([]);
      setRequestCode(orderCode);
      window.dispatchEvent(new Event("cart-updated"));
      toast.success("Your quote request has been sent.");
    } catch (error) {
      console.error("QUOTE REQUEST ERROR:", error);
      toast.error("Could not send your quote request. Please try again.");
    } finally {
      setIsRequesting(false);
    }
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const isEmpty = !isLoading && cartItems.length === 0 && !requestCode;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your selected products"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[111] flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <header className="border-b border-slate-100 px-5 pb-4 pt-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0B56D9]">
                    <ShoppingBag size={18} />
                  </span>
                  <div>
                    <h2 className="text-base font-extrabold text-[#0A1931]">
                      Your selected products
                    </h2>
                    <p className="text-xs text-slate-500">
                      {totalItems} {totalItems === 1 ? "item" : "items"} · prices
                      confirmed by our team
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Stepper */}
              {!requestCode && !isEmpty && (
                <ol className="mt-5 flex items-center">
                  {STEPS.map((label, index) => {
                    const done = index < step;
                    const current = index === step;
                    return (
                      <li key={label} className="flex flex-1 items-center last:flex-none">
                        <button
                          type="button"
                          disabled={index > step}
                          onClick={() => setStep(index)}
                          className="flex items-center gap-2"
                          aria-current={current ? "step" : undefined}
                        >
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black transition-colors ${
                              done || current
                                ? "bg-[#0B56D9] text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {done ? <Check size={13} /> : index + 1}
                          </span>
                          <span
                            className={`text-xs font-bold ${
                              current ? "text-[#0A1931]" : "text-slate-400"
                            }`}
                          >
                            {label}
                          </span>
                        </button>
                        {index < STEPS.length - 1 && (
                          <span
                            className={`mx-3 h-0.5 flex-1 rounded-full ${
                              done ? "bg-[#0B56D9]" : "bg-slate-200"
                            }`}
                          />
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </header>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {requestCode ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0B56D9]">
                    <CheckCircle2 size={32} />
                  </span>
                  <h3 className="mt-5 text-xl font-extrabold text-[#0A1931]">
                    Thank you for shopping with Pick O Pick.
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
                    Our team will contact you shortly with the best quote for
                    the products you selected.
                  </p>
                  <p className="mt-4 rounded-xl border border-dashed border-[#0B56D9]/40 bg-blue-50 px-4 py-2 font-mono text-sm font-bold text-[#0B56D9]">
                    {requestCode}
                  </p>
                </div>
              ) : isEmpty ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#0B56D9]">
                    <ShoppingBag size={28} />
                  </span>
                  <h3 className="mt-5 text-lg font-extrabold text-[#0A1931]">
                    Your selected products list is empty
                  </h3>
                  <p className="mt-2 max-w-xs text-sm text-slate-500">
                    Add products from the shop, and we will prepare a
                    personalised quote.
                  </p>
                </div>
              ) : step === 0 ? (
                <ul className="space-y-3">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="flex gap-3 rounded-2xl border border-slate-200 p-3"
                    >
                      <img
                        src={item.image || "/no-image.png"}
                        alt={item.name}
                        className="h-20 w-20 shrink-0 rounded-xl bg-[#F7F9FF] object-cover"
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="line-clamp-2 text-sm font-bold leading-snug text-[#0A1931]">
                          {item.name}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-xl border border-slate-200">
                            <button
                              type="button"
                              onClick={() => void updateQuantity(item.id, -1)}
                              disabled={item.quantity <= 1}
                              className="p-2 text-slate-600 hover:text-[#0B56D9] disabled:opacity-30"
                              aria-label={`Reduce ${item.name} quantity`}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-[#0A1931]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => void updateQuantity(item.id, 1)}
                              className="p-2 text-slate-600 hover:text-[#0B56D9]"
                              aria-label={`Increase ${item.name} quantity`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => void removeItem(item.id)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : step === 1 ? (
                <div className="space-y-4">
                  <FieldLabel label="Your Name" required>
                    <input
                      value={details.name}
                      onChange={(e) => updateDetail("name", e.target.value)}
                      placeholder="Full name"
                      className={fieldClass}
                    />
                  </FieldLabel>
                  <FieldLabel label="WhatsApp / Phone" required>
                    <input
                      type="tel"
                      value={details.phone}
                      onChange={(e) => updateDetail("phone", e.target.value)}
                      placeholder="+1 555 000 0000"
                      className={fieldClass}
                    />
                  </FieldLabel>
                  <FieldLabel label="Email Address" required>
                    <input
                      type="email"
                      value={details.email}
                      onChange={(e) => updateDetail("email", e.target.value)}
                      placeholder="you@example.com"
                      className={fieldClass}
                    />
                  </FieldLabel>
                  <FieldLabel label="Delivery Location" required>
                    <input
                      value={details.location}
                      onChange={(e) => updateDetail("location", e.target.value)}
                      placeholder="City, State / Postal Code"
                      className={fieldClass}
                    />
                  </FieldLabel>
                  <FieldLabel label="Destination Country">
                    <select
                      value={details.country}
                      onChange={(e) => updateDetail("country", e.target.value)}
                      className={fieldClass}
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </FieldLabel>
                  <FieldLabel label="Notes (size, colour, gift wrap…)">
                    <textarea
                      rows={3}
                      value={details.notes}
                      onChange={(e) => updateDetail("notes", e.target.value)}
                      placeholder="Anything our shoppers should know"
                      className={`${fieldClass.replace("h-12 ", "")} resize-none py-3`}
                    />
                  </FieldLabel>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Products
                      </p>
                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="text-xs font-bold text-[#0B56D9] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <ul className="divide-y divide-slate-100">
                      {cartItems.map((item) => (
                        <li key={item.id} className="flex items-center gap-3 py-2">
                          <img
                            src={item.image || "/no-image.png"}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#0A1931]">
                            {item.name}
                          </span>
                          <span className="text-xs font-bold text-slate-500">
                            × {item.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Contact & delivery
                      </p>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs font-bold text-[#0B56D9] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <dl className="space-y-1.5 text-sm">
                      {[
                        ["Name", details.name],
                        ["Phone", details.phone],
                        ["Email", details.email],
                        ["Deliver to", `${details.location}, ${details.country}`],
                        ...(details.notes.trim() ? [["Notes", details.notes]] : []),
                      ].map(([label, value]) => (
                        <div key={label} className="flex gap-3">
                          <dt className="w-20 shrink-0 text-slate-400">{label}</dt>
                          <dd className="min-w-0 flex-1 break-words font-semibold text-[#0A1931]">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <p className="flex gap-2 rounded-2xl bg-blue-50 p-4 text-xs leading-relaxed text-slate-600">
                    <PackageCheck size={16} className="mt-0.5 shrink-0 text-[#0B56D9]" />
                    Our team will verify availability, delivery and the final
                    price with you before anything is charged.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-100 px-5 py-4 sm:px-6">
              {requestCode || isEmpty ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0B56D9] text-sm font-extrabold text-white hover:bg-[#0849B7]"
                >
                  <ArrowLeft size={16} />
                  Continue shopping
                </button>
              ) : (
                <div className="flex gap-3">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep((current) => current - 1)}
                      className="inline-flex h-12 items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <ArrowLeft size={15} />
                      Back
                    </button>
                  )}
                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!cartItems.length}
                      className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0B56D9] text-sm font-extrabold text-white hover:bg-[#0849B7] disabled:opacity-50"
                    >
                      {step === 0 ? "Continue to details" : "Review request"}
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void requestQuote()}
                      disabled={isRequesting}
                      className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#0B56D9] text-sm font-extrabold text-white shadow-lg shadow-[#0B56D9]/25 hover:bg-[#0849B7] disabled:opacity-60"
                    >
                      <FaWhatsapp size={17} />
                      {isRequesting ? "Sending request…" : "Request quote"}
                    </button>
                  )}
                </div>
              )}
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
