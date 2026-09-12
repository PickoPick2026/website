import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  X, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Plus, 
  Minus, 
  MessageSquare, 
  Printer, 
  Sparkles,
  CheckCircle2,
  FileText,
  Building,
  User,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  BookingFormData, 
  ServiceTypeId, 
  PackageTypeId, 
  SpecialHandlingId, 
  TimeSlot, 
  UploadedFileMeta 
} from './types';
import { 
  NRI_SERVICES, 
  POPULAR_NRI_COUNTRIES, 
  ALL_SUPPORTED_COUNTRIES 
} from './data/mockData';
import { BookingSummary } from './BookingSummary';
import { ServiceCards } from './ServiceCards';

interface BookingFlowProps {
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  onOpenEstimator: () => void;
  onResetBooking: () => void;
  startStep?: number;
}

const STEP_LABELS = [
  { step: 1, name: 'SERVICE', title: 'Tell Us What You Need' },
  { step: 2, name: 'PACKAGE', title: 'Tell Us About Your Package' },
  { step: 3, name: 'DESTINATION', title: 'Where Are We Sending It?' },
  { step: 4, name: 'PICKUP', title: 'Choose Your Pickup Slot' },
  { step: 5, name: 'CONTACT & ADDRESS', title: 'Where Should We Pick It Up?' },
  { step: 6, name: 'CONFIRM', title: 'Your Request Is With Us' },
];

const toDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const BookingFlow: React.FC<BookingFlowProps> = ({
  formData,
  setFormData,
  onOpenEstimator,
  onResetBooking,
  startStep,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<{
    bookingId: string;
    whatsappUrl: string;
    createdAt: string;
    emailSent: boolean;
  } | null>(null);

  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCustomDate, setIsCustomDate] = useState(false);
  const pickupDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index);
    return { value: toDateValue(date), date };
  });

  useEffect(() => {
    if (startStep && startStep > 1) setCurrentStep(startStep);
  }, [startStep]);

  // Fetch real backend slots when pickup date changes
  useEffect(() => {
    if (formData.preferredPickupDate) {
      setIsLoadingSlots(true);
      fetch(`/api/slots/availability?date=${formData.preferredPickupDate}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.slots) {
            setAvailableSlots(data.slots);
            // If currently selected slot is full or unavailable, clear or auto-select first available
            const selectedCurrent = data.slots.find((s: TimeSlot) => s.id === formData.preferredPickupSlotId);
            if (!selectedCurrent || selectedCurrent.status === 'FULL' || selectedCurrent.status === 'UNAVAILABLE') {
              const firstAvail = data.slots.find((s: TimeSlot) => s.status === 'AVAILABLE' || s.status === 'LIMITED');
              if (firstAvail) {
                setFormData((prev) => ({
                  ...prev,
                  preferredPickupSlotId: firstAvail.id,
                  preferredPickupSlotLabel: `${firstAvail.timeRange} (${firstAvail.label})`,
                }));
              }
            }
          }
        })
        .catch((err) => {
          console.error('Failed to load slots:', err);
        })
        .finally(() => {
          setIsLoadingSlots(false);
        });
    }
  }, [formData.preferredPickupDate]);

  // Handle Photo Upload with client preview
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files: File[] = Array.from(e.target.files);
      const newPhotos: UploadedFileMeta[] = files.map((file) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: Math.round(file.size / 1024), // in KB
        previewUrl: URL.createObjectURL(file),
      }));

      setFormData((prev) => ({
        ...prev,
        uploadedPhotos: [...prev.uploadedPhotos, ...newPhotos],
      }));
    }
  };

  const removePhoto = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      uploadedPhotos: prev.uploadedPhotos.filter((p) => p.id !== id),
    }));
  };

  const toggleSpecialHandling = (tag: SpecialHandlingId) => {
    setFormData((prev) => {
      const exists = prev.specialHandling.includes(tag);
      return {
        ...prev,
        specialHandling: exists
          ? prev.specialHandling.filter((t) => t !== tag)
          : [...prev.specialHandling, tag],
      };
    });
  };

  const toggleBookingService = (serviceId: ServiceTypeId) => {
    setFormData((prev) => {
      const exists = prev.selectedServices.includes(serviceId);
      const selectedServices = exists && prev.selectedServices.length > 1
        ? prev.selectedServices.filter((id) => id !== serviceId)
        : exists ? prev.selectedServices : [...prev.selectedServices, serviceId];
      return { ...prev, selectedServices, serviceType: selectedServices.includes(prev.serviceType) ? prev.serviceType : selectedServices[0] };
    });
  };

  // Step Validation logic
  const validateStep = (step: number): boolean => {
    setErrorMessage(null);
    if (step === 1) {
      if (!formData.serviceType) {
        setErrorMessage('Please select a service type.');
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!formData.approxWeightKg || Number(formData.approxWeightKg) <= 0) {
        setErrorMessage('Please enter an approximate package weight.');
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!formData.destinationCountry) {
        setErrorMessage('Please specify the destination country.');
        return false;
      }
      if (!formData.recipientName.trim()) {
        setErrorMessage('Please enter the recipient name abroad.');
        return false;
      }
      return true;
    }
    if (step === 4) {
      if (!formData.preferredPickupDate) {
        setErrorMessage('Please choose a preferred pickup date.');
        return false;
      }
      if (formData.preferredPickupDate < toDateValue(new Date())) {
        setErrorMessage('Please choose today or a future pickup date.');
        return false;
      }
      if (!formData.preferredPickupSlotId && !formData.customTimeRequested) {
        setErrorMessage('Please select an available pickup time slot or request a custom time.');
        return false;
      }
      if (!formData.understandTimeMayBeConfirmed) {
        setErrorMessage('Please acknowledge the pickup confirmation checkbox.');
        return false;
      }
      return true;
    }
    if (step === 5) {
      if (!formData.customerName.trim()) {
        setErrorMessage('Please enter your full name.');
        return false;
      }
      if (!formData.customerWhatsapp.trim()) {
        setErrorMessage('Please enter your WhatsApp contact number.');
        return false;
      }
      if (!formData.customerEmail.trim() || !/^\S+@\S+\.\S+$/.test(formData.customerEmail)) {
        setErrorMessage('Please provide a valid email address so we can send your booking confirmation.');
        return false;
      }
      if (!formData.pickupCity.trim() || !formData.pickupAddressLine1.trim()) {
        setErrorMessage('Please enter the complete pickup address in India.');
        return false;
      }
      if (!formData.pickupPin.trim()) {
        setErrorMessage('Please provide the 6-digit Indian PIN code.');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      window.scrollTo({ top: document.getElementById('booking-portal')?.offsetTop || 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrorMessage(null);
  };

  // Final Form Submission
  const handleSubmitBooking = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/nri-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestType: 'pickup_request', payload: formData }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit booking');
      }

      setSubmissionResult({
        bookingId: data.requestId,
        whatsappUrl: data.whatsappUrl,
        createdAt: new Date().toISOString(),
        emailSent: Boolean(data.emailSent),
      });

      setCurrentStep(6);
      
      // Fire celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0A1931', '#FF6321', '#10B981', '#3B82F6'],
        });
      } catch (e) {
        // Safe fallback
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking-portal" className="py-16 sm:py-20 bg-[#F7F9FF]">
      <div className="max-w-7xl mx-auto p-6 rounded-3xl bg-white">
        
        {/* Stepper Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-slate-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A1931] tracking-tight">
                Plan Your India Shipment
              </h2>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mt-8 overflow-x-auto pb-2">
            <div className="relative flex min-w-[680px] items-start justify-between px-3">
              <div className="absolute left-10 right-10 top-4 h-0.5 bg-slate-200" />
              <div
                className="absolute left-10 top-4 h-0.5 bg-[#0B56D9] transition-all"
                style={{ width: `calc(${Math.max(currentStep - 1, 0) / (STEP_LABELS.length - 1) * 100}% - 2.5rem)` }}
              />
              {STEP_LABELS.map((s) => {
                const isCompleted = currentStep > s.step;
                const isCurrent = currentStep === s.step;
                return (
                  <button
                    key={s.step}
                    type="button"
                    disabled={!isCompleted}
                    onClick={() => setCurrentStep(s.step)}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`relative z-10 flex w-24 flex-col items-center gap-2 text-center ${isCompleted ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition-all ${isCompleted ? 'bg-[#0B56D9] text-white' : isCurrent ? 'bg-white text-[#0B56D9] ring-4 ring-blue-100 border-2 border-[#0B56D9]' : 'bg-white text-slate-400 ring-1 ring-slate-300'}`}>
                      {isCompleted ? <Check className="h-4 w-4" /> : `0${s.step}`}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isCurrent ? 'text-[#0B56D9]' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                      {s.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Active Step Form */}
          <div className="lg:col-span-8 bg-slate-50/80 rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            
            {/* Step Heading */}
            <div className="mb-8">
              <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
                STEP 0{currentStep} OF 06
              </span>
              <h3 className="text-2xl font-extrabold text-[#0A1931] tracking-tight mt-1">
                {STEP_LABELS[currentStep - 1].title}
              </h3>
            </div>

            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ----------------- STEP 01: SERVICE ----------------- */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    Select Your Required NRI Service:
                  </label>
                  <ServiceCards selectedServices={formData.selectedServices} onToggleService={toggleBookingService} />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Requirement Details:
                  </label>
                  <textarea
                    rows={4}
                    value={formData.requirementDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, requirementDescription: e.target.value }))}
                    placeholder="Tell us what you want to send or source (e.g. 5kg homemade snacks from Chennai, 3 traditional outfits, college transcripts)..."
                     className="w-full p-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B56D9] focus:border-transparent transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Are you already purchasing the items?
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, alreadyPurchasing: 'yes' }))}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        formData.alreadyPurchasing === 'yes'
                           ? 'bg-[#0B56D9] text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      YES, ITEMS ARE READY / IN CART
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, alreadyPurchasing: 'no' }))}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        formData.alreadyPurchasing === 'no'
                           ? 'bg-[#0B56D9] text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      NO, NEED PICK O PICK TO SOURCE
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- STEP 02: PACKAGE DETAILS ----------------- */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Package Type:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'parcel', label: 'Standard Parcel' },
                      { id: 'multiple_packages', label: 'Multiple Packages' },
                      { id: 'fragile', label: 'Fragile Items' },
                      { id: 'oversized', label: 'Oversized Cargo' },
                      { id: 'business_shipment', label: 'Business Shipment' },
                    ].map((pt) => {
                      const isSelected = formData.packageType === pt.id;
                      return (
                        <button
                          key={pt.id}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, packageType: pt.id as PackageTypeId }))}
                          className={`p-3 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                            isSelected
                               ? 'bg-[#0B56D9] text-white border-[#0B56D9]'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {pt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Approximate Total Weight (kg):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="any"
                        min="0.5"
                        value={formData.approxWeightKg}
                        onChange={(e) => setFormData((prev) => ({ ...prev, approxWeightKg: e.target.value }))}
                        className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                        placeholder="e.g. 5"
                      />
                      <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                        KG
                      </span>
                    </div>

                    {/* Weight Quick Pills */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {[1, 2, 5, 10, 20].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, approxWeightKg: w }))}
                          className="px-2 py-0.5 text-[11px] font-semibold bg-slate-200/80 hover:bg-slate-300 rounded text-slate-700"
                        >
                          {w}kg
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Number of Packages / Boxes:
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, packageCount: Math.max(1, prev.packageCount - 1) }))}
                        className="w-11 h-11 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="flex-1 text-center font-extrabold text-lg text-[#0A1931] bg-white py-2.5 rounded-xl border border-slate-300">
                        {formData.packageCount} {formData.packageCount === 1 ? 'Box' : 'Boxes'}
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, packageCount: prev.packageCount + 1 }))}
                        className="w-11 h-11 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Approximate Dimensions */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Approximate Dimensions (Optional, in cm):
                    </label>
                    <span className="text-[11px] text-slate-400">Used for volumetric check</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Length (cm)"
                      value={formData.dimensions.lengthCm}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dimensions: { ...prev.dimensions, lengthCm: e.target.value } }))}
                      className="p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                    />
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Width (cm)"
                      value={formData.dimensions.widthCm}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dimensions: { ...prev.dimensions, widthCm: e.target.value } }))}
                      className="p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                    />
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Height (cm)"
                      value={formData.dimensions.heightCm}
                      onChange={(e) => setFormData((prev) => ({ ...prev, dimensions: { ...prev.dimensions, heightCm: e.target.value } }))}
                      className="p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                    />
                  </div>
                </div>

                {/* Special Handling */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Special Handling & Item Categories:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'fragile', label: 'Fragile (Glass / Electronics)' },
                      { id: 'food', label: 'Food & Groceries' },
                      { id: 'documents', label: 'Important Documents' },
                      { id: 'valuable', label: 'High Value / Jewelry' },
                      { id: 'liquids_cosmetics', label: 'Ayurvedic Liquids / Cosmetics' },
                      { id: 'other', label: 'General Goods' },
                    ].map((item) => {
                      const isSelected = formData.specialHandling.includes(item.id as SpecialHandlingId);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleSpecialHandling(item.id as SpecialHandlingId)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#FF6321] text-white border-[#FF6321] shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Photo Upload Module */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Upload Photos of Items (Optional):
                  </label>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Photos help our team understand packing and shipping requirements.
                  </p>

                  <div className="border-2 border-dashed border-slate-300 hover:border-[#FF6321]/50 rounded-2xl p-5 text-center bg-white transition-colors">
                    <input
                      type="file"
                      id="photo-upload-input"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="photo-upload-input"
                      className="inline-flex flex-col items-center justify-center cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#0A1931]">
                        Click to upload photos or drag & drop
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        Supports PNG, JPG, JPEG up to 10MB
                      </span>
                    </label>
                  </div>

                  {/* Uploaded Thumbnails */}
                  {formData.uploadedPhotos.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {formData.uploadedPhotos.map((photo) => (
                        <div
                          key={photo.id}
                          className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                        >
                          {photo.previewUrl ? (
                            <img
                              src={photo.previewUrl}
                              alt={photo.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <FileText className="w-6 h-6" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removePhoto(photo.id)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 shadow"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] truncate px-1 py-0.5 text-center">
                            {photo.size} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ----------------- STEP 03: DESTINATION ----------------- */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Popular NRI Destinations (Quick Select):
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {POPULAR_NRI_COUNTRIES.map((c) => {
                      const isSelected = formData.destinationCountry.toLowerCase() === c.toLowerCase();
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, destinationCountry: c }))}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                               ? 'bg-[#0B56D9] text-white border-[#0B56D9]'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Or Select / Enter Destination Country:
                    </label>
                    <select
                      value={formData.destinationCountry}
                      onChange={(e) => setFormData((prev) => ({ ...prev, destinationCountry: e.target.value }))}
                      className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                    >
                      <option value="">-- Choose Country --</option>
                      {ALL_SUPPORTED_COUNTRIES.map((cntry) => (
                        <option key={cntry} value={cntry}>
                          {cntry}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Destination City:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dallas, London, Dubai, Toronto"
                      value={formData.destinationCity}
                      onChange={(e) => setFormData((prev) => ({ ...prev, destinationCity: e.target.value }))}
                      className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      ZIP / Postal Code:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 75001 / SW1A 1AA"
                      value={formData.postalCode}
                      onChange={(e) => setFormData((prev) => ({ ...prev, postalCode: e.target.value }))}
                      className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Recipient Full Name Abroad:
                    </label>
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, recipientName: e.target.value }))}
                      className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Recipient Phone / WhatsApp:
                    </label>
                    <input
                      type="text"
                      value={formData.recipientPhone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, recipientPhone: e.target.value }))}
                      className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1931]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Is this your permanent address?
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, isPermanentAddress: 'yes' }))}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        formData.isPermanentAddress === 'yes'
                           ? 'bg-[#0B56D9] text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      YES, PERMANENT RESIDENCE
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, isPermanentAddress: 'no' }))}
                      className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        formData.isPermanentAddress === 'no'
                           ? 'bg-[#0B56D9] text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      NO, TEMPORARY / WORK / GIFT ADDRESS
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- STEP 04: PICKUP SCHEDULE ----------------- */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-slate-600 mb-4">
                    Pick a date and time that works for you. Our team will coordinate the pickup.
                  </p>

                  {/* Date Selector */}
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Select Pickup Date:
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
                    {pickupDates.map(({ value, date }) => {
                      const isSelected = formData.preferredPickupDate === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setIsCustomDate(false);
                            setFormData((prev) => ({ ...prev, preferredPickupDate: value }));
                          }}
                          className={`rounded-xl border px-2 py-3 text-center transition-colors ${isSelected ? 'border-[#0B56D9] bg-[#0B56D9] text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'}`}
                        >
                          <span className="block text-[10px] font-bold uppercase opacity-80">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <span className="mt-1 block text-lg font-extrabold">{date.getDate()}</span>
                          <span className="block text-[10px] opacity-80">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setIsCustomDate(true)}
                      className={`rounded-xl border px-2 py-3 text-center text-xs font-bold transition-colors ${isCustomDate ? 'border-[#0B56D9] bg-blue-50 text-[#0B56D9]' : 'border-dashed border-slate-300 bg-white text-slate-600 hover:border-blue-300'}`}
                    >
                      Choose another date
                    </button>
                  </div>
                  {isCustomDate && (
                    <input
                      type="date"
                      min={toDateValue(new Date())}
                      value={formData.preferredPickupDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, preferredPickupDate: e.target.value }))}
                      className="mt-3 w-full rounded-xl border border-[#0B56D9] bg-white p-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  )}
                  <p className="mt-2 text-[11px] text-slate-500">Choose today or any day in the next seven days.</p>
                </div>

                {/* Available Time Slots from real backend */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Available Pickup Time Slots:
                    </label>
                    {isLoadingSlots && (
                      <span className="text-[11px] text-[#FF6321] font-semibold animate-pulse">
                        Verifying Live Hub Slots...
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableSlots.map((slot) => {
                      const isSelected = formData.preferredPickupSlotId === slot.id && !formData.customTimeRequested;
                      const isFull = slot.status === 'FULL';
                      const isUnavailable = slot.status === 'UNAVAILABLE';
                      const isLimited = slot.status === 'LIMITED';

                      let badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                      if (isFull) badgeColor = 'bg-red-50 text-red-700 border-red-200';
                      if (isLimited) badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
                      if (isUnavailable) badgeColor = 'bg-slate-100 text-slate-500 border-slate-200';

                      return (
                        <div
                          key={slot.id}
                          onClick={() => {
                            if (!isFull && !isUnavailable) {
                              setFormData((prev) => ({
                                ...prev,
                                preferredPickupSlotId: slot.id,
                                preferredPickupSlotLabel: `${slot.timeRange} (${slot.label})`,
                                customTimeRequested: false,
                              }));
                            }
                          }}
                          className={`p-4 rounded-xl border transition-all ${
                            isFull || isUnavailable
                              ? 'bg-slate-100/70 border-slate-200 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'bg-white border-[#FF6321] shadow-md ring-2 ring-[#FF6321]/20 cursor-pointer'
                              : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[#0A1931]">{slot.timeRange}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeColor}`}>
                              {slot.status}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                            <span>{slot.label}</span>
                            {slot.badge && <span className="text-[10px] font-medium text-slate-600">{slot.badge}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Option: Request a different time */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="customTimeCheck"
                      checked={formData.customTimeRequested}
                       onChange={(e) => setFormData((prev) => ({ ...prev, customTimeRequested: e.target.checked, preferredPickupSlotId: e.target.checked ? '' : prev.preferredPickupSlotId }))}
                       className="h-4 w-4 rounded border-slate-300 text-[#0B56D9] focus:ring-[#0B56D9]"
                    />
                    <label htmlFor="customTimeCheck" className="text-xs font-bold text-[#0A1931] cursor-pointer">
                      Request a different time or weekend special dispatch
                    </label>
                  </div>
                  {formData.customTimeRequested && (
                    <div className="mt-3 pl-7">
                       <input
                         type="text"
                         placeholder="Enter a preferred time, e.g. Saturday 8:00 PM"
                        value={formData.customTimeNote}
                        onChange={(e) => setFormData((prev) => ({ ...prev, customTimeNote: e.target.value }))}
                        className="w-full p-3 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#0A1931]"
                      />
                    </div>
                  )}
                </div>

                {/* Mandatory confirmation checkbox */}
                <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="confirmTimeCheckbox"
                    checked={formData.understandTimeMayBeConfirmed}
                    onChange={(e) => setFormData((prev) => ({ ...prev, understandTimeMayBeConfirmed: e.target.checked }))}
                    className="w-4 h-4 text-[#FF6321] rounded border-slate-300 focus:ring-[#FF6321] mt-0.5"
                  />
                  <label htmlFor="confirmTimeCheckbox" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                    <span className="font-bold text-[#0A1931]">Acknowledgment: </span>
                    I understand the pickup time will be coordinated and confirmed directly on WhatsApp by the Pick O Pick logistics dispatch team.
                  </label>
                </div>
              </div>
            )}

            {/* ----------------- STEP 05: CONTACT & PICKUP ADDRESS ----------------- */}
            {currentStep === 5 && (
              <div className="space-y-6">
                
                {/* Contact Identity */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1931] flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#FF6321]" />
                    Your NRI Contact Information:
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Your Full Name:
                      </label>
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-[#0A1931]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Your WhatsApp Number (with Country Code):
                      </label>
                      <input
                        type="tel"
                        value={formData.customerWhatsapp}
                        onChange={(e) => setFormData((prev) => ({ ...prev, customerWhatsapp: e.target.value }))}
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-[#0A1931]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Email Address (for booking confirmation): *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.customerEmail}
                        onChange={(e) => setFormData((prev) => ({ ...prev, customerEmail: e.target.value }))}
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0A1931]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Country Where You Currently Reside:
                      </label>
                      <input
                        type="text"
                        value={formData.currentCountry}
                        onChange={(e) => setFormData((prev) => ({ ...prev, currentCountry: e.target.value }))}
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0A1931]"
                      />
                    </div>
                  </div>
                </div>

                {/* Pickup Address in India */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1931] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#FF6321]" />
                    Pickup Address in India:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Pickup Contact Person Name:
                      </label>
                      <input
                        type="text"
                        value={formData.pickupName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, pickupName: e.target.value }))}
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0A1931]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Indian Mobile / WhatsApp:
                      </label>
                      <input
                        type="tel"
                        value={formData.pickupPhone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, pickupPhone: e.target.value }))}
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0A1931]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Apartment / House / Flat No. & Building:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 402, Shanti Vihar Apartments"
                      value={formData.pickupAddressLine1}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pickupAddressLine1: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0A1931]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Street / Area / Locality:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 12th Main, Indiranagar"
                        value={formData.pickupStreetArea}
                        onChange={(e) => setFormData((prev) => ({ ...prev, pickupStreetArea: e.target.value }))}
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0A1931]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Landmark:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near BDA Complex"
                        value={formData.pickupLandmark}
                        onChange={(e) => setFormData((prev) => ({ ...prev, pickupLandmark: e.target.value }))}
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0A1931]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        City:
                      </label>
                      <input
                        type="text"
                        value={formData.pickupCity}
                        onChange={(e) => setFormData((prev) => ({ ...prev, pickupCity: e.target.value }))}
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0A1931]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        State:
                      </label>
                      <input
                        type="text"
                        value={formData.pickupState}
                        onChange={(e) => setFormData((prev) => ({ ...prev, pickupState: e.target.value }))}
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0A1931]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        PIN Code:
                      </label>
                      <input
                        type="text"
                        value={formData.pickupPin}
                        onChange={(e) => setFormData((prev) => ({ ...prev, pickupPin: e.target.value }))}
                        className="w-full p-3 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-[#0A1931]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Pickup Instructions (Optional):
                    </label>
                    <input
                      type="text"
                      placeholder="Please call 30 mins before arriving / gate security will hand over the parcel..."
                      value={formData.pickupInstructions}
                      onChange={(e) => setFormData((prev) => ({ ...prev, pickupInstructions: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0A1931]"
                    />
                  </div>

                  {/* Someone else handing over toggle */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Will someone else hand over the package?
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, someoneElseHandingOver: 'yes' }))}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          formData.someoneElseHandingOver === 'yes'
                             ? 'bg-[#0B56D9] text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        YES, AN AUTHORIZED PERSON
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, someoneElseHandingOver: 'no' }))}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          formData.someoneElseHandingOver === 'no'
                             ? 'bg-[#0B56D9] text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        NO, SAME CONTACT
                      </button>
                    </div>

                    {formData.someoneElseHandingOver === 'yes' && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <input
                          type="text"
                          placeholder="Authorized Person Name"
                          value={formData.authorizedPersonName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, authorizedPersonName: e.target.value }))}
                          className="p-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                        <input
                          type="tel"
                          placeholder="Authorized Person Phone"
                          value={formData.authorizedPersonPhone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, authorizedPersonPhone: e.target.value }))}
                          className="p-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ----------------- STEP 06: FINAL CONFIRMATION ----------------- */}
            {currentStep === 6 && submissionResult && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-extrabold tracking-tight text-[#0A1931]">Your shipment booking request has been received</h3>
                  <p className="mt-2 text-sm text-slate-600">Our India dispatch team will review the request and confirm your pickup on WhatsApp.</p>
                </div>
                {/* Booking Receipt Summary Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                        OFFICIAL DOCKET NUMBER
                      </span>
                      <h4 className="text-lg sm:text-xl font-extrabold font-mono text-[#FF6321] tracking-tight">
                        {submissionResult.bookingId}
                      </h4>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      RECEIVED & QUEUED
                    </span>
                  </div>

                  <p className="rounded-xl bg-blue-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
                    {submissionResult.emailSent
                      ? 'Your branded booking confirmation email has been sent, with info@pickopick.com copied.'
                      : 'Your booking request is saved. We could not send the confirmation email, so our team will contact you on WhatsApp.'}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Service</span>
                      <p className="font-bold text-slate-800 mt-0.5 capitalize">
                        {formData.serviceType.replace(/_/g, ' ')}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Destination</span>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {formData.destinationCountry} {formData.destinationCity ? `(${formData.destinationCity})` : ''}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Pickup Date</span>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {formData.preferredPickupDate || 'To be scheduled'}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Preferred Time</span>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {formData.preferredPickupSlotLabel || (formData.customTimeRequested ? 'Custom Window' : 'Flexible')}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Package Count</span>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {formData.packageCount} {formData.packageCount === 1 ? 'Box' : 'Boxes'} (~{formData.approxWeightKg} kg)
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Client WhatsApp</span>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {formData.customerWhatsapp || formData.pickupPhone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary & Secondary Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <a
                    href={submissionResult.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>CHAT WITH PICK O PICK ON WHATSAPP</span>
                  </a>

                  <button
                    onClick={() => window.print()}
                    className="py-4 px-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Receipt</span>
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={onResetBooking}
                    className="text-xs font-bold text-[#FF6321] hover:underline transition-colors cursor-pointer"
                  >
                    Back to NRI Services / Book Another Shipment
                  </button>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons (Steps 1 to 5) */}
            {currentStep < 6 && (
              <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-8 py-3.5 rounded-full bg-[#0B56D9] hover:bg-[#0849B7] text-white text-xs font-extrabold flex items-center gap-2 transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    <span>CONTINUE</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmitBooking}
                    className="px-8 py-4 rounded-full bg-[#FF6321] hover:bg-orange-600 text-white text-xs font-extrabold shadow-lg shadow-[#FF6321]/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider"
                  >
                    {isSubmitting ? (
                      <span>SUBMITTING YOUR REQUEST...</span>
                    ) : (
                      <>
                        <span>SUBMIT MY REQUEST</span>
                        <Check className="w-4 h-4 stroke-[3]" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Sticky "YOUR REQUEST" Summary */}
          <div className="lg:col-span-4">
            <div className="mb-4 overflow-hidden rounded-2xl border border-blue-100 bg-white">
              <img
                src="/images/nri-booking-summary-journey-v2.webp"
                alt="Colourful India-to-world shipment illustration with a packed parcel and flight route"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <BookingSummary
              formData={formData}
              currentStep={currentStep}
               onOpenEstimator={onOpenEstimator}
            />
          </div>

        </div>

      </div>
    </section>
  );
};
