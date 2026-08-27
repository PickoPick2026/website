import React from 'react';
import { 
  Headphones, 
  Calculator,
  ArrowUpRight 
} from 'lucide-react';

interface QuickActionsProps {
  onOpenConsultation: () => void;
  onOpenEstimator: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onOpenConsultation,
  onOpenEstimator,
}) => {
  const cards = [
    {
      id: 'card-consultation',
      number: 'CARD 01',
      title: 'BOOK FREE CONSULTATION',
      description: 'Not sure what you need? Talk to our team before you ship.',
      cta: 'Book Consultation',
      icon: Headphones,
      action: onOpenConsultation,
      accent: 'border-slate-200 hover:border-slate-300 bg-white',
      btnStyle: 'text-[#0A1931] bg-slate-100 hover:bg-slate-200',
    },
    {
      id: 'card-get-estimate',
      number: 'CARD 02',
      title: 'GET SHIPPING ESTIMATE',
      description: 'Tell us your destination and package details.',
      cta: 'Get Estimate',
      icon: Calculator,
      action: onOpenEstimator,
      accent: 'border-slate-200 hover:border-slate-300 bg-white',
      btnStyle: 'text-[#0A1931] bg-slate-100 hover:bg-slate-200',
    },
  ];

  return (
    <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              id={card.id}
              className={`rounded-2xl border p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${card.accent}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                   <div />
                </div>

                <h3 className="text-sm font-extrabold text-[#0A1931] tracking-tight leading-snug">
                  {card.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={card.action}
                  className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 group cursor-pointer ${card.btnStyle}`}
                >
                  <span>{card.cta}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
