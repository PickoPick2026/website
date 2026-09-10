import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/NRI/HeroSection';
import { QuickActions } from '../components/NRI/QuickActions';
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
      el.scrollIntoView({ behavior: 'smooth' });
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

    const action = window.location.hash;
    if (action === '#booking-portal') window.setTimeout(openPickup, 120);
    if (action === '#shipping-estimate') window.setTimeout(openEstimate, 120);

    return () => {
      window.removeEventListener('pickopick:open-pickup', openPickup);
      window.removeEventListener('pickopick:open-estimate', openEstimate);
    };
  }, []);

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

  // Scroll to Block Slot module
  const handleOpenBlockSlot = () => {
    scrollToSection('block-slot-section');
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
        .nri-page [class*="bg-orange-50"], .nri-page [class*="bg-orange-100"] { background-color: #EEF4FF !important; }
        .nri-page [class*="bg-[#FF6321]"], .nri-page [class*="bg-orange-600"], .nri-page [class*="bg-orange-700"] { background-color: #0B56D9 !important; }
        .nri-page [class*="text-[#FF6321]"], .nri-page [class*="text-orange-"] { color: #0B56D9 !important; }
        .nri-page [class*="border-[#FF6321]"], .nri-page [class*="border-orange-"] { border-color: #0B56D9 !important; }
        .nri-page [class*="ring-[#FF6321]"] { --tw-ring-color: rgb(11 86 217 / .22) !important; }
      `}</style>
      
    

      {/* Hero Section */}
      <main className="flex-1">
        <HeroSection
          onOpenConsultation={() => setIsConsultationModalOpen(true)}
          onStartBooking={() => scrollToSection('booking-portal')}
          onOpenBlockSlot={handleOpenBlockSlot}
        />

        {/* 4 Quick Action Cards */}
        <QuickActions
          onOpenConsultation={() => setIsConsultationModalOpen(true)}
        />


        {/* Core Multi-Step Booking Engine & Sticky Live Summary */}
        <BookingFlow
          formData={formData}
          setFormData={setFormData}
          onOpenEstimator={() => window.location.assign('/shipping-estimate')}
          onResetBooking={handleResetBooking}
          startStep={bookingStartStep}
        />

        {/* Free 1-on-1 Concierge Consultation Section */}
        <FreeConsultationModule onOpenConsultation={() => setIsConsultationModalOpen(true)} />

        {/* Process Section (6 Steps) */}
        <ProcessSection />

        {/* Why Choose Pick O Pick (6 Trust Pillars) */}
        <WhyChooseUsSection />

        {/* NRI Use Cases & Life Scenarios */}
        <NriUseCasesSection onOpenConsultation={() => setIsConsultationModalOpen(true)} />

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
