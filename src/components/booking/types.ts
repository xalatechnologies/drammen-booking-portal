
export interface ZoneAvailabilityStatus {
  zoneId: string;
  isAvailable: boolean;
  conflicts: string[];
  restrictions: string[];
}

export interface BookingFormData {
  facilityId: string;
  zoneId: string;
  startDate: Date;
  endDate: Date;
  purpose: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  specialRequirements?: string;
  expectedAttendees: number;
  actorType: string;
  eventType: string;
  ageGroup: string;
}

export type BookingStep = 'selection' | 'details' | 'confirmation';

// Zone interface for booking components
export interface Zone {
  id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerHour: number;
  area: string;
  equipment: string[];
  amenities: string[];
  bookingRules: {
    minBookingDuration: number;
    maxBookingDuration: number;
    allowedTimeSlots: string[];
    bookingTypes: string[];
    advanceBookingDays: number;
    cancellationHours: number;
  };
  accessibility: string[];
  features: string[];
  isActive: boolean;
  subZones: string[];
  layout: {
    coordinates: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    entryPoints: string[];
  };
  adminInfo: {
    contactPersonName: string;
    contactPersonEmail: string;
    specialInstructions: string;
    maintenanceSchedule: any[];
  };
}

export type BookingStatus = 'draft' | 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface BookingConflict {
  id: string;
  booking_id: string;
  conflict_type: string;
  conflict_description: string;
  conflict_severity: string;
  resolved: boolean;
  created_at: string;
  conflicting_booking_id?: string;
  resolved_by?: string;
  resolved_at?: string;
  resolution_notes?: string;
}
