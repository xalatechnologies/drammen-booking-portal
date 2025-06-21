
import { Booking } from '@/types/booking';
import { ZoneAvailabilityStatus } from '@/components/booking/types';

export interface ConflictCheckResult {
  hasConflicts: boolean;
  conflictingBookings: Booking[];
  availableAlternatives: AlternativeSlot[];
}

export interface AlternativeSlot {
  startTime: Date;
  endTime: Date;
  zoneId: string;
  zoneName: string;
  reason: string;
}

export interface ConflictRule {
  id: string;
  sourceZoneId: string;
  conflictingZoneId: string;
  type: 'mutually_exclusive' | 'partial_overlap' | 'noise_conflict';
  description: string;
}

export { ZoneAvailabilityStatus };
