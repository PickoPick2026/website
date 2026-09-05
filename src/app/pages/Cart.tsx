import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  inStock: boolean;
}

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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

  const handleCheckout = () => {
    // Create a mock order and navigate to transaction details
    //navigate("/transaction/ORD-2026-0001");
  };

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
              className="w-full bg-[#0B56D9] text-white py-3 rounded-xl font-semibold hover:bg-[#0849B7] transition-colors mb-4"
            >
              Proceed to Checkout
            </button>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <svg className="size-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Secure checkout
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
