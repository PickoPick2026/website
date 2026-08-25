import React from 'react';
import { 
  ShoppingBag, 
  Package, 
  Utensils, 
  Gift, 
  Layers, 
  Truck, 
  Check, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { ServiceTypeId } from './types';
import { NRI_SERVICES } from './data/mockData';

interface ServiceSelectorProps {
  selectedService: ServiceTypeId;
  onSelectService: (id: ServiceTypeId) => void;
  onContinueToForm: () => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedService,
  onSelectService,
  onContinueToForm,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingBag':
        return ShoppingBag;
      case 'Package':
        return Package;
      case 'Utensils':
        return Utensils;
      case 'Gift':
        return Gift;
      case 'Layers':
        return Layers;
      case 'Truck':
        return Truck;
      default:
        return Package;
    }
  };

  return (
    <section id="services" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-slate-800 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6321]" />
            NRI Service Catalog
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A1931] tracking-tight">
            What Do You Need From India?
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Choose the service that fits your requirement.
          </p>
        </div>

        {/* 6 Selectable Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {NRI_SERVICES.map((service) => {
            const isSelected = selectedService === service.id;
            const Icon = getIcon(service.iconName);

            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                onClick={() => onSelectService(service.id)}
                className={`group relative rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-2 border-[#FF6321] shadow-xl ring-2 ring-[#FF6321]/20'
                    : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Active Orange Indicator Bar & Badge */}
                {isSelected && (
                  <div className="absolute -top-3 right-6 bg-[#FF6321] text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Selected Service</span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#0A1931] text-[#FF6321]'
                          : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {service.badge && (
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#0A1931] tracking-tight">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-xs font-semibold text-[#FF6321]">
                    {service.tagline}
                  </p>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Popular Items Pills */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
                      Common Items Handled:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {service.popularItems.map((item, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-100"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Selection Trigger */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span
                    className={`text-xs font-bold transition-colors ${
                      isSelected ? 'text-[#0A1931]' : 'text-slate-500 group-hover:text-slate-900'
                    }`}
                  >
                    {isSelected ? 'Ready in Booking Form' : 'Select This Service'}
                  </span>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#FF6321] text-white'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-700'
                    }`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Anchor to Form */}
        <div className="mt-10 text-center">
          <button
            onClick={onContinueToForm}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0A1931] hover:bg-[#132646] text-white text-xs font-bold shadow-lg shadow-slate-900/15 transition-all cursor-pointer uppercase tracking-wider"
          >
            <span>Proceed to Step 02: Package Details</span>
            <ArrowRight className="w-4 h-4 text-[#FF6321]" />
          </button>
        </div>

      </div>
    </section>
  );
};
