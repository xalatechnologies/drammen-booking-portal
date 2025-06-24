
import { Zone } from "@/components/booking/types";
import { BookingConflict } from "@/types/booking";

export interface ExistingBooking {
  id: string;
  zoneId: string;
  startDate: Date;
  endDate: Date;
  userId: string;
  purpose: string;
}

export class ZoneConflictManager {
  protected zones: Zone[];
  protected existingBookings: ExistingBooking[];

  constructor(zones: Zone[], existingBookings: ExistingBooking[] = []) {
    this.zones = zones;
    this.existingBookings = existingBookings;
  }

  // Add the missing checkZoneConflict method
  checkZoneConflict(zoneId: string, date: Date, timeSlot: string): BookingConflict | null {
    // Check if there's a conflict for the given zone, date, and time slot
    const conflictingBooking = this.existingBookings.find(booking => {
      const bookingDate = new Date(booking.startDate);
      const bookingStartHour = bookingDate.getHours();
      const slotStartHour = parseInt(timeSlot.split(':')[0]);
      
      return booking.zoneId === zoneId &&
             bookingDate.toDateString() === date.toDateString() &&
             bookingStartHour === slotStartHour;
    });

    if (conflictingBooking) {
      return {
        id: `conflict-${zoneId}-${date.getTime()}-${timeSlot}`,
        booking_id: conflictingBooking.id,
        conflict_type: 'zone-conflict',
        conflict_description: `Zone is already booked`,
        conflict_severity: 'high',
        resolved: false,
        created_at: new Date().toISOString()
      };
    }

    return null;
  }
}
