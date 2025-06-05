import { UseFormReturn } from "react-hook-form";

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
}

export type BookingStep = 'details' | 'contact' | 'confirm';

export interface BookingFormProps {
  form: UseFormReturn<any>;
  zones: Zone[];
  selectedDate: Date | undefined;
  selectedTimeSlot: string;
}

export interface BookingFormValues {
  bookingMode: 'one-time' | 'date-range' | 'recurring';
  customerType: 'private' | 'nonprofit' | 'business' | 'youth' | 'senior';
  date: Date;
  endDate?: Date;
  timeSlot: string;
  zoneId: string;
  purpose: string;
  eventType: 'training' | 'competition' | 'meeting' | 'celebration' | 'other';
  attendees: number;
  ageGroup: 'mixed' | 'under-20' | 'over-20' | 'children' | 'adults';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organization?: string;
  specialServices?: string[];
}
