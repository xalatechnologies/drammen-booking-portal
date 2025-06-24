export interface Zone {
  id: string;
  facilityId: string; // Changed from facility_id
  name: string;
  description?: string;
  isMainZone: boolean; // Changed from is_main_zone
  parentZoneId?: string; // Changed from parent_zone_id
  capacity: number;
  area: number; // Square meters (area_sqm in DB)
  floor?: string;
  coordinates?: ZoneCoordinates;
  equipment: string[];
  features: string[];
  accessibility: string[];
  pricing: ZonePricing;
  availability: ZoneAvailability;
  restrictions: ZoneRestrictions;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Database fields that need mapping
  bookableIndependently?: boolean; // Changed from bookable_independently
  coordinatesX?: number; // Changed from coordinates_x
  coordinatesY?: number; // Changed from coordinates_y
  coordinatesWidth?: number; // Changed from coordinates_width
  coordinatesHeight?: number; // Changed from coordinates_height
  accessibilityFeatures?: string[]; // Changed from accessibility_features
  status?: string;
}

export interface ZoneCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

export interface ZonePricing {
  basePrice: number;
  currency: string;
  priceRules: PriceRule[];
  minimumBookingDuration: number; // Minutes
  maximumBookingDuration: number; // Minutes
  cancellationPolicy: CancellationPolicy;
}

export interface PriceRule {
  id: string;
  actorType: ActorType;
  timeSlot: TimeSlotCategory;
  dayType: 'weekday' | 'weekend' | 'holiday';
  multiplier: number;
  fixedPrice?: number;
  validFrom?: Date;
  validTo?: Date;
  isActive: boolean;
}

export interface CancellationPolicy {
  freeUntilHours: number; // Hours before booking start
  partialRefundUntilHours: number;
  partialRefundPercentage: number;
  noRefundAfterHours: number;
}

export interface ZoneAvailability {
  openingHours: OpeningHours[];
  blackoutPeriods: BlackoutPeriod[];
  maintenanceSchedule: MaintenanceSchedule[];
  recurringUnavailability: RecurringUnavailability[];
}

export interface OpeningHours {
  dayOfWeek: number; // 0-6, Sunday = 0
  openTime: string; // HH:mm format
  closeTime: string;
  isOpen: boolean;
}

export interface BlackoutPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  type: 'maintenance' | 'event' | 'holiday' | 'renovation';
}

export interface MaintenanceSchedule {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  isRecurring: boolean;
  recurrencePattern?: string;
  maintenanceType: 'cleaning' | 'repair' | 'inspection' | 'upgrade';
}

export interface RecurringUnavailability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  reason: string;
  validFrom?: Date;
  validTo?: Date;
}

export interface ZoneRestrictions {
  minimumAge?: number;
  maximumAge?: number;
  requiresSupervision: boolean;
  allowedActivities: string[];
  prohibitedActivities: string[];
  requiresTraining: boolean;
  alcoholPermitted: boolean;
  smokingPermitted: boolean;
  petsAllowed: boolean;
  cateringAllowed: boolean;
  decorationsAllowed: boolean;
  amplifiedSoundAllowed: boolean;
  commercialUseAllowed: boolean;
}

export type ActorType = 
  | 'lag-foreninger'
  | 'paraply'
  | 'private-firma'
  | 'kommunale-enheter'
  | 'private-person';

export type TimeSlotCategory = 
  | 'morning'    // 06:00-12:00
  | 'day'        // 12:00-17:00
  | 'evening'    // 17:00-23:00
  | 'night';     // 23:00-06:00

export interface ZoneConflict {
  zoneId: string;
  conflictType: 'booking' | 'maintenance' | 'blackout' | 'zone-conflict';
  startTime: Date;
  endTime: Date;
  severity: 'low' | 'medium' | 'high';
  description: string;
  canOverride: boolean;
}

export interface ZoneAvailabilityStatus {
  zoneId: string;
  date: Date;
  timeSlot: string;
  isAvailable: boolean;
  conflictReason?: string;
  conflictDetails?: ZoneConflict;
}
