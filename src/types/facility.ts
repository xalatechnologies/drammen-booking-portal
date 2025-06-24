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
  
  // Computed/derived fields for backwards compatibility - all required to avoid conflicts
  address: string; // Computed from address_street, address_city - REQUIRED
  image: string; // Alias for image_url - REQUIRED
  pricePerHour: number; // Alias for price_per_hour
  accessibility: string[]; // Alias for accessibility_features - REQUIRED
  suitableFor: string[]; // REQUIRED
  hasAutoApproval: boolean; // Alias for has_auto_approval
  nextAvailable: string; // Alias for next_available - REQUIRED
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

// Add missing blackout period types
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

export interface FacilityFilters {
  searchTerm?: string;
  facilityType?: string;
  location?: string;
  accessibility?: string;
  capacity?: number[];
  date?: Date;
  priceRange?: { min: number; max: number };
  availableNow?: boolean;
  amenities?: string[];
}

export interface FacilitySortOptions {
  field: 'name' | 'capacity' | 'price_per_hour' | 'rating';
  direction: 'asc' | 'desc';
}

export interface Zone {
  id: string;
  name: string;
  facility_id: number;
  type: 'court' | 'room' | 'area' | 'section' | 'field';
  capacity: number;
  description: string | null;
  is_main_zone: boolean;
  parent_zone_id: string | null;
  bookable_independently: boolean;
  area_sqm: number | null;
  floor: string | null;
  coordinates_x: number | null;
  coordinates_y: number | null;
  coordinates_width: number | null;
  coordinates_height: number | null;
  equipment: string[] | null;
  accessibility_features: string[] | null;
  status: 'active' | 'maintenance' | 'inactive';
  created_at: string;
  updated_at: string;
  
  // Legacy fields for backwards compatibility
  facilityId?: string;
  conflictRules?: ConflictRule[];
  bookableIndependently?: boolean; // Alias for bookable_independently
  dimensions?: {
    width: number;
    length: number;
    height?: number;
  };
  // Computed/derived fields for backwards compatibility
  pricePerHour: number;
  availableTimes: any[];
  openingHours: any[];
  bookingRules: {
    minBookingDuration: number;
    maxBookingDuration: number;
    allowedTimeSlots: string[];
    bookingTypes: string[];
    advanceBookingDays: number;
    cancellationHours: number;
  };
}

export interface ConflictRule {
  id: string;
  zoneId: string;
  conflictingZoneId: string;
  type: 'mutually_exclusive' | 'partial_overlap' | 'noise_conflict';
  description: string;
}

export interface OpeningHours {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
  opens: string; // HH:mm format
  closes: string; // HH:mm format
}
