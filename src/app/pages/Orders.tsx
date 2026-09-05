import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, Search, Calendar } from "lucide-react";
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
  total: number;
  order_items: OrderItem[];
}

const statusColors: Record<string, string> = {
  PLACED: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-amber-100 text-amber-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const formatStatus = (status: string) =>
  status ? status.charAt(0) + status.slice(1).toLowerCase() : "Placed";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.customerID) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("id, order_code, created_at, status, total, order_items(id, name, quantity, price, image)")
        .eq("customer_id", String(user.customerID))
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setOrders((data as Order[]) || []);
      }
      setLoading(false);
    };

    load();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.order_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-[#0A1931] mb-8">My Orders</h1>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order reference..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B56D9] focus:border-transparent outline-none transition"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B56D9] focus:border-transparent outline-none transition"
        >
          <option value="all">All Orders</option>
          <option value="PLACED">Placed</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="size-24 mx-auto text-slate-300 mb-6" />
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1931] mb-4">No orders found</h2>
          <p className="text-slate-500 mb-8">
            {searchQuery || filterStatus !== "all"
              ? "Try adjusting your filters"
              : "Start shopping to see your orders here"}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#0B56D9] text-white rounded-xl hover:bg-[#0849B7] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const items = order.order_items || [];
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {/* Order Header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <p className="text-sm text-slate-500">Order Reference</p>
                      <p className="font-semibold text-[#0A1931]">{order.order_code}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-500">Order Date</p>
                        <p className="font-semibold text-[#0A1931]">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Total</p>
                      <p className="font-semibold text-[#0B56D9]">₹{Number(order.total).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        statusColors[order.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {formatStatus(order.status)}
                    </span>
                    <Link
                      to={`/transaction/${order.order_code}`}
                      className="flex items-center gap-2 px-4 py-2 text-[#0B56D9] hover:bg-[#0B56D9]/5 rounded-xl transition-colors"
                    >
                      View Details
                      <ChevronRight className="size-5" />
                    </Link>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <img
                          src={item.image || "/no-image.png"}
                          alt={item.name}
                          className="size-20 object-cover rounded-xl"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1 text-[#0A1931]">{item.name}</h4>
                          <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                          <p className="text-sm font-semibold text-[#0B56D9]">
                            ₹{Number(item.price).toFixed(2)} each
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#0A1931]">
                            ₹{(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
