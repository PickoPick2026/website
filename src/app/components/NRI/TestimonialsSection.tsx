import React from 'react';
import { Quote, Star, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AUTHENTIC_TESTIMONIALS } from './data/mockData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#F1F5F9] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0A1931] bg-slate-200 px-3.5 py-1.5 rounded-full border border-slate-300">
            Verified Customer Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1931] tracking-tight mt-3">
            Trusted by the Global Indian Community
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Real experiences from families, professionals, and students receiving items from home across the USA, UK, UAE, and Canada.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {AUTHENTIC_TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Header with Destination & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#0A1931] bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    📍 {item.cityDestination}, {item.country}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#0A1931] flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {item.serviceUsed}
                  </p>
                </div>

                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
