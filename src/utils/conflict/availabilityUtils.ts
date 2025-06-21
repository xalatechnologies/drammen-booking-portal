
import { Zone } from '@/types/zone';
import { ZoneAvailabilityStatus } from '@/components/booking/types';

export function checkZoneAvailability(
  zone: Zone,
  startTime: Date,
  endTime: Date,
  existingBookings: any[] = []
): ZoneAvailabilityStatus {
  const conflicts: string[] = [];
  const restrictions: string[] = [];

  // Check for overlapping bookings
  const overlappingBookings = existingBookings.filter(booking => {
    const bookingStart = new Date(booking.start_date);
    const bookingEnd = new Date(booking.end_date);
    
    return (
      (startTime < bookingEnd && endTime > bookingStart) &&
      booking.zone_id === zone.id &&
      booking.status !== 'cancelled'
    );
  });

  if (overlappingBookings.length > 0) {
    conflicts.push(`Zone is already booked for ${overlappingBookings.length} overlapping time slots`);
  }

  // Check zone status
  if (zone.status !== 'active') {
    restrictions.push(`Zone is currently ${zone.status}`);
  }

  const isAvailable = conflicts.length === 0 && restrictions.length === 0;

  return {
    zoneId: zone.id,
    isAvailable,
    conflicts,
    restrictions
  };
}

export function findAvailableZones(
  zones: Zone[],
  startTime: Date,
  endTime: Date,
  existingBookings: any[] = []
): Zone[] {
  return zones.filter(zone => {
    const availability = checkZoneAvailability(zone, startTime, endTime, existingBookings);
    return availability.isAvailable;
  });
}
