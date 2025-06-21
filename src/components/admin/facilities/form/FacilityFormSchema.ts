
import { z } from "zod";

export const facilityFormSchema = z.object({
  // Basic Information
  name: z.string().min(1, "Facility name is required"),
  type: z.string().min(1, "Facility type is required"),
  area: z.string().min(1, "Area is required"),
  description: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  area_sqm: z.number().min(0, "Area must be positive").optional(),
  
  // Address Information
  address_street: z.string().min(1, "Street address is required"),
  address_city: z.string().min(1, "City is required"),
  address_postal_code: z.string().min(4, "Valid postal code is required"),
  address_country: z.string().default("Norway"),
  
  // Contact Information
  contact_name: z.string().optional(),
  contact_email: z.string().email("Valid email is required").optional(),
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
  
  // Season
  season_from: z.string().optional(),
  season_to: z.string().optional(),
  
  // Features
  is_featured: z.boolean().default(false),
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
  "Projecter", "Sound system", "Microphones", "Lighting", "Wi-Fi",
  "Parking", "Kitchen", "Changing rooms", "Storage", "First aid",
  "Football goals", "Basketball hoops", "Volleyball nets", "Gymnastics equipment"
] as const;

export const AMENITIES_OPTIONS = [
  "Cafeteria", "Vending machines", "Lockers", "Showers", "Toilets",
  "Reception", "Security", "Cleaning service", "Technical support"
] as const;

export const ACCESSIBILITY_OPTIONS = [
  "Wheelchair accessible", "Elevator access", "Accessible parking",
  "Accessible toilets", "Visual aids", "Hearing loop", "Braille signage"
] as const;
