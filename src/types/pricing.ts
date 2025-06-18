
export interface PriceRule {
  id: string;
  facilityId: string;
  zoneId?: string;
  actorType: ActorType;
  timeSlot: TimeSlotCategory;
  bookingType: BookingType;
  dayType: 'weekday' | 'weekend';
  priceType: 'hourly' | 'daily' | 'flat';
  basePrice: number;
  isActive: boolean;
  validFrom?: Date;
  validTo?: Date;
  requiresApproval?: boolean;
  actorStatus?: ActorStatus;
}

export interface PriceCalculation {
  basePrice: number;
  totalHours: number;
  totalDays: number;
  actorTypeDiscount: number;
  timeSlotMultiplier: number;
  bookingTypeDiscount: number;
  weekendSurcharge: number;
  subtotal: number;
  overrideAmount?: number;
  overrideReason?: string;
  finalPrice: number;
  requiresApproval: boolean;
  breakdown: PriceBreakdownItem[];
}

export interface PriceBreakdownItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  type: 'base' | 'discount' | 'surcharge' | 'override';
}

export interface PriceOverride {
  amount: number;
  reason: string;
  appliedBy: string;
  timestamp: Date;
}

export type ActorType = 
  | 'lag-foreninger'      // Lag og foreninger (frivillige)
  | 'paraply'             // Paraplyorganisasjoner
  | 'private-firma'       // Private firmaer
  | 'kommunale-enheter'   // Kommunale enheter
  | 'private-person';     // Private personer

export type ActorStatus = 
  | 'verified'            // Verifisert i aktørregisteret
  | 'pending'             // Venter på verifisering
  | 'unverified';         // Ikke verifisert

export type TimeSlotCategory = 
  | 'morning'             // Morgen (06:00-12:00)
  | 'day'                 // Dag (12:00-17:00)
  | 'evening'             // Kveld (17:00-23:00)
  | 'night';              // Natt (23:00-06:00)

export type BookingType = 
  | 'engangs'             // Engangslån
  | 'fastlan';            // Fastlån/gjentakende

export type CustomerType = ActorType; // For backwards compatibility
