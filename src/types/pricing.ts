
export type BookingType = 'engangs' | 'fastlan' | 'strotimer';

export type ActorType = 
  | 'private-person'
  | 'lag-foreninger' 
  | 'paraply'
  | 'private-firma'
  | 'kommunale-enheter';

export interface PriceRule {
  id: string;
  name: string;
  description: string;
  actorType: ActorType;
  bookingType: BookingType;
  baseRate: number;
  discountPercentage?: number;
  minimumDuration?: number;
  maximumDuration?: number;
  validDays?: string[];
  validTimeSlots?: string[];
  seasonalMultiplier?: number;
  isActive: boolean;
}

export interface PriceCalculation {
  basePrice: number;
  discounts: PriceAdjustment[];
  surcharges: PriceAdjustment[];
  totalPrice: number;
  currency: string;
  breakdown: PriceBreakdownItem[];
}

export interface PriceAdjustment {
  type: 'discount' | 'surcharge';
  name: string;
  amount: number;
  percentage?: number;
  reason: string;
}

export interface PriceBreakdownItem {
  description: string;
  amount: number;
  type: 'base' | 'discount' | 'surcharge' | 'tax';
}
