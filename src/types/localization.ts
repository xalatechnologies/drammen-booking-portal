
import { Facility, Zone } from './facility';

export interface LocalizedFacility extends Facility {
  // Localized content
  localizedContent?: {
    name: string;
    description: string;
    shortDescription?: string;
  };
}

export interface LocalizedContent {
  [key: string]: string;
}

export interface LocalizationHelper {
  getLocalizedContent: (key: string, fallback?: string) => string;
  getCurrentContent: (content: any, language: string, fallback?: string) => string;
  getCurrentArray: (content: any, language: string, fallback?: string) => string[];
}
