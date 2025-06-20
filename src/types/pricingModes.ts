
export type PricingMode = 'hourly' | 'daily' | 'fixed';

export interface PricingRule {
  id: string;
  mode: PricingMode;
  actorType: ActorType;
  timeSlot?: 'morning' | 'day' | 'evening' | 'night';
  dayType?: 'weekday' | 'weekend' | 'holiday';
  price: number;
  validFrom?: Date;
  validTo?: Date;
  isActive: boolean;
  description?: string;
}

export interface FixedPricingPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // Duration in days
  recurrencePattern?: string; // For recurring packages
  validFrom: Date;
  validTo: Date;
  actorTypes: ActorType[];
  isActive: boolean;
}

export interface ZonePricingConfiguration {
  zoneId: string;
  defaultMode: PricingMode;
  pricingRules: PricingRule[];
  fixedPackages: FixedPricingPackage[];
  allowedModes: PricingMode[];
}

import { ActorType } from '@/types/pricing';
