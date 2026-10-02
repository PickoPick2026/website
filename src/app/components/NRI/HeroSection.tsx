import React from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Plane, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onStartBooking: () => void;
  onOpenConsultation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartBooking, onOpenConsultation }) => (
  <section
    className="relative overflow-hidden border-b border-blue-100 bg-white bg-cover bg-bottom pb-14 pt-[128px] text-white sm:pb-16 sm:pt-[136px] lg:pb-20 lg:pt-[152px]"
    style={{ backgroundImage: "url('/images/nri-hero-logistics-v2.webp')" }}
  >
    <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-8">
      <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-tight">
        NRI Premium Services
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
        Your dedicated team in India. Personal shopping, priority packing and worldwide shipping, guided by one account manager.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onOpenConsultation}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-extrabold tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50"
        >
          Book Your Consultation <ArrowRight className="h-4 w-4" />
        </button>
        <button type="button" onClick={onStartBooking} className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3.5 text-xs font-bold text-white hover:bg-white/10">Book Shipment Assistance</button>
      </div>
      <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/35 pt-5 text-xs text-white/80">
        <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-200" /> Zero hidden fees</span>
        <span className="inline-flex items-center gap-2"><Plane className="h-4 w-4 text-blue-200" /> 180+ global routes</span>
        <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-blue-200" /> WhatsApp video proof</span>
      </div>
    </div>

    <button
      type="button"
      onClick={() => document.getElementById('consultation-section')?.scrollIntoView({ behavior: 'smooth' })}
      className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-white/80 transition-colors hover:text-white"
      aria-label="Explore your free premium consultation"
    >
      <ChevronDown className="h-7 w-7 animate-bounce" />
    </button>
  </section>
);
