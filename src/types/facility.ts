export interface Facility {
  id: number;
  name: string;
  address: string;
  type: string;
  status: 'active' | 'maintenance' | 'inactive';
  image: string;
  nextAvailable: string;
  capacity: number;
  accessibility: string[];
  area: string;
  suitableFor: string[];
  equipment: string[];
  openingHours: OpeningHours[];
  description: string;
  rating?: number;
  reviewCount?: number;
  pricePerHour?: number;
  area_sqm?: number;
  amenities?: string[];
  hasAutoApproval?: boolean;
  timeSlotDuration?: 1 | 2;
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
  allowedBookingTypes: ('engangslån' | 'fastlån' | 'rammetid' | 'strøtimer')[];
  zones: Zone[];
  featuredImage?: FacilityImage;
  images?: FacilityImage[];
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
  field: 'name' | 'capacity' | 'pricePerHour' | 'rating';
  direction: 'asc' | 'desc';
}

export interface Zone {
  id: string;
  name: string;
  facilityId: string;
  type: 'court' | 'room' | 'area' | 'section';
  capacity: number;
  description?: string;
  bookableIndependently: boolean;
  conflictRules: ConflictRule[];
  equipment?: string[];
  dimensions?: {
    width: number;
    length: number;
    height?: number;
  };
  status: 'active' | 'maintenance' | 'inactive';
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
