import React from 'react';
import { ArrowRight, CheckCircle2, Plane, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onOpenConsultation: () => void;
  onStartBooking: () => void;
  onOpenBlockSlot: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenConsultation, onStartBooking }) => (
  <section
    className="relative overflow-hidden border-b border-blue-700 bg-[#0B56D9] bg-cover bg-center pb-16 pt-28 text-white sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36"
    style={{ backgroundImage: "url('/images/nri-hero-logistics-v2.png')" }}
  >
    <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-8">
      <h1 className="whitespace-nowrap text-[clamp(1.15rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-tight">India is home. We’ll bring it to you.</h1>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-blue-50 sm:text-lg">Shop, source, consolidate, pack and ship from India—without the stress.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button onClick={onOpenConsultation} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-extrabold tracking-wider text-[#0B56D9] transition-colors hover:bg-blue-50"><span>BOOK FREE CONSULTATION</span><ArrowRight className="h-4 w-4" /></button>
        <button onClick={onStartBooking} className="inline-flex items-center justify-center gap-2 rounded-full border border-white bg-[#0B56D9] px-6 py-3.5 text-xs font-extrabold tracking-wider text-white transition-colors hover:bg-[#0849B7]"><span>PLAN YOUR SHIPMENT</span><ArrowRight className="h-4 w-4" /></button>
      </div>
      <div className="mx-auto mt-9 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/25 pt-5 text-xs text-blue-50"><span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Zero hidden fees</span><span className="inline-flex items-center gap-2"><Plane className="h-4 w-4" /> 180+ global routes</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> WhatsApp video proof</span></div>
    </div>
  </section>
);
