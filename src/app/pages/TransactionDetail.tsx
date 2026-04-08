import { Link, useParams } from "react-router";
import { ArrowLeft, Package, MapPin, CreditCard, Truck, CheckCircle, Clock } from "lucide-react";

const mockTransaction = {
  id: "ORD-2026-0001",
  date: "2026-03-20",
  status: "delivered",
  deliveryDate: "2026-03-24",
  items: [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      quantity: 1,
      price: 299.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzc0NDYxNTE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 2,
      name: "Wireless Gaming Mouse",
      quantity: 2,
      price: 89.99,
      image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMG1vdXNlfGVufDF8fHx8MTc3NDQ4NDE2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 3,
      name: "Mechanical Gaming Keyboard",
      quantity: 1,
      price: 159.99,
      image: "https://images.unsplash.com/photo-1705488387173-b3e4890259ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZXlib2FyZCUyMG1lY2hhbmljYWx8ZW58MXx8fHwxNzc0NDQwODM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ],
  shippingAddress: {
    name: "John Doe",
    street: "123 Main Street, Apt 4B",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    phone: "+1 (555) 123-4567",
  },
  payment: {
    method: "Credit Card",
    last4: "4242",
    brand: "Visa",
  },
  pricing: {
    subtotal: 639.97,
    shipping: 0,
    tax: 51.20,
    total: 691.17,
  },
  tracking: {
    carrier: "FedEx",
    trackingNumber: "FDX123456789",
    steps: [
      { label: "Order Placed", date: "Mar 20, 2026", completed: true },
      { label: "Processing", date: "Mar 20, 2026", completed: true },
      { label: "Shipped", date: "Mar 21, 2026", completed: true },
      { label: "Out for Delivery", date: "Mar 24, 2026", completed: true },
      { label: "Delivered", date: "Mar 24, 2026", completed: true },
    ],
  },
};

export default function TransactionDetails() {
  const { id } = useParams();
  const transaction = mockTransaction;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="size-5" />
          Back to Orders
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order Details</h1>
            <p className="text-gray-600">
              Order ID: <span className="font-semibold">{transaction.id}</span>
            </p>
            <p className="text-gray-600">
              Placed on{" "}
              {new Date(transaction.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="size-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-xl font-semibold text-green-600 capitalize">
                {transaction.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Tracking */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="size-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold">Order Tracking</h2>
                <p className="text-sm text-gray-600">
                  {transaction.tracking.carrier} • {transaction.tracking.trackingNumber}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {transaction.tracking.steps.map((step, index) => (
                <div key={index} className="flex gap-4 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`size-10 rounded-full flex items-center justify-center ${
                        step.completed
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="size-6" />
                      ) : (
                        <Clock className="size-6" />
                      )}
                    </div>
                    {index !== transaction.tracking.steps.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 mt-2 ${
                          step.completed ? "bg-green-600" : "bg-gray-200"
                        }`}
                        style={{ minHeight: "2rem" }}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <p
                      className={`font-semibold ${
                        step.completed ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-sm text-gray-600">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Package className="size-6 text-blue-600" />
              <h2 className="text-xl font-bold">Order Items</h2>
            </div>

            <div className="space-y-4">
              {transaction.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-blue-600 font-semibold mt-2">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  ${transaction.pricing.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {transaction.pricing.shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `$${transaction.pricing.shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">
                  ${transaction.pricing.tax.toFixed(2)}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${transaction.pricing.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="size-6 text-blue-600" />
              <h2 className="text-xl font-bold">Shipping Address</h2>
            </div>
            <div className="space-y-1 text-gray-700">
              <p className="font-semibold">{transaction.shippingAddress.name}</p>
              <p>{transaction.shippingAddress.street}</p>
              <p>
                {transaction.shippingAddress.city}, {transaction.shippingAddress.state}{" "}
                {transaction.shippingAddress.zipCode}
              </p>
              <p className="text-sm pt-2">{transaction.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="size-6 text-blue-600" />
              <h2 className="text-xl font-bold">Payment Method</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <CreditCard className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">
                  {transaction.payment.brand} •••• {transaction.payment.last4}
                </p>
                <p className="text-sm text-gray-600">{transaction.payment.method}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Download Invoice
            </button>
            <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
