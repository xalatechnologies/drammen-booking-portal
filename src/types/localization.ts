
import { Facility } from './facility';

// Language codes supported by the system
export type LanguageCode = 'NO' | 'EN';

// Base interface for translated content
export interface Translation {
  id: string;
  language_code: LanguageCode;
  key: string;
  value: string;
  namespace?: string;
  created_at: string;
  updated_at: string;
}

// Add missing exports for localization helper
export interface LocalizedContent {
  [key: string]: { [K in LanguageCode]: string };
}

export interface LocalizationHelper {
  getCurrentContent<T extends LocalizedContent[keyof LocalizedContent]>(
    content: T,
    language: LanguageCode,
    fallbackLanguage?: LanguageCode
  ): string;
  getCurrentArray<T extends { [K in LanguageCode]: string[] }>(
    content: T,
    language: LanguageCode,
    fallbackLanguage?: LanguageCode
  ): string[];
}

// Localized facility with translated fields - make properties optional by extending Partial
export interface LocalizedFacility extends Partial<Omit<Facility, 'name' | 'equipment' | 'description' | 'suitableFor' | 'amenities'>> {
  // Core required properties
  id: number;
  
  // Override with localized versions - allow both string and localized object types
  name: string | { NO: string; EN: string };
  description?: string | { NO: string; EN: string };
  equipment?: string[] | { NO: string[]; EN: string[] };
  suitableFor?: string[] | { NO: string[]; EN: string[] };
  amenities?: string[] | { NO: string[]; EN: string[] };
  
  // Add missing coordinate properties that are used in data files
  lat?: number;
  lng?: number;
  
  // Add translation metadata
  translations?: {
    name?: Record<LanguageCode, string>;
    description?: Record<LanguageCode, string>;
    equipment?: Record<LanguageCode, string[]>;
    suitableFor?: Record<LanguageCode, string[]>;
    amenities?: Record<LanguageCode, string[]>;
  };
}

// Translation key structure
export interface TranslationKey {
  id: string;
  key_path: string;
  namespace: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Localization context
export interface LocalizationContext {
  currentLanguage: LanguageCode;
  availableLanguages: LanguageCode[];
  fallbackLanguage: LanguageCode;
  translations: Record<string, string>;
}

// Translation request/response types
export interface TranslationRequest {
  key: string;
  namespace?: string;
  language?: LanguageCode;
  fallback?: string;
}

export interface TranslationResponse {
  key: string;
  value: string;
  language: LanguageCode;
  namespace?: string;
}

// Batch translation operations
export interface BatchTranslationRequest {
  keys: string[];
  namespace?: string;
  language?: LanguageCode;
}

export interface BatchTranslationResponse {
  translations: Record<string, string>;
  language: LanguageCode;
  missing_keys?: string[];
}
