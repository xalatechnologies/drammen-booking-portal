export interface PriceRule {
  id: string;
  facilityId: string;
  zoneId?: string;
  customerType: 'private' | 'nonprofit' | 'business' | 'youth' | 'senior';
  dayType: 'weekday' | 'weekend';
  timeSlot?: string;
  priceType: 'hourly' | 'daily' | 'flat';
  basePrice: number;
  isActive: boolean;
  validFrom?: Date;
  validTo?: Date;
}

export interface PriceCalculation {
  basePrice: number;
  totalHours: number;
  totalDays: number;
  customerTypeDiscount: number;
  weekendSurcharge: number;
  subtotal: number;
  overrideAmount?: number;
  overrideReason?: string;
  finalPrice: number;
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

export type CustomerType = 'private' | 'nonprofit' | 'business' | 'youth' | 'senior';
