/**
 * Types for booking conflict detection and handling
 * Follows Single Responsibility Principle by focusing only on conflict-related concerns
 */

import { Booking } from "../booking";

/**
 * Result of a booking conflict check operation
 * Provides detailed information about conflicts for informed decisions
 */
export interface BookingConflictResult {
  hasConflict: boolean;
  conflictingBookings: Booking[];
  availableAlternatives: BookingAlternative[];
}

/**
 * Represents an alternative time or space suggestion when a booking conflict occurs
 */
export interface BookingAlternative {
  type: 'time' | 'space' | 'both';
  facilityId?: string;
  facilityName?: string;
  zoneId?: string; 
  zoneName?: string;
  startDate?: Date;
  endDate?: Date;
  availabilityPercentage: number; // How closely it matches the original request (0-100%)
  distance?: number; // For space alternatives, distance from original
  timeDifference?: number; // For time alternatives, minutes from original time
}
