
import { Language } from '@/i18n/types';

export interface TranslationKey {
  id: string;
  key_path: string;
  namespace: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Translation {
  id: string;
  translation_key_id: string;
  language_code: Language;
  value: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FacilityContentKey {
  id: string;
  facility_id: number;
  content_type: 'name' | 'description' | 'suitableFor' | 'equipment' | 'amenities';
  content_key: string;
  created_at: string;
}

export interface CoreFacility {
  id: number;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  address_country: string;
  type: string;
  area: string;
  status: 'active' | 'maintenance' | 'inactive';
  image_url: string | null;
  capacity: number;
  next_available: string | null;
  rating: number | null;
  review_count: number | null;
  price_per_hour: number;
  has_auto_approval: boolean;
  time_slot_duration: number;
  latitude: number | null;
  longitude: number | null;
  accessibility_features: string[] | null;
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
  openingHours: Array<{
    dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    opens: string;
    closes: string;
  }>;
  zones: Array<any>;
  availableTimes?: Array<{
    date: Date;
    slots: Array<{
      start: string;
      end: string;
      available: boolean;
    }>;
  }>;
}

export interface FacilityView extends CoreFacility {
  // Translated fields
  name: string;
  description: string;
  suitableFor: string[];
  equipment: string[];
  amenities: string[];
  
  // Computed fields for backwards compatibility
  address: string;
  image: string;
  pricePerHour: number;
  accessibility: string[];
  hasAutoApproval: boolean;
  nextAvailable: string;
  timeSlotDuration: 1 | 2;
  season: {
    from: string;
    to: string;
  };
}
