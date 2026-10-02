"use client";

import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle2,
  Globe2,
  PackagePlus,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { AuthModal } from "./AuthModal";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";
import { submitServiceRequest } from "../../lib/serviceRequests";
import { BluePanel, FieldLabel, FormGroup, fieldClass } from "./ServicePage";

interface ShoppingDirectoryProps {
  searchQuery?: string;
  categoryFilter?: string;
  onSelectCategory?: (categoryId: string) => void;
  onClearFilters?: () => void;
}

const getImageUrl = (imageField: unknown) => {
  try {
    if (!imageField) return "";
    const parsed =
      typeof imageField === "string" ? JSON.parse(imageField) : imageField;
    const url = Array.isArray(parsed)
      ? parsed[0]
      : typeof parsed === "string"
        ? parsed
        : "";
    return url?.startsWith("blob:") ? "" : url || "";
  } catch {
    return typeof imageField === "string" && !imageField.startsWith("blob:")
      ? imageField
      : "";
  }
};

const exclusiveItems = [
  {
    title: "Tirupati Laddu",
    desc: "Authentic temple prasadam, sourced to order.",
    image: "/images/sweets/tirupati-laddu.webp",
  },
  {
    title: "Tirunelveli Halwa",
    desc: "Traditional, rich Tirunelveli halwa.",
    image: "/images/sweets/tirunelveli-halwa.webp",
  },
  {
    title: "Thoothukudi Macaroon",
    desc: "The famous cashew macaroon from Thoothukudi.",
    image: "/images/sweets/thoothukudi-macaroon.webp",
  },
];

export function ShoppingDirectory({
  searchQuery = "",
  categoryFilter = "",
  onSelectCategory,
  onClearFilters,
}: ShoppingDirectoryProps) {
  const [activeTab, setActiveTab] = useState<"directory" | "exclusive">(
    "directory",
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [exclusiveList, setExclusiveList] = useState("");
  const [exclusiveQuantity, setExclusiveQuantity] = useState("1");
  const [exclusiveName, setExclusiveName] = useState("");
  const [exclusivePhone, setExclusivePhone] = useState("");
  const [exclusiveEmail, setExclusiveEmail] = useState("");
  const [exclusiveLocation, setExclusiveLocation] = useState("");
  const [isSubmittingExclusive, setIsSubmittingExclusive] = useState(false);
  const [exclusiveError, setExclusiveError] = useState("");

  const resolveCategoryId = (val: string, catList: any[]) => {
    if (!val) return "";
    const clean = val.toLowerCase().trim();
    const found = catList.find((c) => {
      const name = (c.categoryName || "").toLowerCase();
      const id = String(c.categoryID).toLowerCase();
      return (
        id === clean ||
        name === clean ||
        name.replace(/[^a-z0-9]/g, "") === clean.replace(/[^a-z0-9]/g, "") ||
        (clean.includes("dress") && name.includes("dress")) ||
        (clean.includes("wear") && name.includes("dress")) ||
        (clean.includes("saree") && name.includes("dress")) ||
        (clean.includes("ethnic") && name.includes("dress")) ||
        (clean.includes("sweet") && name.includes("sweet")) ||
        (clean.includes("snack") && name.includes("sweet")) ||
        (clean.includes("decor") && name.includes("decor")) ||
        (clean.includes("grocer") && name.includes("grocer")) ||
        (clean.includes("food") &&
          (name.includes("grocer") || name.includes("sweet"))) ||
        (clean.includes("pooja") && name.includes("pooja"))
      );
    });
    return found ? String(found.categoryID) : val;
  };

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: catData }, { data: productData }] = await Promise.all([
        supabase.from("category").select("*"),
        supabase.from("productTable").select("*"),
      ]);
      const cats = catData || [];
      setCategories(cats);
      setProducts(productData || []);

      if (categoryFilter) {
        const resolved = resolveCategoryId(categoryFilter, cats);
        setSelectedCategory(resolved);
      }
    };
    void fetchData();
  }, []);

  useEffect(() => {
    const syncTabFromHash = () =>
      setActiveTab(
        window.location.hash === "#exclusive" ? "exclusive" : "directory",
      );
    syncTabFromHash();
    window.addEventListener("hashchange", syncTabFromHash);
    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, []);

  useEffect(() => {
    if (categoryFilter) {
      setActiveTab("directory");
      const resolved = resolveCategoryId(categoryFilter, categories);
      setSelectedCategory(resolved);
    } else {
      setSelectedCategory("");
    }
  }, [categoryFilter, categories]);

  const exclusiveCategory = categories.find(
    (category) => category.categoryName === "Exclusive",
  );
  const regularCategories = categories.filter(
    (category) => category.categoryName !== "Exclusive",
  );

  const matchesSearch = (name: string | undefined) =>
    !searchQuery ||
    (name || "").toLowerCase().includes(searchQuery.toLowerCase());

  // Strictly filter products by active category ID when selected
  const directoryProducts = products.filter(
    (product) =>
      product.categoryID !== exclusiveCategory?.categoryID &&
      (!selectedCategory ||
        String(product.categoryID) === String(selectedCategory)) &&
      matchesSearch(product.productName),
  );

  const activeCategoryObj = regularCategories.find(
    (c) => String(c.categoryID) === String(selectedCategory),
  );

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    onSelectCategory?.(catId);
  };

  const addToCart = async (product: any) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const customerId = user?.customerID ?? user?.customerId ?? user?.id;
    if (!customerId) {
      setIsLoginOpen(true);
      return;
    }

    setIsAdding(String(product.productID));
    const { data: existingItem, error: lookupError } = await supabase
      .from("cart")
      .select("id, quantity")
      .eq("customer_id", customerId)
      .eq("product_id", product.productID)
      .maybeSingle();

    const { error } = lookupError
      ? { error: lookupError }
      : existingItem
        ? await supabase
            .from("cart")
            .update({ quantity: (Number(existingItem.quantity) || 0) + 1 })
            .eq("id", existingItem.id)
        : await supabase.from("cart").insert([
            {
              customer_id: customerId,
              product_id: product.productID,
              name: product.productName,
              price: 0,
              image: getImageUrl(product.imageURL),
              quantity: 1,
            },
          ]);

    setIsAdding(null);
    if (error) {
      console.error("Unable to add directory item to cart:", error);
      toast.error("Could not add this item to your cart. Please try again.");
      return;
    }
    window.dispatchEvent(new Event("cart-updated"));
    // Slide the cart drawer open so the user sees their list straight away.
    window.dispatchEvent(new Event("pickopick:open-cart"));
    toast.success(
      existingItem
        ? `${product.productName} quantity increased.`
        : `${product.productName} added to your cart.`,
    );
  };

  const submitExclusiveRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!exclusiveList.trim()) {
      setExclusiveError("Please share the items you would like us to source.");
      return;
    }
    if (
      !exclusiveName.trim() ||
      !exclusivePhone.trim() ||
      !exclusiveEmail.trim() ||
      !exclusiveLocation.trim()
    ) {
      setExclusiveError(
        "Please complete your name, phone, email, and delivery location.",
      );
      return;
    }
    setExclusiveError("");
    setIsSubmittingExclusive(true);
    try {
      const result = await submitServiceRequest("exclusive_sourcing", {
        customerName: exclusiveName,
        phone: exclusivePhone,
        email: exclusiveEmail,
        location: exclusiveLocation,
        requestedItems: exclusiveList,
        quantity: exclusiveQuantity,
      });
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      setExclusiveList("");
      setExclusiveQuantity("1");
      setIsThankYouOpen(true);
      toast.success(
        result.emailSent
          ? "Sourcing request sent to WhatsApp and email."
          : "Sourcing request sent to WhatsApp.",
      );
    } catch (error) {
      setExclusiveError(
        error instanceof Error
          ? error.message
          : "Unable to submit your sourcing request.",
      );
    } finally {
      setIsSubmittingExclusive(false);
    }
  };

  const clearDirectoryFilters = () => {
    setSelectedCategory("");
    onClearFilters?.();
  };

  const totalDirectoryCount = products.filter(
    (p) => p.categoryID !== exclusiveCategory?.categoryID,
  ).length;
  const selectedExclusiveItems = exclusiveList
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return (
    <section
      id="shop-directory"
      className="scroll-mt-24 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Tabs */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0B56D9]">
              {activeTab === "directory" ? "Shop the catalog" : "Sourcing desk"}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#0A1931] sm:text-3xl">
              {activeTab === "directory"
                ? activeCategoryObj?.categoryName || "All Products"
                : "Exclusive Sourcing"}
            </h2>
          </div>
          <div className="inline-flex w-full rounded-2xl border border-slate-200 bg-white p-1 sm:w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("directory")}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all sm:flex-none ${
                activeTab === "directory"
                  ? "bg-[#0B56D9] text-white"
                  : "text-slate-500 hover:text-[#0A1931]"
              }`}
            >
              <ShoppingBag size={14} /> Catalog Directory
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("exclusive")}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all sm:flex-none ${
                activeTab === "exclusive"
                  ? "bg-[#0B56D9] text-white"
                  : "text-slate-500 hover:text-[#0A1931]"
              }`}
            >
              <Sparkles size={14} /> Exclusive Sourcing
            </button>
          </div>
        </div>

        {activeTab === "directory" ? (
          <>
            {/* Category filter bar */}
            <div className="sticky top-[100px] z-30 -mx-4 mb-6 border-y border-slate-200/70 bg-[#F7F9FF]/95 px-4 py-3 backdrop-blur sm:top-[106px] sm:-mx-8 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex flex-1 items-center gap-2 overflow-x-auto scrollbar-hide">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect("")}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                      !selectedCategory
                        ? "border-[#0B56D9] bg-[#0B56D9] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#0B56D9]/40"
                    }`}
                  >
                    All
                    <span className={`ml-1.5 ${!selectedCategory ? "text-blue-100" : "text-slate-400"}`}>
                      {totalDirectoryCount}
                    </span>
                  </button>
                  {regularCategories.map((cat) => {
                    const isSelected =
                      String(cat.categoryID) === String(selectedCategory);
                    const count = products.filter(
                      (p) => String(p.categoryID) === String(cat.categoryID),
                    ).length;
                    return (
                      <button
                        key={cat.categoryID}
                        type="button"
                        onClick={() => handleCategorySelect(String(cat.categoryID))}
                        className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                          isSelected
                            ? "border-[#0B56D9] bg-[#0B56D9] text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-[#0B56D9]/40"
                        }`}
                      >
                        {cat.categoryName}
                        <span className={`ml-1.5 ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {(selectedCategory || searchQuery) && (
                  <button
                    type="button"
                    onClick={clearDirectoryFilters}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-bold text-[#0B56D9] ring-1 ring-blue-100 hover:bg-blue-50"
                  >
                    <X size={13} /> Clear
                  </button>
                )}
              </div>
            </div>

            <p className="mb-5 text-xs font-semibold text-slate-500">
              {directoryProducts.length} product
              {directoryProducts.length === 1 ? "" : "s"}
              {searchQuery && (
                <>
                  {" "}for <span className="text-[#0B56D9]">“{searchQuery}”</span>
                </>
              )}
              {activeCategoryObj && (
                <> in {activeCategoryObj.categoryName}</>
              )}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {directoryProducts.map((product) => {
                const adding = isAdding === String(product.productID);
                return (
                  <motion.article
                    key={product.productID}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group flex flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white p-2 transition-all hover:-translate-y-1 hover:border-[#0B56D9]/30 hover:shadow-[0_24px_50px_-30px_rgba(11,86,217,0.55)]"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F7F9FF]">
                      <img
                        src={getImageUrl(product.imageURL) || "/no-image.png"}
                        alt={product.productName}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold text-[#0B56D9]">
                        <Globe2 size={10} /> Ships worldwide
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
                      <p className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug text-[#0A1931]">
                        {product.productName}
                      </p>
                      <button
                        type="button"
                        disabled={adding}
                        onClick={() => void addToCart(product)}
                        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#0B56D9] px-3 py-2.5 text-xs font-extrabold text-[#0B56D9] transition-colors hover:bg-[#0B56D9] hover:text-white disabled:opacity-60"
                      >
                        <PackagePlus className="h-4 w-4" />
                        {adding ? "Adding…" : "Add to cart"}
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {directoryProducts.length === 0 && (
              <div className="rounded-[28px] border border-dashed border-[#0B56D9]/30 bg-white px-6 py-16 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0B56D9]">
                  <Search size={22} />
                </span>
                <p className="mt-4 text-lg font-extrabold text-[#0A1931]">
                  No products found in this category
                </p>
                <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500">
                  We are constantly adding new items. Try selecting a different
                  category or search term, or request custom sourcing below.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={clearDirectoryFilters}
                    className="rounded-full border border-[#0B56D9] px-5 py-2.5 text-xs font-extrabold text-[#0B56D9] transition-colors hover:bg-blue-50"
                  >
                    View All Categories
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("exclusive")}
                    className="rounded-full bg-[#0B56D9] px-5 py-2.5 text-xs font-extrabold text-white transition-colors hover:bg-[#0849B7]"
                  >
                    Request Exclusive Sourcing
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.1fr]">
            {/* Famous items picker */}
            <BluePanel className="rounded-[28px]">
              <div className="p-6 sm:p-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest">
                  <Sparkles className="h-3.5 w-3.5" />
                  Exclusive Sourcing Desk
                </span>
                <h3 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  We Exclusively Source These Famous Items
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-blue-50">
                  Can’t find what you need? We source authentic regional
                  specialties directly from India and air-ship them fresh to
                  your destination.
                </p>

                <p className="mt-6 text-[11px] font-bold uppercase tracking-wider text-blue-100">
                  Tap to add to your list
                </p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {exclusiveItems.map((item) => {
                    const isSelected = selectedExclusiveItems.includes(item.title);
                    return (
                      <button
                        key={item.title}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => {
                          const nextItems = isSelected
                            ? selectedExclusiveItems.filter((value) => value !== item.title)
                            : [...selectedExclusiveItems, item.title];
                          setExclusiveList(nextItems.join(", "));
                        }}
                        className={`group relative rounded-2xl bg-white p-2 text-left transition-all ${
                          isSelected ? "ring-4 ring-white/60" : "hover:-translate-y-0.5"
                        }`}
                      >
                        <span className="relative block aspect-square overflow-hidden rounded-xl bg-[#F7F9FF]">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          {isSelected && (
                            <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#0B56D9] text-white">
                              <CheckCircle2 className="h-4 w-4" />
                            </span>
                          )}
                        </span>
                        <span className="mt-2 block text-xs font-extrabold leading-tight text-[#0A1931]">
                          {item.title}
                        </span>
                        <span className="mt-0.5 hidden text-[11px] leading-snug text-slate-500 sm:block">
                          {item.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </BluePanel>

            {/* Request form */}
            <form
              onSubmit={submitExclusiveRequest}
              className="space-y-8 rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8"
            >
              <FormGroup step="1" title="What should we source?">
                <FieldLabel label="Share your item list or requirements" required>
                  <textarea
                    required
                    value={exclusiveList}
                    onChange={(event) => setExclusiveList(event.target.value)}
                    rows={4}
                    placeholder="Enter the items you want to source..."
                    className={`${fieldClass.replace("h-12 ", "")} resize-none py-3`}
                  />
                </FieldLabel>
                <div className="max-w-[200px]">
                  <FieldLabel label="Quantity / Estimate" required>
                    <input
                      required
                      min="1"
                      type="number"
                      value={exclusiveQuantity}
                      onChange={(event) => setExclusiveQuantity(event.target.value)}
                      placeholder="Quantity"
                      className={fieldClass}
                    />
                  </FieldLabel>
                </div>
              </FormGroup>

              <div className="border-t border-dashed border-slate-200" />

              <FormGroup step="2" title="Your details">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldLabel label="Your Name" required>
                    <input
                      required
                      value={exclusiveName}
                      onChange={(event) => setExclusiveName(event.target.value)}
                      placeholder="Enter your name"
                      className={fieldClass}
                    />
                  </FieldLabel>
                  <FieldLabel label="Phone / WhatsApp" required>
                    <input
                      required
                      type="tel"
                      value={exclusivePhone}
                      onChange={(event) => setExclusivePhone(event.target.value)}
                      placeholder="Enter your phone number"
                      className={fieldClass}
                    />
                  </FieldLabel>
                  <FieldLabel label="Email Address" required>
                    <input
                      required
                      type="email"
                      value={exclusiveEmail}
                      onChange={(event) => setExclusiveEmail(event.target.value)}
                      placeholder="Enter your email address"
                      className={fieldClass}
                    />
                  </FieldLabel>
                  <FieldLabel label="Where to Send" required>
                    <input
                      required
                      value={exclusiveLocation}
                      onChange={(event) => setExclusiveLocation(event.target.value)}
                      placeholder="Enter your address"
                      className={fieldClass}
                    />
                  </FieldLabel>
                </div>
              </FormGroup>

              {exclusiveError && (
                <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
                  {exclusiveError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmittingExclusive}
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0B56D9] text-sm font-extrabold text-white shadow-lg shadow-[#0B56D9]/25 transition-colors hover:bg-[#0849B7] disabled:opacity-60"
              >
                <FaWhatsapp size={18} />
                <span>
                  {isSubmittingExclusive
                    ? "Submitting..."
                    : "Submit to WhatsApp & Email"}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>

      <AuthModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <AnimatePresence>
        {isThankYouOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close confirmation"
              onClick={() => setIsThankYouOpen(false)}
              className="fixed inset-0 z-[105] bg-slate-900/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="shopping-confirmation-title"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="fixed left-1/2 top-1/2 z-[106] w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-7 text-center shadow-2xl sm:p-9"
            >
              <button
                type="button"
                onClick={() => setIsThankYouOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#0B56D9]">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2
                id="shopping-confirmation-title"
                className="mt-5 text-2xl font-extrabold tracking-tight text-[#0A1931]"
              >
                Thank you for your sourcing request!
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Our personal shopping concierge will review your list and
                contact you with quotes and shipping estimates.
              </p>
              <button
                type="button"
                onClick={() => setIsThankYouOpen(false)}
                className="mt-7 rounded-full bg-[#0B56D9] px-7 py-3 text-xs font-extrabold uppercase tracking-wide text-white hover:bg-[#0849B7]"
              >
                Done
              </button>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
