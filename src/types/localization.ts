
import { Facility, Zone } from './facility';

export interface LocalizedFacility extends Facility {
  // Localized content
  localizedContent?: {
    name: string;
    description: string;
    shortDescription?: string;
  };
}
