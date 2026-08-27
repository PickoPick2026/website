import React from 'react';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Clock, 
  PhoneCall,
  ChevronDown,
} from 'lucide-react';
import { BookingFormData } from './types';
import { NRI_SERVICES } from './data/mockData';
import { FaWhatsapp } from 'react-icons/fa';

interface BookingSummaryProps {
  formData: BookingFormData;
  currentStep: number;
  onOpenEstimator?: () => void;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  formData,
  currentStep,
  onOpenEstimator,
}) => {
  const selectedServiceObj = NRI_SERVICES.find((s) => s.id === formData.serviceType);
  const selectedServiceNames = NRI_SERVICES
    .filter((service) => formData.selectedServices.includes(service.id))
    .map((service) => service.title);

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
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden sticky top-24">
      {/* Content */}
      <div className="p-5 space-y-3">
        
        {/* Service */}
        <details className="group border-b border-slate-100">
          <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-xs font-bold text-[#0A1931]">
            <span><span className="mr-2 text-[10px] font-mono text-[#0B56D9]">01</span>Service</span>
            <ChevronDown className="h-4 w-4 text-[#0B56D9] transition-transform group-open:rotate-180" />
          </summary>
        <div className="pb-3">
          <div>
            <p className="text-xs font-bold text-[#0A1931] mt-0.5">
              {selectedServiceNames.length ? selectedServiceNames.join(', ') : selectedServiceObj ? selectedServiceObj.title : 'Not Selected'}
            </p>
            {formData.requirementDescription && (
              <p className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-1">
                "{formData.requirementDescription}"
              </p>
            )}
          </div>
        </div>
        </details>

        {/* Package Specs */}
        <details className="group border-b border-slate-100">
          <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-xs font-bold text-[#0A1931]">
            <span><span className="mr-2 text-[10px] font-mono text-[#0B56D9]">02</span>Package Details</span>
            <ChevronDown className="h-4 w-4 text-[#0B56D9] transition-transform group-open:rotate-180" />
          </summary>
        <div className="pb-3">
          <div>
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
        </div>
        </details>

        {/* Destination */}
        <details className="group border-b border-slate-100">
          <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-xs font-bold text-[#0A1931]">
            <span><span className="mr-2 text-[10px] font-mono text-[#0B56D9]">03</span>Destination</span>
            <ChevronDown className="h-4 w-4 text-[#0B56D9] transition-transform group-open:rotate-180" />
          </summary>
        <div className="pb-3">
          <div>
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
        </div>
        </details>

        {/* Pickup Schedule */}
        <details className="group border-b border-slate-100">
          <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-xs font-bold text-[#0A1931]">
            <span><span className="mr-2 text-[10px] font-mono text-[#0B56D9]">04</span>Pickup Schedule</span>
            <ChevronDown className="h-4 w-4 text-[#0B56D9] transition-transform group-open:rotate-180" />
          </summary>
        <div className="pb-3">
          <div>
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
        </div>
        </details>

        {/* Pickup Location */}
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-xs font-bold text-[#0A1931]">
            <span><span className="mr-2 text-[10px] font-mono text-[#0B56D9]">05</span>Pickup Location</span>
            <ChevronDown className="h-4 w-4 text-[#0B56D9] transition-transform group-open:rotate-180" />
          </summary>
        <div className="pb-2">
          <div>
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
        </div>
        </details>

        {/* Dynamic Rate Guidance Action */}
        {onOpenEstimator && (
          <div className="pt-2">
            <button
              onClick={onOpenEstimator}
               className="w-full rounded-xl border border-[#0B56D9] bg-white px-3 py-2.5 text-xs font-bold text-[#0B56D9] transition-colors hover:bg-blue-50 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Check Estimated Shipping Rate</span>
            </button>
          </div>
        )}

        {/* Human Concierge Footer Help */}
        <div className="border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 rounded-b-2xl p-4 pt-3">
          <a
            href="https://wa.me/919876543210?text=Hello%20Pick%20O%20Pick!%20I%20am%20filling%20out%20my%20NRI%20booking%20and%20need%20help."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
              <FaWhatsapp className="h-4 w-4" />
            <span>Chat With Pick O Pick</span>
          </a>
        </div>

      </div>
    </div>
  );
};
