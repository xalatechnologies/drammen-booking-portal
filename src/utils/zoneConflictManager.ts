
import { Zone } from "@/components/booking/types";
import { RecommendationEngine } from "./conflict/recommendationEngine";
import type { ExistingBooking } from "./conflict/types";
import { BookingConflict } from "@/components/booking/types";

export type { ExistingBooking } from "./conflict/types";

export class ZoneConflictManager extends RecommendationEngine {
  constructor(zones: Zone[], existingBookings: ExistingBooking[] = []) {
    super(zones, existingBookings);
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
