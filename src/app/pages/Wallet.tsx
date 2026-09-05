import { useState } from "react";
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, DollarSign } from "lucide-react";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending";
}

const transactions: Transaction[] = [
 
];

export default function Wallet() {
  const [walletBalance] = useState(2458.76);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState("");

  const quickAmounts = [100, 500, 1000, 2000];

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock add money
    setShowAddMoney(false);
    setAmount("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-[#0A1931] mb-8">My Wallet</h1>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Wallet Balance Card */}
        <div className="lg:col-span-2">
          <div
            className="relative overflow-hidden rounded-2xl bg-[#0B56D9] bg-cover bg-center p-8 text-white shadow-xl"
            style={{ backgroundImage: "url('/images/nri-hero-logistics-v2.webp')" }}
          >
            <div className="absolute inset-0 bg-[#0A1931]/70" />
            <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="size-12 bg-white/20 rounded-full flex items-center justify-center">
                  <WalletIcon className="size-6" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Available Balance</p>
                  <h2 className="text-4xl font-bold">00</h2>
                </div>
              </div>
              <button
                onClick={() => setShowAddMoney(true)}
                className="flex items-center gap-2 px-6 py-3 bg-white text-[#0B56D9] rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                <Plus className="size-5" />
                Add Money
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Spent</p>
                <p className="text-xl font-bold">00</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Earned</p>
                <p className="text-xl font-bold">00</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Cashback</p>
                <p className="text-xl font-bold">00</p>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 bg-green-100 rounded-xl flex items-center justify-center">
                <ArrowDownLeft className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Money Received</p>
                <p className="text-xl font-bold text-green-600">00</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">This month</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 bg-red-100 rounded-xl flex items-center justify-center">
                <ArrowUpRight className="size-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Money Spent</p>
                <p className="text-xl font-bold text-red-600">00</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">This month</p>
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-extrabold tracking-tight text-[#0A1931] mb-6">Add Money to Wallet</h3>

            <form onSubmit={handleAddMoney}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Enter Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-300 rounded-xl text-2xl font-bold focus:ring-2 focus:ring-[#0B56D9] focus:border-transparent outline-none"
                    placeholder="0.00"
                    min="10"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-slate-700 mb-3">Quick Select</p>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      type="button"
                      onClick={() => setAmount(quickAmount.toString())}
                      className="px-4 py-3 border-2 border-slate-300 rounded-xl font-semibold text-[#0A1931] hover:border-[#0B56D9] hover:text-[#0B56D9] transition-colors"
                    >
                      ${quickAmount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Payment Method
                </label>
                <div className="flex items-center gap-3 p-4 border-2 border-slate-300 rounded-xl">
                  <CreditCard className="size-6 text-slate-600" />
                  <div>
                    <p className="font-semibold text-[#0A1931]">Credit Card</p>
                    <p className="text-sm text-slate-500">Visa •••• 4242</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#0B56D9] text-white py-3 rounded-xl font-semibold hover:bg-[#0849B7] transition-colors"
                >
                  Add Money
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMoney(false)}
                  className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-extrabold tracking-tight text-[#0A1931]">Transaction History</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`size-12 rounded-full flex items-center justify-center ${
                      transaction.type === "credit"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.type === "credit" ? (
                      <ArrowDownLeft className="size-6" />
                    ) : (
                      <ArrowUpRight className="size-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A1931]">{transaction.description}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(transaction.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-xl font-bold ${
                      transaction.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}$
                    {transaction.amount.toFixed(2)}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
