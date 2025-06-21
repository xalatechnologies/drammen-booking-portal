
import { Booking, BookingConflict } from '@/types/booking';
import { Zone } from '@/types/zone';

export function checkForConflicts(
  booking: Booking,
  existingBookings: Booking[],
  zones: Zone[]
): BookingConflict[] {
  const conflicts: BookingConflict[] = [];
  const bookingStart = new Date(booking.start_date);
  const bookingEnd = new Date(booking.end_date);

  // Check for overlapping bookings in the same zone
  const overlappingBookings = existingBookings.filter(existing => {
    if (existing.id === booking.id) return false;
    if (existing.zone_id !== booking.zone_id) return false;
    if (existing.status === 'cancelled') return false;

    const existingStart = new Date(existing.start_date);
    const existingEnd = new Date(existing.end_date);

    return bookingStart < existingEnd && bookingEnd > existingStart;
  });

  overlappingBookings.forEach(conflicting => {
    conflicts.push({
      id: `conflict-${Date.now()}-${Math.random()}`,
      booking_id: booking.id,
      conflict_type: 'time_overlap',
      conflict_description: `Overlapping booking in the same zone`,
      conflict_severity: 'high',
      resolved: false,
      created_at: new Date().toISOString(),
      conflicting_booking_id: conflicting.id,
      resolved_by: null,
      resolved_at: null,
      resolution_notes: null
    });
  });

  // Check for zone conflicts (mutually exclusive zones)
  const currentZone = zones.find(z => z.id === booking.zone_id);
  if (currentZone?.conflictRules) {
    currentZone.conflictRules.forEach(rule => {
      const conflictingZoneBookings = existingBookings.filter(existing => {
        if (existing.id === booking.id) return false;
        if (existing.zone_id !== rule.conflictingZoneId) return false;
        if (existing.status === 'cancelled') return false;

        const existingStart = new Date(existing.start_date);
        const existingEnd = new Date(existing.end_date);

        return bookingStart < existingEnd && bookingEnd > existingStart;
      });

      conflictingZoneBookings.forEach(conflicting => {
        conflicts.push({
          id: `conflict-${Date.now()}-${Math.random()}`,
          booking_id: booking.id,
          conflict_type: 'zone_conflict',
          conflict_description: `Zone conflict: ${rule.description}`,
          conflict_severity: rule.type === 'mutually_exclusive' ? 'high' : 'medium',
          resolved: false,
          created_at: new Date().toISOString(),
          conflicting_booking_id: conflicting.id,
          resolved_by: null,
          resolved_at: null,
          resolution_notes: null
        });
      });
    });
  }

  return conflicts;
}

export function resolveConflict(
  conflictId: string,
  resolution: 'approve_both' | 'reject_new' | 'modify_time',
  notes?: string
): BookingConflict {
  return {
    id: conflictId,
    booking_id: '',
    conflict_type: 'resolved',
    conflict_description: `Conflict resolved: ${resolution}`,
    conflict_severity: 'low',
    resolved: true,
    created_at: new Date().toISOString(),
    conflicting_booking_id: null,
    resolved_by: 'admin',
    resolved_at: new Date().toISOString(),
    resolution_notes: notes || null
  };
}
