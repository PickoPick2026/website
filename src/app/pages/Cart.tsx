import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";

interface CartItem {
  id: string;
  productId: string | number | null;
  name: string;
  price: number;
  quantity: number;
  image: string;
  inStock: boolean;
}

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{ code: string } | null>(null);

useEffect(() => {
  fetchCart();
}, []);

const fetchCart = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const { data, error } = await supabase
    .from("cart")
    .select("*")
    .eq("customer_id", user.customerID);

  if (!error && data) {
    setCartItems(
      data.map((item) => ({
        id: item.id,
        productId: item.product_id ?? null,
        name: item.name,
        price: item.price ?? 0,
        quantity: item.quantity,
        image: item.image,
        inStock: true,
      }))
    );
  }
};

const removeItem = async (id: string) => {
  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("id", id);

  if (error) {
    toast.error("Failed to remove item ❌");
    return;
  }

  fetchCart();
  toast.success("Item removed 🗑️");
};

const updateQuantity = async (id: string, delta: number) => {
  const item = cartItems.find((i) => String(i.id) === String(id));
  if (!item) return;

  const newQty = Math.max(1, item.quantity + delta);

  const { error } = await supabase
    .from("cart")
    .update({ quantity: newQty })
    .eq("id", id);

  if (error) {
    toast.error("Failed to update quantity ❌");
    return;
  }

  fetchCart();

  if (delta > 0) {
    toast.success("Quantity increased ➕");
  } else {
    toast.success("Quantity decreased ➖");
  }
};

const subtotal = cartItems.reduce(
  (sum, item) => sum + (item.price || 0) * item.quantity,
  0
);
  const shipping = subtotal > 500 ? 0 : 15.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    if (placing) return;

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.customerID) {
      toast.error("Please log in to place an order");
      return;
    }
    if (cartItems.length === 0) return;

    const customerId = String(user.customerID);
    setPlacing(true);

    try {
      // Delivery address — prefer the default, else the first one on file.
      const { data: addresses } = await supabase
        .from("addressTable")
        .select("*")
        .eq("customerID", user.customerID);

      if (!addresses || addresses.length === 0) {
        toast.error("Add a delivery address before checkout");
        navigate("/addresses");
        return;
      }
      const address = addresses.find((a) => a.isDefault) || addresses[0];

      const orderCode = `POP-ORD-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_code: orderCode,
          customer_id: customerId,
          status: "PLACED",
          payment_status: "PENDING",
          payment_method: "OFFLINE",
          subtotal: Number(subtotal.toFixed(2)),
          shipping: Number(shipping.toFixed(2)),
          tax: Number(tax.toFixed(2)),
          total: Number(total.toFixed(2)),
          customer_name: [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
          customer_phone: user.phoneNumber || null,
          customer_email: user.emailID || null,
          shipping_address: address.addressDetails || null,
        })
        .select("id, order_code")
        .single();

      if (orderError || !order) {
        console.error(orderError);
        toast.error("Could not place your order. Please try again.");
        return;
      }

      const { error: itemsError } = await supabase.from("order_items").insert(
        cartItems.map((item) => ({
          order_id: order.id,
          product_id: item.productId != null ? String(item.productId) : null,
          name: item.name,
          price: Number((item.price || 0).toFixed(2)),
          quantity: item.quantity,
          image: item.image || null,
        }))
      );

      if (itemsError) {
        console.error(itemsError);
        // Roll back the order row so we don't leave an empty order behind.
        await supabase.from("orders").delete().eq("id", order.id);
        toast.error("Could not save the order items. Please try again.");
        return;
      }

      // Order is stored — empty the cart.
      await supabase.from("cart").delete().eq("customer_id", user.customerID);

      setCartItems([]);
      setPlacedOrder({ code: order.order_code });
      window.dispatchEvent(new Event("cart-updated"));
      toast.success("Order placed 🎉");
    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      toast.error("Something went wrong while placing your order");
    } finally {
      setPlacing(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="size-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0A1931]">Order placed</h1>
          <p className="mt-2 text-slate-500">
            Your order reference is{" "}
            <span className="font-bold text-[#0A1931]">{placedOrder.code}</span>.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
            Our team will confirm the details and share payment and delivery information with you on WhatsApp.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B56D9] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0849B7]"
            >
              View My Orders
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ArrowLeft className="size-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="size-24 mx-auto text-slate-300 mb-6" />
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1931] mb-4">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Add some products to get started!</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0B56D9] text-white rounded-xl hover:bg-[#0849B7] transition-colors"
          >
            <ArrowLeft className="size-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[#0A1931] transition-colors"
        >
          <ArrowLeft className="size-5" />
          Continue Shopping
        </Link>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight text-[#0A1931] mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-24 sm:size-32 object-cover rounded-xl"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-2 truncate text-[#0A1931]">{item.name}</h3>
                  <p className="text-2xl font-extrabold text-[#0B56D9] mb-4">
                   ₹{(item.price || 0).toFixed(2)}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="w-12 text-center font-semibold text-[#0A1931]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="size-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>

                {/* Item Total (Desktop) */}
                <div className="hidden md:block text-right">
                  <p className="text-sm text-slate-500 mb-1">Item Total</p>
                  <p className="text-xl font-bold text-[#0A1931]">
                    ₹{((item.price || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Item Total (Mobile) */}
              <div className="md:hidden mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-slate-500">Item Total:</span>
                <span className="text-xl font-bold text-[#0A1931]">
                  ₹{((item.price || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
            <h2 className="text-xl font-extrabold tracking-tight text-[#0A1931] mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold text-[#0A1931]">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Shipping</span>
                <span className="font-semibold text-[#0A1931]">
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₹${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tax (8%)</span>
                <span className="font-semibold text-[#0A1931]">₹{tax.toFixed(2)}</span>
              </div>

              {subtotal < 500 && (
                <div className="bg-[#0B56D9]/10 text-[#0B56D9] p-3 rounded-xl text-sm">
                  Add ₹{(500 - subtotal).toFixed(2)} more to get free shipping!
                </div>
              )}

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold text-[#0A1931]">Total</span>
                  <span className="text-2xl font-extrabold text-[#0B56D9]">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={placing}
              className="w-full bg-[#0B56D9] text-white py-3 rounded-xl font-semibold hover:bg-[#0849B7] transition-colors mb-4 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {placing ? "Placing order…" : "Place Order"}
            </button>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <svg className="size-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Our team confirms every order on WhatsApp
              </div>
              <div className="flex items-center gap-2">
                <svg className="size-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free returns within 30 days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
