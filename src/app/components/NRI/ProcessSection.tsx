import React from 'react';
import { 
  MessageSquare, 
  Store, 
  Boxes, 
  ShieldCheck, 
  Plane, 
  Home, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PROCESS_STEPS } from './data/mockData';

export const ProcessSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare': return MessageSquare;
      case 'Store': return Store;
      case 'Boxes': return Boxes;
      case 'ShieldCheck': return ShieldCheck;
      case 'Plane': return Plane;
      case 'Home': return Home;
      default: return Sparkles;
    }
  };

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF6321] bg-orange-50 px-3.5 py-1.5 rounded-full border border-orange-200">
            End-To-End NRI Logistics
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1931] tracking-tight mt-3">
            From India To You — We Handle The Rest.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            A frictionless six-step journey connecting Indian markets and hometown doorsteps directly to your overseas address.
          </p>
        </div>

        {/* 6 Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {PROCESS_STEPS.map((step, idx) => {
            const Icon = getIcon(step.icon);
            return (
              <div
                key={step.step}
                className="relative rounded-2xl bg-slate-50 border border-slate-200/80 p-6 sm:p-7 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-2xl font-black font-mono text-[#FF6321]">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#0A1931] flex items-center justify-center shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-[#0A1931] tracking-tight">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/80 flex items-center text-[11px] font-bold text-slate-400 font-mono">
                  <span>STAGE 0{idx + 1} OF 06</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
