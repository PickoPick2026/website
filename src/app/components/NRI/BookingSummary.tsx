import React from 'react';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { BookingFormData } from './types';
import { NRI_SERVICES } from './data/mockData';

interface BookingSummaryProps {
  formData: BookingFormData;
  currentStep: number;
  isMobileCollapsed?: boolean;
  onToggleMobileCollapse?: () => void;
  onOpenEstimator?: () => void;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  formData,
  currentStep,
  isMobileCollapsed = false,
  onToggleMobileCollapse,
  onOpenEstimator,
}) => {
  const selectedServiceObj = NRI_SERVICES.find((s) => s.id === formData.serviceType);

  const getPackageTypeLabel = (type: string) => {
    switch (type) {
      case 'parcel': return 'Standard Parcel';
      case 'multiple_packages': return 'Multiple Packages';
      case 'fragile': return 'Fragile Items';
      case 'oversized': return 'Oversized Cargo';
      case 'business_shipment': return 'Business Shipment';
      default: return type;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden sticky top-24">
      {/* Header */}
      <div className="bg-[#0A1931] text-white p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FF6321] flex items-center justify-center font-black text-xs text-white">
            POP
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight uppercase">YOUR REQUEST</h3>
            <p className="text-[11px] text-slate-300 font-mono">Live NRI Booking Docket</p>
          </div>
        </div>

        {onToggleMobileCollapse && (
          <button
            onClick={onToggleMobileCollapse}
            className="lg:hidden p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Summary Details"
          >
            {isMobileCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Content */}
      <div className={`p-5 space-y-4 ${isMobileCollapsed ? 'hidden lg:block' : 'block'}`}>
        
        {/* Service */}
        <div className="pb-3 border-b border-slate-100 flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Service
            </span>
            <p className="text-xs font-bold text-[#0A1931] mt-0.5">
              {selectedServiceObj ? selectedServiceObj.title : 'Not Selected'}
            </p>
            {formData.requirementDescription && (
              <p className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-1">
                "{formData.requirementDescription}"
              </p>
            )}
          </div>
          <span className="text-[10px] font-bold text-[#FF6321] bg-orange-50 px-2 py-0.5 rounded shrink-0">
            Step 01
          </span>
        </div>

        {/* Package Specs */}
        <div className="pb-3 border-b border-slate-100 flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Package Details
            </span>
            <p className="text-xs font-bold text-[#0A1931] mt-0.5">
              {getPackageTypeLabel(formData.packageType)} â€¢ {formData.packageCount} {formData.packageCount === 1 ? 'Box' : 'Boxes'}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Approx. Weight: <span className="font-semibold text-slate-800">{formData.approxWeightKg || '1'} kg</span>
              {formData.dimensions.lengthCm && (
                <span> ({formData.dimensions.lengthCm}x{formData.dimensions.widthCm}x{formData.dimensions.heightCm} cm)</span>
              )}
            </p>
            {formData.specialHandling.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {formData.specialHandling.map((tag) => (
                  <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded capitalize">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
            Step 02
          </span>
        </div>

        {/* Destination */}
        <div className="pb-3 border-b border-slate-100 flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Destination
            </span>
            <p className="text-xs font-bold text-[#0A1931] mt-0.5">
              {formData.destinationCountry || 'Country Not Selected'}
            </p>
            {formData.destinationCity && (
              <p className="text-[11px] text-slate-600">
                {formData.destinationCity} {formData.postalCode ? `(${formData.postalCode})` : ''}
              </p>
            )}
            {formData.recipientName && (
              <p className="text-[11px] text-slate-500">
                To: {formData.recipientName}
              </p>
            )}
          </div>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
            Step 03
          </span>
        </div>

        {/* Pickup Schedule */}
        <div className="pb-3 border-b border-slate-100 flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Pickup Schedule
            </span>
            <p className="text-xs font-bold text-[#0A1931] mt-0.5">
              {formData.preferredPickupDate ? (
                new Date(formData.preferredPickupDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              ) : (
                'Select Date'
              )}
            </p>
            <p className="text-[11px] text-[#FF6321] font-semibold">
              {formData.preferredPickupSlotLabel || 'Time Slot Pending'}
            </p>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
            Step 04
          </span>
        </div>

        {/* Pickup Location */}
        <div className="pb-2 flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Pickup Location
            </span>
            <p className="text-xs font-bold text-[#0A1931] mt-0.5">
              {formData.pickupCity ? `${formData.pickupCity}, ${formData.pickupState || 'India'}` : 'Address Pending'}
            </p>
            {formData.pickupPin && (
              <p className="text-[11px] text-slate-600">PIN: {formData.pickupPin}</p>
            )}
            {formData.customerName && (
              <p className="text-[11px] text-slate-500">
                Contact: {formData.customerName} ({formData.customerWhatsapp})
              </p>
            )}
          </div>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
            Step 05
          </span>
        </div>

        {/* Dynamic Rate Guidance Action */}
        {onOpenEstimator && (
          <div className="pt-2">
            <button
              onClick={onOpenEstimator}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6321]" />
              <span>Check Estimated Shipping Rate</span>
            </button>
          </div>
        )}

        {/* Human Concierge Footer Help */}
        <div className="pt-4 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-2xl">
          <p className="text-[11px] font-bold text-[#0A1931] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Need instant guidance?
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Talk to our Indian logistics desk on WhatsApp.
          </p>
          <a
            href="https://wa.me/919876543210?text=Hello%20Pick%20O%20Pick!%20I%20am%20filling%20out%20my%20NRI%20booking%20and%20need%20help."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat With Pick O Pick</span>
          </a>
        </div>

      </div>
    </div>
  );
};
