import React from "react";
import { Crown, CalendarCheck, ArrowRight } from "lucide-react";

interface PremiumBandProps {
  onOpenConsultation: () => void;
  onStartBooking: () => void;
}

// "NRI Premium Service" header band — shown immediately below the hero so
// every visitor sees the premium tier first.
export const PremiumBand: React.FC<PremiumBandProps> = ({
  onOpenConsultation,
  onStartBooking,
}) => (
  <section
    id="premium-band"
    className="relative overflow-hidden border-b border-blue-100 bg-white"
    aria-label="NRI Premium Service"
  >
    <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0B56D9]">
          <Crown className="h-6 w-6" />
        </span>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0B56D9]">
            NRI Premium Service
          </p>
          <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[#0A1931] sm:text-2xl">
            Premium picks for premium shipping.
          </h2>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-600 sm:text-sm">
            Dedicated service team, priority handling and a personal account
            manager — explore the premium tier and book instantly.
          </p>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto sm:flex-row">
        <button
          type="button"
          onClick={onStartBooking}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B56D9] px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#0849B7] cursor-pointer"
        >
          <CalendarCheck size={14} />
          Book Your Slot
        </button>
        <button
          type="button"
          onClick={onOpenConsultation}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50 cursor-pointer"
        >
          Book Your Consultation
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  </section>
);
