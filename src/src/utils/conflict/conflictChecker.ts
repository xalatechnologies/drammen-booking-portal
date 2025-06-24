
import { Booking } from '@/types/booking';
import { BookingConflict } from '@/types/booking';
import { Zone } from '@/components/booking/types';

export class ConflictChecker {
  
  static checkBookingConflicts(
    newBooking: Partial<Booking>,
    existingBookings: Booking[],
    zones: Zone[]
  ): BookingConflict[] {
    const conflicts: BookingConflict[] = [];
    
    for (const existing of existingBookings) {
      // Check time overlap using correct property names
      const newStart = new Date(newBooking.startDate || '');
      const newEnd = new Date(newBooking.endDate || '');
      const existingStart = new Date(existing.startDate || '');
      const existingEnd = new Date(existing.endDate || '');
      
      if (this.hasTimeOverlap(newStart, newEnd, existingStart, existingEnd)) {
        // Same zone conflict
        if (newBooking.zoneId === existing.zoneId) {
          conflicts.push({
            id: `conflict-${existing.id}`,
            booking_id: newBooking.id || '',
            conflict_type: 'zone-conflict',
            conflict_description: `Zone already booked by another booking`,
            conflict_severity: 'high',
            resolved: false,
            created_at: new Date().toISOString(),
            conflicting_booking_id: existing.id
          });
        }
        
        // Facility-wide conflict (if booking whole facility)
        if (newBooking.facilityId === existing.facilityId && 
            this.isWholeFacilityBooking(newBooking, zones)) {
          conflicts.push({
            id: `facility-conflict-${existing.id}`,
            booking_id: newBooking.id || '',
            conflict_type: 'whole-facility-conflict',
            conflict_description: `Facility already has other bookings during this time`,
            conflict_severity: 'medium',
            resolved: false,
            created_at: new Date().toISOString(),
            conflicting_booking_id: existing.id
          });
        }
        
        // Check zone conflict rules
        const conflictingZones = this.getConflictingZones(newBooking.zoneId, zones);
        if (conflictingZones.includes(existing.zoneId)) {
          conflicts.push({
            id: `zone-rule-conflict-${existing.id}`,
            booking_id: newBooking.id || '',
            conflict_type: 'sub-zone-conflict',
            conflict_description: `Booking conflicts with zone rules`,
            conflict_severity: 'medium',
            resolved: false,
            created_at: new Date().toISOString(),
            conflicting_booking_id: existing.id
          });
        }
      }
    }
    
    return conflicts;
  }
  
  private static hasTimeOverlap(
    startA: Date, endA: Date, startB: Date, endB: Date
  ): boolean {
    return startA < endB && endA > startB;
  }
  
  private static isWholeFacilityBooking(
    booking: Partial<Booking>, zones: Zone[]
  ): boolean {
    // Implement logic to check if the booking is for the whole facility
    // This might involve checking if the booking includes all main zones or a specific flag
    return false; // Replace with actual logic
  }
  
  private static getConflictingZones(
    zoneId: string, zones: Zone[]
  ): string[] {
    // Implement logic to retrieve zones that conflict with the given zone based on conflict rules
    // This might involve checking a conflictRules property on the Zone object
    return []; // Replace with actual logic
  }
}
