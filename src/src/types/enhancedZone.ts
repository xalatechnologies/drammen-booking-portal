
import { Zone } from '@/components/booking/types';
import { ZonePricingConfiguration, PricingMode } from './pricingModes';

export interface EnhancedZone extends Zone {
  pricingConfiguration: ZonePricingConfiguration;
  defaultPricingMode: PricingMode;
}
