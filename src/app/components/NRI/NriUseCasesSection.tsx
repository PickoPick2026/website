import React from 'react';
import { 
  ArrowRight, 
  Heart, 
  Sparkles, 
  ShoppingBag, 
  Package, 
  Utensils, 
  Gift, 
  Layers, 
  Truck 
} from 'lucide-react';
import { NRI_USE_CASES } from './data/mockData';
import { ServiceTypeId } from './types';

interface NriUseCasesSectionProps {
  onSelectUseCase: (serviceId: ServiceTypeId) => void;
}

export const NriUseCasesSection: React.FC<NriUseCasesSectionProps> = ({
  onSelectUseCase,
}) => {
  return (
    <section id="use-cases" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF6321] bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-200">
            Real NRI Life Scenarios
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1931] tracking-tight mt-3">
            Built Around Life Away From Home.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Whether it's the taste of homemade snacks, festive apparel for ceremonies, or multi-box shopping orders, we simplify logistics for the global Indian diaspora.
          </p>
        </div>

        {/* 6 Editorial Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NRI_USE_CASES.map((uc, index) => (
            <div
              key={index}
              className="rounded-2xl bg-slate-50 border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all duration-200 group"
            >
              <div>
                <span className="inline-block text-[11px] font-bold text-[#FF6321] bg-orange-100/60 px-3 py-1 rounded-full mb-3">
                  {uc.tag}
                </span>

                <h3 className="text-lg font-bold text-[#0A1931] tracking-tight leading-snug group-hover:text-[#FF6321] transition-colors">
                  “{uc.question}”
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {uc.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80">
                <button
                  onClick={() => onSelectUseCase(uc.serviceId as ServiceTypeId)}
                  className="w-full py-2.5 px-4 rounded-full text-xs font-bold text-[#0A1931] bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-between transition-colors cursor-pointer group-hover:border-slate-300"
                >
                  <span>Book for this requirement</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FF6321] transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
