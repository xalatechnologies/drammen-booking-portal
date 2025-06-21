export interface BookingRules {
  minBookingDuration: number;
  maxBookingDuration: number;
  allowedTimeSlots: string[];
  bookingTypes: string[];
  advanceBookingDays: number;
  cancellationHours: number;
}

export interface AdminInfo {
  contactPersonName: string;
  contactPersonEmail: string;
  specialInstructions: string;
  maintenanceSchedule: MaintenanceSchedule[];
}

export interface MaintenanceSchedule {
  day: string;
  startTime: string;
  endTime: string;
}

export interface ZoneLayout {
  coordinates: Coordinates;
  entryPoints: string[];
}

export interface Coordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Zone {
  id: string;
  name: string;
  facilityId: string;
  capacity: number;
  pricePerHour: number;
  description: string;
  area: string;
  isMainZone: boolean; // Add missing property
  parentZoneId?: string;
  subZones: string[];
  equipment: string[];
  amenities: string[]; // Required property
  bookingRules: BookingRules;
  adminInfo: AdminInfo;
  layout: ZoneLayout;
  accessibility: string[];
  features: string[];
  isActive: boolean;
}

export interface ZoneAvailabilityStatus {
  zoneId: string;
  date: Date;
  timeSlot: string;
  isAvailable: boolean;
  conflictReason?: string;
  conflictDetails?: ZoneConflict;
}

export interface ZoneConflict {
  zoneId: string;
  conflictType: 'booking' | 'maintenance' | 'blackout' | 'zone-conflict';
  startTime: Date;
  endTime: Date;
  severity: 'low' | 'medium' | 'high';
  description: string;
  canOverride: boolean;
}
