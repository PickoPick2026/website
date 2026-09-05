import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package, MapPin, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/src/lib/supabase";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string | null;
}

interface Order {
  id: string;
  order_code: string;
  created_at: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  customer_name: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  order_items: OrderItem[];
}

const formatStatus = (status: string) =>
  status ? status.charAt(0) + status.slice(1).toLowerCase() : "Placed";

export default function TransactionDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, order_code, created_at, status, payment_status, payment_method, subtotal, shipping, tax, total, customer_name, customer_phone, shipping_address, order_items(id, name, quantity, price, image)"
        )
        .eq("order_code", id)
        .maybeSingle();

      if (error) {
        console.error(error);
      } else {
        setOrder(data as Order | null);
      }
      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Package className="size-20 mx-auto text-slate-300 mb-6" />
        <h1 className="text-2xl font-extrabold tracking-tight text-[#0A1931] mb-3">Order not found</h1>
        <p className="text-slate-500 mb-8">We couldn't find an order with that reference.</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0B56D9] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0849B7]"
        >
          <ArrowLeft className="size-5" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const items = order.order_items || [];
  const isPaid = order.payment_status === "PAID";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-[#0A1931] transition-colors"
        >
          <ArrowLeft className="size-5" />
          Back to Orders
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0A1931] mb-2">Order Details</h1>
            <p className="text-slate-600">
              Reference: <span className="font-semibold text-[#0A1931]">{order.order_code}</span>
            </p>
            <p className="text-slate-600">
              Placed on{" "}
              {new Date(order.created_at).toLocaleDateString("en-IN", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-8 text-green-600" />
            <div>
              <p className="text-sm text-slate-500">Status</p>
              <p className="text-xl font-semibold text-[#0A1931]">{formatStatus(order.status)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Package className="size-6 text-[#0B56D9]" />
              <h2 className="text-xl font-extrabold tracking-tight text-[#0A1931]">Order Items</h2>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                  <img
                    src={item.image || "/no-image.png"}
                    alt={item.name}
                    className="size-24 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1 text-[#0A1931]">{item.name}</h3>
                    <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                    <p className="text-[#0B56D9] font-semibold mt-2">
                      ₹{Number(item.price).toFixed(2)} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#0A1931]">
                      ₹{(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next steps */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="size-6 text-[#0B56D9]" />
              <h2 className="text-xl font-extrabold tracking-tight text-[#0A1931]">What happens next</h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">
              Our team will review your order and contact you on WhatsApp
              {order.customer_phone ? ` at ${order.customer_phone}` : ""} to confirm
              {isPaid ? " delivery details." : " payment and delivery details."}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-xl font-extrabold tracking-tight text-[#0A1931] mb-6">Order Summary</h2>

            <div className="space-y-3 mb-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold text-[#0A1931]">₹{Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Shipping</span>
                <span className="font-semibold text-[#0A1931]">
                  {Number(order.shipping) === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₹${Number(order.shipping).toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Tax</span>
                <span className="font-semibold text-[#0A1931]">₹{Number(order.tax).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold text-[#0A1931]">Total</span>
                  <span className="text-2xl font-extrabold text-[#0B56D9]">
                    ₹{Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Payment: {isPaid ? "Paid" : "Pending"} · {order.payment_method === "OFFLINE" ? "Confirmed with our team" : order.payment_method}
            </p>
          </div>

          {/* Shipping Address */}
          {(order.shipping_address || order.customer_name) && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="size-6 text-[#0B56D9]" />
                <h2 className="text-xl font-extrabold tracking-tight text-[#0A1931]">Shipping Address</h2>
              </div>
              <div className="space-y-1 text-slate-600">
                {order.customer_name && <p className="font-semibold text-[#0A1931]">{order.customer_name}</p>}
                {order.shipping_address && <p className="text-sm">{order.shipping_address}</p>}
                {order.customer_phone && <p className="text-sm pt-2">{order.customer_phone}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
