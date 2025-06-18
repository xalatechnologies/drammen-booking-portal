
import { Zone, BookingConflict, ZoneAvailabilityStatus } from "@/components/booking/types";

export interface ExistingBooking {
  id: string;
  zoneId: string;
  date: Date;
  timeSlot: string;
  bookedBy: string;
}

export interface ConflictCheckResult {
  conflict: BookingConflict | null;
  isAvailable: boolean;
}

export interface MultiSlotCheckResult {
  available: boolean;
  conflicts: BookingConflict[];
}

export type ConflictReason = 'booked' | 'maintenance' | 'whole-facility-booked' | 'sub-zone-conflict';
