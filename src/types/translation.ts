
export interface CoreFacility {
  id: number;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  address_country: string;
  type: string;
  area: string;
  status: string;
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
  allowed_booking_types: string[];
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
  
  // Computed fields
  address: string;
  image: string;
  pricePerHour: number;
  accessibility: string[];
  suitableFor: string[];
  hasAutoApproval: boolean;
  nextAvailable: string;
  openingHours: any[];
  zones: any[];
  availableTimes: any[];
}
