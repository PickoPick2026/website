import React from 'react';
import { TRUST_PILLARS } from './data/mockData';

const trustIllustrations: Record<string, string> = {
  'Shop From India': '/images/nri-trust/shop-from-india.webp',
  'Source With Confidence': '/images/nri-trust/source-with-confidence.webp',
  'Consolidate Multiple Purchases': '/images/nri-trust/consolidate-purchases.webp',
  'Professional Packing': '/images/nri-trust/professional-packing.webp',
  'International Shipping': '/images/nri-trust/international-shipping.webp',
  'Personal Support': '/images/nri-trust/personal-support.webp',
};

export const WhyChooseUsSection: React.FC = () => {
  return (
    <section id="why-us" className="py-16 sm:py-20 bg-[#F1F5F9] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0A1931] bg-slate-200 px-3.5 py-1.5 rounded-full border border-slate-300">
            The NRI Standard of Trust
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1931] tracking-tight mt-3">
            Why NRI Customers Choose <span className="text-[#0B56D9]">Pick O Pick</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Engineered specifically around the expectations of overseas Indians: absolute transparency, WhatsApp visual confirmations, and zero compromise on package safety.
          </p>
        </div>

        {/* 6 Trust Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRUST_PILLARS.map((pillar) => {
            return (
              <div
                key={pillar.title}
                className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 hover:border-[#0B56D9]/40 transition-colors duration-200"
              >
                <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] mb-5 flex items-center justify-center">
                  <img
                    src={trustIllustrations[pillar.title]}
                    alt=""
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>

                <h3 className="text-base font-extrabold text-[#0A1931] tracking-tight">
                  {pillar.title}
                </h3>

                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
