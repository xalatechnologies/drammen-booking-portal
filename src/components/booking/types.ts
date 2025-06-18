
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { bookingFormSchema } from "./formSchema";

export interface Zone {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  pricePerHour: number;
  description: string;
  area: string;
  parentZoneId?: string;
  isMainZone?: boolean;
  subZones?: string[];
  bookingRules: {
    minBookingDuration: number;
    maxBookingDuration: number;
    allowedTimeSlots: string[];
    bookingTypes: string[];
    advanceBookingDays: number;
    cancellationHours: number;
  };
  adminInfo: {
    contactPersonName: string;
    contactPersonEmail: string;
    specialInstructions: string;
    maintenanceSchedule: { day: string; startTime: string; endTime: string }[];
  };
  layout: {
    coordinates: { x: number; y: number; width: number; height: number };
    entryPoints: string[];
  };
  accessibility: string[];
  features: string[];
  restrictions?: string[];
  isActive: boolean;
}

export interface BookingConflict {
  conflictType: 'zone-conflict' | 'sub-zone-conflict' | 'whole-facility-conflict';
  conflictingBookingId: string;
  conflictingZoneId: string;
  conflictingZoneName: string;
  timeSlot: string;
  date: Date;
  bookedBy: string;
}

export interface ZoneAvailabilityStatus {
  zoneId: string;
  date: Date;
  timeSlot: string;
  isAvailable: boolean;
  conflictReason?: 'booked' | 'maintenance' | 'whole-facility-booked' | 'sub-zone-conflict';
  conflictDetails?: BookingConflict;
}

export interface BookingData {
  date: Date;
  bookingMode: "one-time" | "date-range" | "recurring";
  timeSlot: string;
  purpose: string;
  attendees: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organization?: string;
  endDate?: Date;
  recurrenceRule?: string;
  recurrenceDescription?: string;
  zoneId?: string;
  zoneName?: string;
  customerType?: string;
  eventType?: string;
  ageGroup?: string;
  selectedServices?: string[];
  servicesPricing?: {
    totalServicesCost: number;
    serviceBreakdown: Array<{
      serviceId: string;
      serviceName: string;
      quantity: number;
      totalPrice: number;
    }>;
  };
}

export type BookingStep = 'details' | 'services' | 'contact' | 'confirm';

export interface BookingFormProps {
  form: UseFormReturn<any>;
  zones: Zone[];
  selectedDate: Date | undefined;
  selectedTimeSlot: string;
}

// Use the inferred type from the Zod schema instead of manually defining it
export type BookingFormValues = z.infer<typeof bookingFormSchema>;
