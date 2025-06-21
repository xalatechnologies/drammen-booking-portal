
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
