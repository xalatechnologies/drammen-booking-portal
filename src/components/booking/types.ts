
import { z } from "zod";

// Booking form schema used for validation
export const bookingFormSchema = z.object({
  bookingMode: z.enum(['one-time', 'date-range', 'recurring']),
  date: z.date({
    required_error: "Velg en dato for reservasjonen.",
  }),
  endDate: z.date().optional(),
  timeSlot: z.string({
    required_error: "Velg et tidsintervall.",
  }),
  zoneId: z.string({
    required_error: "Velg en sone.",
  }),
  purpose: z.string().min(10, {
    message: "Formålet må være minst 10 tegn.",
  }).max(500, {
    message: "Formålet kan ikke være mer enn 500 tegn."
  }),
  attendees: z.coerce.number().min(1, {
    message: "Antall deltakere må være minst 1.",
  }).max(1000, {
    message: "Antall deltakere kan ikke være mer enn 1000.",
  }),
  contactName: z.string().min(2, {
    message: "Navnet må være minst 2 tegn.",
  }),
  contactEmail: z.string().email({
    message: "Skriv inn en gyldig e-postadresse.",
  }),
  contactPhone: z.string().min(8, {
    message: "Telefonnummeret må være minst 8 tall.",
  }).regex(/^[0-9+\s]+$/, {
    message: "Telefonnummeret kan bare inneholde tall, '+' og mellomrom.",
  }),
  organization: z.string().optional(),
  
  // Recurring booking fields - now as a nested object
  recurrence: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
    interval: z.number().min(1).max(30).optional(),
    count: z.number().min(1).max(100).optional(),
    until: z.date().optional()
  }).optional(),
});

// Type for form values based on the schema
export type BookingFormValues = z.infer<typeof bookingFormSchema>;

// Enhanced Zone interface with full zone management capabilities
export interface Zone {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  pricePerHour: number;
  description: string;
  area?: string;
  
  // Enhanced zone properties
  isMainZone?: boolean; // Indicates if this is the "whole facility" zone
  parentZoneId?: string; // For hierarchical zone structure
  subZones?: string[]; // Child zone IDs for main zones
  
  // Zone-specific rules
  bookingRules: {
    minBookingDuration: number; // in hours
    maxBookingDuration: number; // in hours
    allowedTimeSlots: string[]; // e.g., ["08:00-10:00", "10:00-12:00"]
    bookingTypes: ('one-time' | 'recurring' | 'fixed-lease')[]; // Supported booking types
    advanceBookingDays: number; // How many days in advance can be booked
    cancellationHours: number; // Hours before booking can be cancelled
  };
  
  // Administrative information
  adminInfo: {
    contactPersonId?: string;
    contactPersonName?: string;
    contactPersonEmail?: string;
    specialInstructions?: string;
    maintenanceSchedule?: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
  };
  
  // Zone layout and visual information
  layout?: {
    mapImageUrl?: string;
    coordinates?: { x: number; y: number; width: number; height: number };
    floorPlan?: string;
    entryPoints?: string[];
  };
  
  // Accessibility and features
  accessibility: string[];
  features: string[];
  restrictions?: string[];
  
  // Status and availability
  isActive: boolean;
  temporaryUnavailable?: {
    startDate: Date;
    endDate: Date;
    reason: string;
  };
}

// Type for the booking data passed to BookingConfirmStep - updated to include zoneId
export interface BookingData {
  date: Date;
  bookingMode: "one-time" | "date-range" | "recurring";
  timeSlot: string;
  zoneId: string;
  zoneName?: string;
  purpose: string;
  attendees: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organization?: string;
  endDate?: Date;
  recurrenceRule?: string;
  recurrenceDescription?: string;
}

// Enhanced booking conflict types
export interface BookingConflict {
  conflictType: 'zone-conflict' | 'whole-facility-conflict' | 'sub-zone-conflict';
  conflictingBookingId: string;
  conflictingZoneId: string;
  conflictingZoneName: string;
  timeSlot: string;
  date: Date;
  bookedBy?: string;
}

// Zone availability status
export interface ZoneAvailabilityStatus {
  zoneId: string;
  date: Date;
  timeSlot: string;
  isAvailable: boolean;
  conflictReason?: 'booked' | 'maintenance' | 'whole-facility-booked' | 'sub-zone-conflict';
  conflictDetails?: BookingConflict;
}

// Step type definitions
export type BookingStep = 'details' | 'contact' | 'confirm';
