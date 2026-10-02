import { Link } from "react-router-dom";
import { CalendarCheck, Crown, MessageCircleHeart } from "lucide-react";

export function PremiumCta() {
  return (
    <section
      id="premium-services"
      className="bg-[#F7F9FF] py-14 scroll-mt-28 sm:py-20"
      aria-label="NRI Premium Services"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <div className="rounded-3xl border border-blue-100 bg-white p-7 text-center shadow-sm sm:p-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#0B56D9]">
            <Crown size={13} aria-hidden="true" />
            NRI Premium Service
          </span>

          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-[#0A1931] sm:text-4xl">
            Premium picks for <span className="text-[#0B56D9]">premium shipping.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            A dedicated service team, priority handling, personal account
            manager and white-glove support — see what premium gets you, then
            book your consultation immediately.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/nri#booking-portal"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B56D9] px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#0849B7]"
            >
              <CalendarCheck size={15} aria-hidden="true" />
              Book Your Slot
            </Link>
            <Link
              to="/nri"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 bg-white px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50"
            >
              <MessageCircleHeart size={15} aria-hidden="true" />
              Book Your Consultation
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-slate-100 pt-5 text-[11px] font-semibold text-slate-600">
            <span><span className="text-[#0B56D9]">★</span> Dedicated account manager</span>
            <span><span className="text-[#0B56D9]">★</span> Priority pickup &amp; packing</span>
            <span><span className="text-[#0B56D9]">★</span> Free premium consultation</span>
          </div>
        </div>
      </div>
    </section>
  );
}
