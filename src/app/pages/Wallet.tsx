import { Link } from "react-router-dom";
import { Wallet as WalletIcon, ArrowLeft } from "lucide-react";

export default function Wallet() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-[#0B56D9]/10 text-[#0B56D9]">
          <WalletIcon className="size-7" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#0A1931]">Wallet coming soon</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-600">
          Wallet balance and transactions aren't available yet. For now, our team
          confirms payment for every order directly on WhatsApp.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0B56D9] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0849B7]"
        >
          <ArrowLeft className="size-5" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
