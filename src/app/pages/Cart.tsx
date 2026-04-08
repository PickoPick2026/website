import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
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
          <ShoppingBag className="size-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="size-5" />
          Continue Shopping
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="size-24 sm:size-32 object-cover rounded-lg"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-2 truncate">{item.name}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                   ₹{(item.price || 0).toFixed(2)}
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="size-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>

                {/* Item Total (Desktop) */}
                <div className="hidden md:block text-right">
                  <p className="text-sm text-gray-500 mb-1">Item Total</p>
                  <p className="text-xl font-bold">
                    ₹{((item.price || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Item Total (Mobile) */}
              <div className="md:hidden mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-gray-600">Item Total:</span>
                <span className="text-xl font-bold">
                  ₹{((item.price || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₹${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-semibold">₹{tax.toFixed(2)}</span>
              </div>

              {subtotal < 500 && (
                <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm">
                  Add ₹{(500 - subtotal).toFixed(2)} more to get free shipping!
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl mb-4"
            >
              Proceed to Checkout
            </button>

            <div className="space-y-2 text-sm text-gray-600">
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
