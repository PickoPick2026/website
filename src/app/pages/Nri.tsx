import React, { useState } from 'react';
import { HeroSection } from '../components/NRI/HeroSection';
import { QuickActions } from '../components/NRI/QuickActions';
import { ServiceSelector } from '../components/NRI/ServiceSelector';
import { BookingFlow } from '../components/NRI/BookingFlow';
import { FreeConsultationModule } from '../components/NRI/FreeConsultationModule';
import { BlockSlotModule } from '../components/NRI/BlockSlotModule';
import { ProcessSection } from '../components/NRI/ProcessSection';
import { WhyChooseUsSection } from '../components/NRI/WhyChooseUsSection';
import { NriUseCasesSection } from '../components/NRI/NriUseCasesSection';
import { TestimonialsSection } from '../components/NRI/TestimonialsSection';
import { FaqSection } from '../components/NRI/FaqSection';
import { FinalCtaSection } from '../components/NRI/FinalCtaSection';
import { ShippingEstimateModal } from '../components/NRI/ShippingEstimateModal';
import { ConsultationModal } from '../components/NRI/ConsultationModal';
import { AdminPortalModal } from '../components/NRI/AdminPortalModal';
import { BookingFormData, ServiceTypeId } from '../components/NRI/types';

export default function App() {
  // Master booking form state
  const [formData, setFormData] = useState<BookingFormData>({
    serviceType: 'shop_from_india',
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
    preferredPickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
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
  const [isEstimatorModalOpen, setIsEstimatorModalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);

  // Scroll to section helper
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Select service from any interactive trigger and scroll to booking flow
  const handleSelectService = (serviceId: ServiceTypeId) => {
    setFormData((prev) => ({ ...prev, serviceType: serviceId }));
    scrollToSection('booking-portal');
  };

  // Start booking with optional pre-fill
  const handleStartBooking = (serviceId?: string) => {
    if (serviceId) {
      setFormData((prev) => ({ ...prev, serviceType: serviceId as ServiceTypeId }));
    }
    scrollToSection('booking-portal');
  };

  // Scroll to Block Slot module
  const handleOpenBlockSlot = () => {
    scrollToSection('block-slot-section');
  };

  // Reset form
  const handleResetBooking = () => {
    setFormData({
      serviceType: 'shop_from_india',
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
      preferredPickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
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
    <div className="min-h-screen flex flex-col bg-[#F1F5F9] text-[#0A1931] font-sans antialiased selection:bg-[#FF6321]/20 selection:text-[#FF6321]">
      
    

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
          onOpenBlockSlot={handleOpenBlockSlot}
          onStartBooking={() => scrollToSection('booking-portal')}
          onOpenEstimator={() => setIsEstimatorModalOpen(true)}
        />

        {/* NRI Service Selector (6 Cards) */}
        <ServiceSelector
          selectedService={formData.serviceType}
          onSelectService={(id) => setFormData((prev) => ({ ...prev, serviceType: id }))}
          onContinueToForm={() => scrollToSection('booking-portal')}
        />

        {/* Core Multi-Step Booking Engine & Sticky Live Summary */}
        <BookingFlow
          formData={formData}
          setFormData={setFormData}
          onOpenEstimator={() => setIsEstimatorModalOpen(true)}
          onOpenConsultation={() => setIsConsultationModalOpen(true)}
          onResetBooking={handleResetBooking}
        />

        {/* Free 1-on-1 Concierge Consultation Section */}
        <FreeConsultationModule />

        {/* Block Your Slot Section */}
        <BlockSlotModule />

        {/* Process Section (6 Steps) */}
        <ProcessSection />

        {/* Why Choose Pick O Pick (6 Trust Pillars) */}
        <WhyChooseUsSection />

        {/* NRI Use Cases & Life Scenarios */}
        <NriUseCasesSection onSelectUseCase={handleSelectService} />

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
      <ShippingEstimateModal
        isOpen={isEstimatorModalOpen}
        onClose={() => setIsEstimatorModalOpen(false)}
        onProceedWithEstimate={(country, weight) => {
          setFormData((prev) => ({
            ...prev,
            destinationCountry: country,
            approxWeightKg: weight,
          }));
          scrollToSection('booking-portal');
        }}
      />

      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
      />

      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />

    </div>
  );
}
