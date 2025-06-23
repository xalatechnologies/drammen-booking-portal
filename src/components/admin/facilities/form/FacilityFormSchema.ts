import { z } from "zod";

export const facilityFormSchema = z.object({
  // Basic Information
  name: z.string().min(1, "Facility name is required"),
  type: z.string().min(1, "Facility type is required"),
  area: z.string().min(1, "Area is required"),
  description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  area_sqm: z.number().min(0, "Area must be positive").optional(),
  
  // Address Information
  address_street: z.string().min(1, "Street address is required"),
  address_city: z.string().min(1, "City is required"),
  address_postal_code: z.string().min(4, "Valid postal code is required"),
  address_country: z.string().default("Norway"),
  
  // Contact Information
  contact_name: z.string().optional(),
  contact_email: z.string().email("Valid email is required").optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  
  // Configuration
  status: z.enum(["active", "maintenance", "inactive"]).default("active"),
  has_auto_approval: z.boolean().default(false),
  price_per_hour: z.number().min(0, "Price must be positive").default(450),
  time_slot_duration: z.number().min(1).max(4).default(1),
  
  // Booking Configuration
  booking_lead_time_hours: z.number().min(0).default(2),
  max_advance_booking_days: z.number().min(1).default(365),
  cancellation_deadline_hours: z.number().min(0).default(24),
  allowed_booking_types: z.array(z.enum(["engangs", "fastlan", "rammetid", "strotimer"])).default(["engangs"]),
  
  // Features and Amenities
  equipment: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  accessibility_features: z.array(z.string()).default([]),
  
  // Location
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  
  // Season & Availability - Enhanced
  season_from: z.string().optional(),
  season_to: z.string().optional(),
  
  // Features - Enhanced
  is_featured: z.boolean().default(false),
  
  // New fields for enhanced functionality
  next_available: z.string().nullable().optional(),
  rating: z.number().min(0).max(5).optional(),
  review_count: z.number().min(0).optional(),
  
  // Zones configuration (will be managed separately but referenced here)
  main_zone_capacity: z.number().optional(),
  sub_zones_count: z.number().min(0).default(0),
  
  // Advanced pricing configuration
  dynamic_pricing_enabled: z.boolean().default(false),
  peak_hour_multiplier: z.number().min(1).default(1),
  off_peak_discount: z.number().min(0).max(1).default(0),
  
  // Approval workflow
  requires_approval: z.boolean().default(false),
  auto_approval_rules: z.array(z.string()).default([]),
  
  // Integration settings
  external_calendar_sync: z.boolean().default(false),
  notification_settings: z.object({
    email_notifications: z.boolean().default(true),
    sms_notifications: z.boolean().default(false),
    booking_confirmations: z.boolean().default(true),
    cancellation_alerts: z.boolean().default(true),
  }).optional(),
});

export type FacilityFormData = z.infer<typeof facilityFormSchema>;

export const FACILITY_TYPES = [
  "fotballhall",
  "idrettshall", 
  "gymsal",
  "svømmehall",
  "aktivitetshall",
  "auditorium",
  "konferanserom",
  "møterom",
  "klasserom",
  "kultursenter"
] as const;

export const BOOKING_TYPES = [
  { value: "engangs", label: "One-time booking" },
  { value: "fastlan", label: "Regular lease" },
  { value: "rammetid", label: "Frame time allocation" },
  { value: "strotimer", label: "Drop-in slots" }
] as const;

export const EQUIPMENT_OPTIONS = [
  "Projector", "Sound system", "Microphones", "Lighting", "Wi-Fi",
  "Parking", "Kitchen", "Changing rooms", "Storage", "First aid",
  "Football goals", "Basketball hoops", "Volleyball nets", "Gymnastics equipment",
  "Stage", "Seating", "Air conditioning", "Heating", "Security cameras"
] as const;

export const AMENITIES_OPTIONS = [
  "Cafeteria", "Vending machines", "Lockers", "Showers", "Toilets",
  "Reception", "Security", "Cleaning service", "Technical support",
  "Catering services", "Event planning", "Equipment rental", "Livestreaming"
] as const;

export const ACCESSIBILITY_OPTIONS = [
  "Wheelchair accessible", "Elevator access", "Accessible parking",
  "Accessible toilets", "Visual aids", "Hearing loop", "Braille signage",
  "Ramp access", "Wide doorways", "Accessible seating", "Sign language support"
] as const;

export const ZONE_TYPES = [
  { value: "court", label: "Court" },
  { value: "room", label: "Room" },
  { value: "area", label: "Area" },
  { value: "section", label: "Section" },
  { value: "field", label: "Field" }
] as const;

export const BLACKOUT_TYPES = [
  { value: "maintenance", label: "Maintenance", icon: "🔧" },
  { value: "renovation", label: "Renovation", icon: "🏗️" },
  { value: "event", label: "Private Event", icon: "🎉" },
  { value: "weather", label: "Weather", icon: "⛈️" },
  { value: "other", label: "Other", icon: "📋" }
] as const;

export const ACTOR_TYPES = [
  { value: "individual", label: "Individual", multiplier: 1.0 },
  { value: "organization", label: "Organization", multiplier: 0.85 },
  { value: "commercial", label: "Commercial", multiplier: 1.25 },
  { value: "nonprofit", label: "Non-profit", multiplier: 0.75 },
  { value: "government", label: "Government", multiplier: 0.9 }
] as const;
