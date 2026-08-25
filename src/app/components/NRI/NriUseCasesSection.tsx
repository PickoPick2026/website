import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface NriUseCasesSectionProps {
  onOpenConsultation: () => void;
}

export const NriUseCasesSection: React.FC<NriUseCasesSectionProps> = ({ onOpenConsultation }) => (
  <section id="use-cases" className="border-b border-slate-200 bg-white py-14 sm:py-20">
    <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-8 lg:grid-cols-2 lg:gap-14">
      <div className="max-w-xl">
        <span className="rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">Real NRI life scenarios</span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0A1931] sm:text-4xl">Built around life away from home.</h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">From homemade snacks and festive apparel to multi-store shopping orders, we help you bring a piece of India to your doorstep abroad.</p>
        <div className="mt-6 space-y-3 text-sm text-slate-700"><p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#0B56D9]" /> Shop, collect, consolidate and ship in one place</p><p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#0B56D9]" /> Support for gifts, groceries, personal items and business orders</p><p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#0B56D9]" /> Guidance before you book, at no cost</p></div>
        <button onClick={onOpenConsultation} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0B56D9] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#0849B7]"><span>Book for this requirement</span><ArrowRight className="h-4 w-4" /></button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-blue-50"><img src="/images/nri-life-scenarios-v1.png" alt="Pick O Pick concierge carrying Indian goods for international delivery" className="h-full w-full object-cover" /></div>
    </div>
  </section>
);
