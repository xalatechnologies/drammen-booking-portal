
import { Language } from '@/i18n/types';
import { Facility } from './facility';
import { AdditionalService } from './additionalServices';

export interface LocalizedContent {
  [key: string]: {
    [K in Language]: string;
  };
}

export interface LocalizedFacility extends Omit<Facility, 'name' | 'description' | 'suitableFor' | 'equipment' | 'amenities'> {
  name: {
    [K in Language]: string;
  };
  description: {
    [K in Language]: string;
  };
  suitableFor: {
    [K in Language]: string[];
  };
  equipment: {
    [K in Language]: string[];
  };
  amenities?: {
    [K in Language]: string[];
  };
  // Ensure lat/lng are always present for localized facilities
  lat: number;
  lng: number;
}

export interface LocalizedAdditionalService extends Omit<AdditionalService, 'name' | 'description' | 'shortDescription' | 'metadata'> {
  name: {
    [K in Language]: string;
  };
  description: {
    [K in Language]: string;
  };
  shortDescription?: {
    [K in Language]: string;
  };
  metadata: Omit<AdditionalService['metadata'], 'instructions'> & {
    instructions?: {
      [K in Language]: string;
    };
  };
}

export interface LocalizationHelper {
  getCurrentContent<T extends LocalizedContent[keyof LocalizedContent]>(
    content: T,
    language: Language,
    fallbackLanguage?: Language
  ): string;
  
  getCurrentArray<T extends { [K in Language]: string[] }>(
    content: T,
    language: Language,
    fallbackLanguage?: Language
  ): string[];
}
