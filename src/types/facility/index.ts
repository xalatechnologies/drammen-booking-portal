/**
 * Facility Domain Types
 * 
 * Core facility domain types that represent the business entities
 * following Single Responsibility Principle by focusing only on domain model.
 */

// Localized text structure for multilingual content
export interface LocalizedText {
  [key: string]: string; // Allow for different languages
}

// Media item for facility images
export interface FacilityImage {
  id?: string;
  facility_id?: string;
  image_url: string;
  alt_text?: string;
  caption?: string;
  display_order?: number;
  is_featured?: boolean;
  uploaded_at?: Date;
  created_at?: Date;
}

// Facility address information
export interface FacilityAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

// Geo location information
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

// Contact information
export interface ContactInfo {
  email?: string;
  phone?: string;
}

// Facility status enum
export enum FacilityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  PENDING = 'pending'
}

// Core facility information
export interface Facility {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  type: LocalizedText;
  capacity: number;
  area: string;
  pricePerHour?: number;
  amenities?: string[];
  images?: FacilityImage[];
  address?: FacilityAddress;
  location?: GeoLocation;
  status: string | FacilityStatus;
  contact?: ContactInfo;
  hasAutoApproval?: boolean;
  timeSlotDuration?: number;
  accessibilityFeatures?: string[];
  allowedBookingTypes?: string[];
  rules?: LocalizedText;
  openingHours?: Record<string, OpeningHoursDay>;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Opening hours for a specific day
export interface OpeningHoursDay {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  breaks?: TimeSlot[];
}

// Time slot (used for breaks, blackout periods, etc.)
export interface TimeSlot {
  start: string;
  end: string;
}

// DTO for creating or updating a facility
export interface FacilityDTO {
  name: LocalizedText;
  description?: LocalizedText;
  type: LocalizedText;
  capacity?: number;
  area?: string;
  pricePerHour?: number;
  amenities?: string[];
  images?: Omit<FacilityImage, 'id' | 'facility_id' | 'uploaded_at' | 'created_at'>[];
  address?: FacilityAddress;
  location?: GeoLocation;
  status?: string | FacilityStatus;
  contact?: ContactInfo;
  hasAutoApproval?: boolean;
  timeSlotDuration?: number;
  accessibilityFeatures?: string[];
  allowedBookingTypes?: string[];
  rules?: LocalizedText;
  openingHours?: Record<string, OpeningHoursDay>;
}

// Filters for facility queries
export interface FacilityFilters {
  types?: string[];
  areas?: string[];
  status?: (string | FacilityStatus)[];
  search?: string;
  name?: string;
  minCapacity?: number;
  maxPricePerHour?: number;
  accessibilityFeatures?: string[];
  allowedBookingTypes?: string[];
  amenities?: string[];
}
