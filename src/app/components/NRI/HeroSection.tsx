import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Plane, 
  PackageCheck, 
  Clock, 
  Sparkles,
  MapPin,
  Building2,
  CalendarCheck2
} from 'lucide-react';

interface HeroSectionProps {
  onOpenConsultation: () => void;
  onStartBooking: () => void;
  onOpenBlockSlot: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenConsultation,
  onStartBooking,
  onOpenBlockSlot,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0A1931] via-[#0F2243] to-[#0A1931] text-white pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-800">
      {/* Subtle architectural background texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Ambient warm navy & orange glow */}
      <div className="absolute -top-40 right-10 w-96 h-96 bg-[#FF6321]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Typography & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Small Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest text-[#FF6321] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#FF6321]"></span>
              PICK O PICK FOR NRIs
            </div>

            {/* Large Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              India Is Home.{' '}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FF6321] via-orange-300 to-amber-200">
                We’ll Bring It To You.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl">
              Shop, source, consolidate, pack and ship from India — without the stress.
            </p>

            {/* Secondary Supporting Line */}
            <p className="text-sm sm:text-base text-slate-300 font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6321]"></span>
              From your hometown to your doorstep abroad.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={onOpenConsultation}
                className="px-6 py-4 rounded-full text-xs font-extrabold bg-white text-[#0A1931] hover:bg-slate-100 shadow-xl shadow-white/5 transition-all flex items-center justify-center gap-2 group cursor-pointer tracking-wider uppercase"
                id="hero-consultation-btn"
              >
                <span>BOOK FREE CONSULTATION</span>
                <ArrowRight className="w-4 h-4 text-[#FF6321] transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={onStartBooking}
                className="px-6 py-4 rounded-full text-xs font-extrabold bg-[#FF6321] hover:bg-orange-600 text-white shadow-lg shadow-[#FF6321]/30 transition-all flex items-center justify-center gap-2 cursor-pointer tracking-wider uppercase"
                id="hero-pickup-btn"
              >
                <span>SCHEDULE YOUR PICKUP</span>
                <CalendarCheck2 className="w-4 h-4" />
              </button>
            </div>

            {/* Micro Trust Proof Points */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Plane className="w-4 h-4 text-[#FF6321] shrink-0" />
                <span>180+ Global Routes</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>WhatsApp Video Proof</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Real-world Editorial Logistics Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-gradient-to-b from-[#0F2243] to-[#0A1931] border border-slate-700/80 p-6 shadow-2xl overflow-hidden">
              
              {/* Card Header with Route Indicator */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    NRI Express Corridor
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#FF6321] bg-[#FF6321]/10 px-2 py-0.5 rounded border border-[#FF6321]/30">
                  Daily Air Flights
                </span>
              </div>

              {/* Editorial Origin -> Hub -> Destination Showcase */}
              <div className="space-y-4">
                {/* Stage 1: Origin Hometown Collection */}
                <div className="p-3.5 rounded-xl bg-[#061020]/90 border border-slate-800 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FF6321]/15 border border-[#FF6321]/30 flex items-center justify-center shrink-0 text-[#FF6321] mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">Your Hometown in India</h4>
                      <span className="text-[10px] text-slate-400 font-mono">STEP 01</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Doorstep collection from Bengaluru, Surat, Delhi, Hyderabad, Punjab, or any PIN code.
                    </p>
                  </div>
                </div>

                {/* Stage 2: Pick O Pick Consolidation Hub */}
                <div className="p-3.5 rounded-xl bg-[#FF6321]/10 border border-[#FF6321]/30 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FF6321] text-white flex items-center justify-center shrink-0 font-black text-sm mt-0.5 shadow-md shadow-[#FF6321]/20">
                    POP
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-orange-200">Pick O Pick Consolidation Hub</h4>
                      <span className="text-[10px] text-[#FF6321] font-mono font-semibold">VERIFIED</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      30-Day Free Storage • Smart Repacking • Vacuum Food Sealing • Photo Approval
                    </p>
                  </div>
                </div>

                {/* Stage 3: Overseas Doorstep Destination */}
                <div className="p-3.5 rounded-xl bg-[#061020]/90 border border-slate-800 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400 mt-0.5">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">Your Doorstep Abroad</h4>
                      <span className="text-[10px] text-emerald-400 font-semibold">3–5 DAYS</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Direct delivery in USA, UK, UAE, Canada, Australia, Singapore & 180+ countries.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Concierge Card Action */}
              <div className="mt-5 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-300">Have a customized requirement?</p>
                  <p className="text-xs font-semibold text-white">Speak with an NRI Logistics Specialist</p>
                </div>
                <button
                  onClick={onOpenBlockSlot}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-800 hover:bg-slate-700 text-[#FF6321] border border-[#FF6321]/30 transition-colors cursor-pointer"
                >
                  Block Slot
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
