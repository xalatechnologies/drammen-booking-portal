
export interface AdditionalService {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  shortDescription?: string;
  facilityIds: string[]; // Services available at specific facilities
  zoneIds?: string[]; // Services available for specific zones
  pricing: ServicePricing;
  availability: ServiceAvailability;
  requirements: ServiceRequirements;
  metadata: ServiceMetadata;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceCategory = 
  | 'cleaning'      // Cleaning and maintenance
  | 'parking'       // Parking services
  | 'personnel'     // Staff and supervision
  | 'equipment'     // Equipment rental
  | 'catering'      // Food and beverage
  | 'security'      // Security and access
  | 'technical'     // AV and technical support
  | 'decoration'    // Event decoration
  | 'transport'     // Transportation services
  | 'wellness';     // Health and wellness services

export interface ServicePricing {
  basePrice: number;
  currency: string;
  pricingType: 'hourly' | 'daily' | 'flat' | 'per-person' | 'per-item';
  minimumCharge?: number;
  maximumCharge?: number;
  actorTypeMultipliers: Record<ActorType, number>;
  timeBasedPricing?: TimeBasedPricing[];
  volumeDiscounts?: VolumeDiscount[];
  seasonalPricing?: SeasonalPricing[];
}

export interface TimeBasedPricing {
  timeSlot: TimeSlotCategory;
  multiplier: number;
  dayType: 'weekday' | 'weekend' | 'holiday';
}

export interface VolumeDiscount {
  minimumQuantity: number;
  discountPercentage: number;
  discountAmount?: number;
}

export interface SeasonalPricing {
  startDate: Date;
  endDate: Date;
  multiplier: number;
  description: string;
}

export interface ServiceAvailability {
  isAlwaysAvailable: boolean;
  availableTimeSlots?: AvailableTimeSlot[];
  leadTimeHours: number; // Minimum hours to book in advance
  maxAdvanceBookingDays: number; // Maximum days to book in advance
  blackoutPeriods: ServiceBlackoutPeriod[];
  capacity?: number; // Maximum concurrent bookings
}

export interface AvailableTimeSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface ServiceBlackoutPeriod {
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface ServiceRequirements {
  minimumBookingDuration?: number; // Minutes
  maximumBookingDuration?: number;
  requiresMainBooking: boolean; // Must be booked with facility
  conflictsWithServices?: string[]; // Cannot be booked with these services
  requiresServices?: string[]; // Requires these services to be booked
  minimumAttendees?: number;
  maximumAttendees?: number;
  ageRestrictions?: {
    minimumAge?: number;
    maximumAge?: number;
    requiresAdultSupervision?: boolean;
  };
  skillRequirements?: string[];
  equipmentProvided: string[];
  equipmentRequired: string[];
  specialPermissions?: string[];
}

export interface ServiceMetadata {
  provider?: string; // External service provider
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  instructions?: string;
  setupTimeMinutes?: number;
  cleanupTimeMinutes?: number;
  cancellationPolicy?: {
    freeUntilHours: number;
    partialRefundPercentage: number;
    noRefundAfterHours: number;
  };
  images?: string[];
  documents?: ServiceDocument[];
  tags: string[];
}

export interface ServiceDocument {
  id: string;
  name: string;
  type: 'contract' | 'manual' | 'specification' | 'insurance' | 'other';
  url: string;
  uploadedAt: Date;
}

export interface ServiceBundle {
  id: string;
  name: string;
  description: string;
  serviceIds: string[];
  bundleDiscount: number; // Percentage discount
  isPopular: boolean;
  validFrom?: Date;
  validTo?: Date;
}

export interface ServiceBooking {
  id: string;
  bookingId: string;
  serviceId: string;
  quantity: number;
  startTime?: Date;
  endTime?: Date;
  specialInstructions?: string;
  status: ServiceBookingStatus;
  assignedStaff?: string[];
  deliveryLocation?: string;
  pricing: {
    unitPrice: number;
    totalPrice: number;
    discounts: number;
    surcharges: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceBookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in-preparation'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'failed';

export interface ServiceFilters {
  category?: ServiceCategory;
  facilityId?: string;
  zoneId?: string;
  isActive?: boolean;
  searchTerm?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  availableDate?: Date;
  availableTimeSlot?: string;
}

// Import types from other files
type ActorType = 'lag-foreninger' | 'paraply' | 'private-firma' | 'kommunale-enheter' | 'private-person';
type TimeSlotCategory = 'morning' | 'day' | 'evening' | 'night';
