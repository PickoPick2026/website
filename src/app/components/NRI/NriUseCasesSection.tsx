import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NriUseCasesSection: React.FC = () => (
  <section id="use-cases" className="scroll-mt-28 border-b border-slate-200 bg-white py-14 sm:py-20">
    <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-8 lg:grid-cols-2 lg:gap-14">
      <div className="max-w-xl">
        <span className="rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#0B56D9]">
          Explore NRI Premium Services
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0A1931] sm:text-4xl">
          Your requests, handled by a team in India.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          From homemade snacks and festive apparel to multi-store shopping orders, we help you bring a piece of India to your doorstep abroad.
        </p>
        <div className="mt-6 space-y-3 text-sm text-slate-700">
          <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#0B56D9]" /> Shop, collect, consolidate and ship in one place</p>
          <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#0B56D9]" /> Support for gifts, groceries, personal items and business orders</p>
          <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#0B56D9]" /> Guidance before you book, at no cost</p>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-slate-600">Need ingredients sourced or chillies ground before shipping? Tell your concierge what you need. We will confirm preparation options, packing and destination rules before arranging your order.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/buy-and-ship" className="rounded-full border border-blue-200 px-4 py-2 text-sm font-bold text-[#0B56D9] hover:bg-blue-50">Explore Buy &amp; Ship</Link>
          <Link to="/order-and-send" className="rounded-full border border-blue-200 px-4 py-2 text-sm font-bold text-[#0B56D9] hover:bg-blue-50">Explore Order &amp; Send</Link>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-blue-100 bg-blue-50">
        <img
          src="/images/nri-life-scenarios-v1.webp"
          alt="Pick O Pick concierge carrying Indian goods for international delivery"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </div>
  </section>
);
