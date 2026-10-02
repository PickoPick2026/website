import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { HeroSection } from '../components/NRI/HeroSection';
import { BookingFlow } from '../components/NRI/BookingFlow';
import { FreeConsultationModule } from '../components/NRI/FreeConsultationModule';
import { ProcessSection } from '../components/NRI/ProcessSection';
import { WhyChooseUsSection } from '../components/NRI/WhyChooseUsSection';
import { NriUseCasesSection } from '../components/NRI/NriUseCasesSection';
import { TestimonialsSection } from '../components/NRI/TestimonialsSection';
import { FaqSection } from '../components/NRI/FaqSection';
import { FinalCtaSection } from '../components/NRI/FinalCtaSection';
import { ConsultationModal } from '../components/NRI/ConsultationModal';
import { BookingFormData, ServiceTypeId } from '../components/NRI/types';

const getTodayValue = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export default function App() {
  const { hash } = useLocation();
  // Master booking form state
  const [formData, setFormData] = useState<BookingFormData>({
    serviceType: 'shop_from_india',
    selectedServices: ['shop_from_india'],
    requirementDescription: '',
    alreadyPurchasing: null,
    packageType: 'parcel',
    approxWeightKg: 5,
    packageCount: 1,
    dimensions: { lengthCm: '', widthCm: '', heightCm: '' },
    itemDescription: '',
    specialHandling: [],
    uploadedPhotos: [],
    destinationCountry: 'USA',
    destinationCity: '',
    postalCode: '',
    recipientName: '',
    recipientPhone: '',
    isPermanentAddress: 'yes',
    preferredPickupDate: getTodayValue(),
    preferredPickupSlotId: 'slot-morning-1',
    preferredPickupSlotLabel: '09:00 AM – 11:00 AM (Morning Slot A)',
    customTimeRequested: false,
    customTimeNote: '',
    understandTimeMayBeConfirmed: true,
    customerName: '',
    customerWhatsapp: '',
    customerEmail: '',
    currentCountry: 'USA',
    pickupName: '',
    pickupPhone: '',
    pickupAddressLine1: '',
    pickupStreetArea: '',
    pickupCity: '',
    pickupState: '',
    pickupPin: '',
    pickupLandmark: '',
    pickupInstructions: '',
    someoneElseHandingOver: 'no',
    authorizedPersonName: '',
    authorizedPersonPhone: '',
  });

  // Modal open states
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [bookingStartStep, setBookingStartStep] = useState(1);

  // Scroll to section helper
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView();
    }
  };

  useEffect(() => {
    const openPickup = () => {
      setBookingStartStep(1);
      scrollToSection('booking-portal');
    };
    const openEstimate = () => { window.location.assign('/shipping-estimate'); };
    window.addEventListener('pickopick:open-pickup', openPickup);
    window.addEventListener('pickopick:open-estimate', openEstimate);

    return () => {
      window.removeEventListener('pickopick:open-pickup', openPickup);
      window.removeEventListener('pickopick:open-estimate', openEstimate);
    };
  }, []);

  useEffect(() => {
    if (hash === '#consultation') {
      setIsConsultationModalOpen(true);
      scrollToSection('consultation-section');
    } else if (hash === '#booking-portal') {
      setBookingStartStep(1);
      scrollToSection('booking-portal');
    } else if (hash === '#consultation-section') {
      scrollToSection('consultation-section');
    } else if (hash === '#shipping-estimate') {
      window.location.assign('/shipping-estimate');
    }
  }, [hash]);

  const nextSection = (id: string, label: string) => (
    <div className="flex justify-center bg-white py-4">
      <button type="button" onClick={() => scrollToSection(id)} className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-[#0B56D9] hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-[#0B56D9]">
        {label}<ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );

  // Select service from any interactive trigger and scroll to booking flow
  const handleSelectService = (serviceId: ServiceTypeId) => {
    setFormData((prev) => ({ ...prev, serviceType: serviceId, selectedServices: [serviceId] }));
    scrollToSection('booking-portal');
  };

  // Start booking with optional pre-fill
  const handleStartBooking = (serviceId?: string) => {
    if (serviceId) {
      setFormData((prev) => ({ ...prev, serviceType: serviceId as ServiceTypeId, selectedServices: [serviceId as ServiceTypeId] }));
    }
    scrollToSection('booking-portal');
  };

  // Reset form
  const handleResetBooking = () => {
    setBookingStartStep(1);
    setFormData({
      serviceType: 'shop_from_india',
      selectedServices: ['shop_from_india'],
      requirementDescription: '',
      alreadyPurchasing: null,
      packageType: 'parcel',
      approxWeightKg: 5,
      packageCount: 1,
      dimensions: { lengthCm: '', widthCm: '', heightCm: '' },
      itemDescription: '',
      specialHandling: [],
      uploadedPhotos: [],
      destinationCountry: 'USA',
      destinationCity: '',
      postalCode: '',
      recipientName: '',
      recipientPhone: '',
      isPermanentAddress: 'yes',
      preferredPickupDate: getTodayValue(),
      preferredPickupSlotId: 'slot-morning-1',
      preferredPickupSlotLabel: '09:00 AM – 11:00 AM (Morning Slot A)',
      customTimeRequested: false,
      customTimeNote: '',
      understandTimeMayBeConfirmed: true,
      customerName: '',
      customerWhatsapp: '',
      customerEmail: '',
      currentCountry: 'USA',
      pickupName: '',
      pickupPhone: '',
      pickupAddressLine1: '',
      pickupStreetArea: '',
      pickupCity: '',
      pickupState: '',
      pickupPin: '',
      pickupLandmark: '',
      pickupInstructions: '',
      someoneElseHandingOver: 'no',
      authorizedPersonName: '',
      authorizedPersonPhone: '',
    });
    scrollToSection('services');
  };

  return (
    <div className="nri-page min-h-screen flex flex-col bg-[#F7F9FF] text-[#0A1931] font-sans antialiased">
      <style>{`
        .nri-page [class*="shadow"] { box-shadow: none !important; }
        .nri-page [class*="bg-gradient"] { background-image: none !important; }
        .nri-page [class*="bg-blue-50"], .nri-page [class*="bg-blue-50"] { background-color: #EEF4FF !important; }
        .nri-page [class*="bg-[#0B56D9]"], .nri-page [class*="bg-orange-600"], .nri-page [class*="bg-orange-700"] { background-color: #0B56D9 !important; }
        .nri-page [class*="text-[#0B56D9]"], .nri-page [class*="text-orange-"] { color: #0B56D9 !important; }
        .nri-page [class*="border-[#0B56D9]"], .nri-page [class*="border-orange-"] { border-color: #0B56D9 !important; }
        .nri-page [class*="ring-[#0B56D9]"] { --tw-ring-color: rgb(11 86 217 / .22) !important; }
      `}</style>
      
    

      {/* Hero Section */}
      <main className="flex-1">
        <HeroSection
          onOpenConsultation={() => setIsConsultationModalOpen(true)}
          onStartBooking={() => scrollToSection('booking-portal')}
        />

        

        <FreeConsultationModule onOpenConsultation={() => setIsConsultationModalOpen(true)} />
        {nextSection('use-cases', 'Explore your premium services')}
        <NriUseCasesSection />
        {nextSection('why-us', 'Meet your India-side team')}
        <WhyChooseUsSection />
        {nextSection('how-it-works', 'See how your shipment travels')}
        <ProcessSection />
        {nextSection('booking-portal', 'Ready to book assistance?')}

        {/* Core Multi-Step Booking Engine & Sticky Live Summary */}
        <BookingFlow
          formData={formData}
          setFormData={setFormData}
          onOpenEstimator={() => window.location.assign('/shipping-estimate')}
          onResetBooking={handleResetBooking}
          startStep={bookingStartStep}
        />

        {/* Customer Testimonials */}
        <TestimonialsSection />

        {/* Searchable FAQ Accordion */}
        <FaqSection onOpenConsultation={() => setIsConsultationModalOpen(true)} />

        {/* Final CTA Closing Section */}
        <FinalCtaSection
          onOpenConsultation={() => setIsConsultationModalOpen(true)}
          onStartBooking={() => scrollToSection('booking-portal')}
        />
      </main>

    

      {/* Interactive Modals */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />

    </div>
  );
}
