export type ServiceTypeId =
  | 'shop_from_india'
  | 'personal_items'
  | 'food_groceries'
  | 'gifts_festive'
  | 'consolidation'
  | 'business_bulk';

export interface ServiceOption {
  id: ServiceTypeId;
  title: string;
  shortDesc: string;
  tagline: string;
  badge?: string;
  iconName: string;
  popularItems: string[];
}

export type PackageTypeId =
  | 'parcel'
  | 'multiple_packages'
  | 'fragile'
  | 'oversized'
  | 'business_shipment';

export type SpecialHandlingId =
  | 'fragile'
  | 'food'
  | 'documents'
  | 'valuable'
  | 'liquids_cosmetics'
  | 'other';

export type SlotStatus = 'AVAILABLE' | 'LIMITED' | 'FULL' | 'UNAVAILABLE';

export interface TimeSlot {
  id: string;
  timeRange: string;
  label: string;
  status: SlotStatus;
  remainingQuota: number;
  badge?: string;
}

export interface UploadedFileMeta {
  id: string;
  name: string;
  size: number;
  previewUrl?: string;
}

export interface BookingFormData {
  // Step 1: Service
  serviceType: ServiceTypeId;
  requirementDescription: string;
  alreadyPurchasing: 'yes' | 'no' | null;

  // Step 2: Package
  packageType: PackageTypeId;
  approxWeightKg: number | string;
  packageCount: number;
  dimensions: {
    lengthCm: number | string;
    widthCm: number | string;
    heightCm: number | string;
  };
  itemDescription: string;
  specialHandling: SpecialHandlingId[];
  uploadedPhotos: UploadedFileMeta[];

  // Step 3: Destination
  destinationCountry: string;
  destinationCity: string;
  postalCode: string;
  recipientName: string;
  recipientPhone: string;
  isPermanentAddress: 'yes' | 'no';

  // Step 4: Pickup Schedule
  preferredPickupDate: string; // YYYY-MM-DD
  preferredPickupSlotId: string;
  preferredPickupSlotLabel: string;
  customTimeRequested: boolean;
  customTimeNote: string;
  understandTimeMayBeConfirmed: boolean;

  // Step 5: Pickup Details & Contact
  customerName: string;
  customerWhatsapp: string;
  customerEmail: string;
  currentCountry: string;
  pickupName: string;
  pickupPhone: string;
  pickupAddressLine1: string;
  pickupStreetArea: string;
  pickupCity: string;
  pickupState: string;
  pickupPin: string;
  pickupLandmark: string;
  pickupInstructions: string;
  someoneElseHandingOver: 'yes' | 'no';
  authorizedPersonName: string;
  authorizedPersonPhone: string;
}

export interface BookingRecord {
  id: string;
  createdAt: string;
  status: 'RECEIVED' | 'IN_REVIEW' | 'SLOT_RESERVED' | 'PICKUP_COORDINATED' | 'COMPLETED';
  data: BookingFormData;
  notes?: string;
}

export interface ConsultationRecord {
  id: string;
  createdAt: string;
  fullName: string;
  whatsappNumber: string;
  currentCountry: string;
  email?: string;
  requirementHelp: string;
  preferredDate: string;
  preferredTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED';
}

export interface SlotBlockRecord {
  id: string;
  createdAt: string;
  customerName: string;
  destinationCountry: string;
  preferredDate: string;
  preferredTimeSlot: string;
  whatsappNumber: string;
  notes?: string;
  status: 'RECEIVED_PENDING_CONFIRMATION' | 'CONFIRMED';
}

export interface ShippingEstimateResult {
  origin: string;
  destinationCountry: string;
  actualWeightKg: number;
  volumetricWeightKg: number;
  billableWeightKg: number;
  estimatedInrMin: number;
  estimatedInrMax: number;
  estimatedUsdMin: number;
  estimatedUsdMax: number;
  transitDays: string;
  serviceLevel: string;
  notes: string[];
}
