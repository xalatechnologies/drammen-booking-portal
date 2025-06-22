export interface Facility {
  id: number;
  name: string;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  address_country: string;
  type: string;
  status: 'active' | 'maintenance' | 'inactive';
  image_url: string | null;
  capacity: number;
  area: string;
  description: string | null;
  next_available: string | null;
  rating: number | null;
  review_count: number | null;
  price_per_hour: number;
  has_auto_approval: boolean;
  amenities: string[] | null;
  time_slot_duration: number;
  latitude: number | null;
  longitude: number | null;
  accessibility_features: string[] | null;
  equipment: string[] | null;
  allowed_booking_types: ('engangs' | 'fastlan' | 'rammetid' | 'strotimer')[];
  season_from: string | null;
  season_to: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  booking_lead_time_hours: number;
  max_advance_booking_days: number;
  cancellation_deadline_hours: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  area_sqm: number | null;
  
  address: string;
  image: string;
  pricePerHour: number;
  accessibility: string[];
  suitableFor: string[];
  hasAutoApproval: boolean;
  nextAvailable: string;
  openingHours: OpeningHours[];
  zones: Zone[];
  featuredImage?: FacilityImage;
  images?: FacilityImage[];
  timeSlotDuration: 1 | 2;
  availableTimes?: {
    date: Date;
    slots: {
      start: string;
      end: string;
      available: boolean;
    }[];
  }[];
  season: {
    from: string;
    to: string;
  };
}

export interface FacilityImage {
  id: string;
  facility_id: number;
  image_url: string;
  alt_text?: string;
  caption?: string;
  display_order: number;
  is_featured: boolean;
  file_size?: number;
  uploaded_by?: string;
  uploaded_at: string;
  created_at: string;
}

export interface FacilityBlackoutPeriod {
  id: string;
  facility_id: number;
  start_date: Date;
  end_date: Date;
  type: BlackoutType;
  reason: string;
  created_by: string;
  created_at: string;
}

export type BlackoutType = 'maintenance' | 'renovation' | 'event' | 'weather' | 'other';

/**
 * Interface for filtering facilities
 * Following Interface Segregation Principle by providing focused filter options
 */
export interface FacilityFilters {
  // Original properties
  searchTerm?: string;
  facilityType?: string;
  location?: string;
  accessibility?: string;
  capacity?: number[];
  date?: Date;
  priceRange?: { min: number; max: number };
  availableNow?: boolean;
  
  // Additional properties used by our repository implementation
  search?: string; // For search term
  type?: string;   // For facility type filter
  area?: string;   // For location/area filter
  amenities?: string[];
}

export interface FacilitySortOptions {
  field: 'name' | 'capacity' | 'price_per_hour' | 'rating';
  direction: 'asc' | 'desc';
}

export interface Zone {
  id: string;
  name: string;
  type: 'court' | 'room' | 'area' | 'section' | 'field';
  capacity: number;
  description: string;
  isMainZone: boolean;
  bookableIndependently: boolean;
  areaSqm: number;
  floor: string;
  equipment: string[];
  status: 'active' | 'maintenance' | 'inactive';
  priceMultiplier: number;
  minBookingDuration: number;
  maxBookingDuration: number;
  facility_id?: number;
}

export interface ConflictRule {
  id: string;
  zoneId: string;
  conflictingZoneId: string;
  type: 'mutually_exclusive' | 'partial_overlap' | 'noise_conflict';
  description: string;
}

export interface OpeningHours {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  opens: string;
  closes: string;
}

/**
 * Represents a media item (image, video, etc.) related to a facility
 */
export interface MediaItem {
  id: string;
  facilityId: string;
  url: string;
  type: 'image' | 'video' | 'virtual_tour' | 'document';
  title: string;
  description: string;
  featured: boolean;
  order: number;
  mimeType: string;
  fileName: string;
  fileSize: number;
  width?: number;
  height?: number;
}

/**
 * Alias for FacilityMedia for backward compatibility
 */
export type FacilityMedia = MediaItem;

/**
 * Represents a feature of a zone within a facility
 */
export interface ZoneFeature {
  id: string;
  zoneId: string;
  name: string;
  description: string;
  icon?: string;
  category?: 'amenity' | 'equipment' | 'accessibility' | 'safety';
}

/**
 * Represents capacity information for a zone
 */
export interface ZoneCapacity {
  zoneId: string;
  standard: number;
  maximum: number;
  recommended: number;
  minimumBooking: number;
  standingCapacity?: number;
  seatedCapacity?: number;
  layoutOptions?: Array<{
    name: string;
    capacity: number;
    description?: string;
  }>;
}
