import React from 'react';
import { ArrowRight, Headphones, PackageCheck, ShoppingBag, Sparkles } from 'lucide-react';

interface FreeConsultationModuleProps {
  onOpenConsultation: () => void;
}

const reasons = [
  { icon: Headphones, title: 'Speak to shipping experts', text: 'Get clear guidance on what can travel and how to prepare it.' },
  { icon: ShoppingBag, title: 'Buy & ship with confidence', text: 'Share shopping links or requests and let our India team coordinate.' },
  { icon: PackageCheck, title: 'Consolidate one smarter shipment', text: 'Bring purchases, gifts and family parcels together before dispatch.' },
];

export const FreeConsultationModule: React.FC<FreeConsultationModuleProps> = ({ onOpenConsultation }) => (
  <section id="consultation-section" className="border-y border-blue-100 bg-[#F7F9FF] py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0B56D9]"><Headphones className="h-4 w-4" /> Premium NRI support</span>
        <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#0A1931] sm:text-5xl">NRI Concierge Desk</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">A dedicated India-side team for the things that are harder to arrange from abroad. Start with a quick, no-obligation conversation before you ship.</p>
      </div>

      <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0B56D9]">Why a consultation helps</p>
          <h3 className="mt-3 text-2xl font-extrabold leading-tight text-[#0A1931] sm:text-3xl">Plan your India shipment once, with the right answers from the start.</h3>
          <div className="mt-7 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {reasons.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0B56D9]"><Icon className="h-5 w-5" /></div><div><h4 className="text-sm font-bold text-[#0A1931]">{title}</h4><p className="mt-1 text-xs leading-relaxed text-slate-600">{text}</p></div></div>)}
          </div>
          <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-[#0A1931]"><Sparkles className="mr-2 inline h-4 w-4 text-[#0B56D9]" /><strong>Travelling soon?</strong> Ask what you can and cannot send, then visit our page for a free consultation.</div>
          <button onClick={onOpenConsultation} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0B56D9] px-6 py-3.5 text-xs font-extrabold tracking-wide text-white hover:bg-[#0849B7]">BOOK FREE SHIPPING CONSULTATION <ArrowRight className="h-4 w-4" /></button>
        </div>
        <div className="order-1 overflow-hidden rounded-3xl border border-blue-100 bg-white lg:order-2"><img src="/images/nri-concierge-call-center-v1.png" loading="lazy" alt="Pick O Pick NRI concierge support agent" className="aspect-[4/5] h-full w-full object-cover" /></div>
      </div>
    </div>
  </section>
);
