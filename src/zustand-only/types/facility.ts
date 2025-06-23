import { BaseEntity } from './entity';

/**
 * Facility entity interface
 */
export interface Facility extends BaseEntity {
  name: string;
  description: string;
  address: string;
  city: string;
  postalCode: string;
  imageUrl?: string;
  status: 'active' | 'inactive' | 'maintenance';
  facilityType: string;
  capacity?: number;
  amenities?: string[];
  contactEmail?: string;
  contactPhone?: string;
  openingHours?: OpeningHours[];
  zones?: Zone[];
}

/**
 * Zone entity interface
 */
export interface Zone extends BaseEntity {
  name: string;
  description?: string;
  facilityId: string | number;
  capacity?: number;
  imageUrl?: string;
  status: 'active' | 'inactive' | 'maintenance';
}

/**
 * Opening hours interface
 */
export interface OpeningHours {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  openTime: string;  // Format: "HH:MM"
  closeTime: string; // Format: "HH:MM"
  isClosed: boolean;
}

/**
 * Facility filters interface
 */
export interface FacilityFilters {
  name?: string;
  facilityType?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  city?: string;
  capacity?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
}
