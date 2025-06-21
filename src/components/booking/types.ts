
import { ActorType } from '@/types/pricing';

export interface Zone {
  id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerHour: number;
  area?: string;
  equipment?: string[];
  amenities?: string[];
  isMainZone?: boolean;
  bookingRules?: {
    minBookingDuration: number;
    maxBookingDuration: number;
    allowedTimeSlots: string[];
    bookingTypes: string[];
    advanceBookingDays: number;
    cancellationHours: number;
  };
  accessibility?: string[];
  features?: string[];
  layout?: {
    coordinates: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    entryPoints: string[];
  };
  adminInfo?: {
    contactPersonName: string;
    contactPersonEmail: string;
    specialInstructions: string;
    maintenanceSchedule: Array<{
      day: string;
      startTime: string;
      endTime: string;
    }>;
  };
  isActive?: boolean;
  subZones?: string[];
  parentZoneId?: string;
}

export interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: ActorType | '';
  termsAccepted: boolean;
}

export interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
  price?: number;
}

export interface BookingRequest {
  facilityId: string;
  zoneId: string;
  startDate: Date;
  endDate: Date;
  purpose: string;
  attendees: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  actorType: ActorType;
  additionalInfo?: string;
}

export interface BookingConflict {
  conflictType: 'zone-conflict' | 'whole-facility-conflict' | 'sub-zone-conflict';
  date: Date;
  timeSlot: string;
  bookedBy: string;
  conflictingZoneName?: string;
}

export enum BookingStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled'
}
