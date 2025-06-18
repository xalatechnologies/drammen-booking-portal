
import { Zone, BookingConflict } from "@/components/booking/types";
import { ExistingBooking } from "./types";

export class ConflictChecker {
  constructor(
    private zones: Zone[],
    private existingBookings: ExistingBooking[]
  ) {}

  /**
   * Check if a zone booking conflicts with existing bookings
   */
  checkZoneConflict(
    zoneId: string,
    date: Date,
    timeSlot: string
  ): BookingConflict | null {
    const zone = this.zones.find(z => z.id === zoneId);
    if (!zone) return null;

    const dateKey = date.toDateString();
    
    // Check direct conflicts (same zone, same time)
    const directConflict = this.existingBookings.find(booking => 
      booking.zoneId === zoneId && 
      booking.date.toDateString() === dateKey && 
      booking.timeSlot === timeSlot
    );

    if (directConflict) {
      return {
        conflictType: 'zone-conflict',
        conflictingBookingId: directConflict.id,
        conflictingZoneId: directConflict.zoneId,
        conflictingZoneName: zone.name,
        timeSlot,
        date,
        bookedBy: directConflict.bookedBy
      };
    }

    // If booking the main zone (whole facility), check if any sub-zones are booked
    if (zone.isMainZone && zone.subZones) {
      for (const subZoneId of zone.subZones) {
        const subZoneConflict = this.existingBookings.find(booking => 
          booking.zoneId === subZoneId && 
          booking.date.toDateString() === dateKey && 
          booking.timeSlot === timeSlot
        );

        if (subZoneConflict) {
          const subZone = this.zones.find(z => z.id === subZoneId);
          return {
            conflictType: 'sub-zone-conflict',
            conflictingBookingId: subZoneConflict.id,
            conflictingZoneId: subZoneConflict.zoneId,
            conflictingZoneName: subZone?.name || 'Ukjent sone',
            timeSlot,
            date,
            bookedBy: subZoneConflict.bookedBy
          };
        }
      }
    }

    // If booking a sub-zone, check if the main zone is booked
    if (zone.parentZoneId) {
      const mainZoneConflict = this.existingBookings.find(booking => 
        booking.zoneId === zone.parentZoneId && 
        booking.date.toDateString() === dateKey && 
        booking.timeSlot === timeSlot
      );

      if (mainZoneConflict) {
        const mainZone = this.zones.find(z => z.id === zone.parentZoneId);
        return {
          conflictType: 'whole-facility-conflict',
          conflictingBookingId: mainZoneConflict.id,
          conflictingZoneId: mainZoneConflict.zoneId,
          conflictingZoneName: mainZone?.name || 'Hele lokalet',
          timeSlot,
          date,
          bookedBy: mainZoneConflict.bookedBy
        };
      }
    }

    return null;
  }

  /**
   * Check if a zone can be booked for multiple time slots (for recurring bookings)
   */
  checkMultiSlotAvailability(
    zoneId: string,
    dates: Date[],
    timeSlot: string
  ): { available: boolean; conflicts: BookingConflict[] } {
    const conflicts: BookingConflict[] = [];
    
    for (const date of dates) {
      const conflict = this.checkZoneConflict(zoneId, date, timeSlot);
      if (conflict) {
        conflicts.push(conflict);
      }
    }

    return {
      available: conflicts.length === 0,
      conflicts
    };
  }

  protected getConflictReason(conflict: BookingConflict): 'booked' | 'maintenance' | 'whole-facility-booked' | 'sub-zone-conflict' {
    switch (conflict.conflictType) {
      case 'zone-conflict':
        return 'booked';
      case 'whole-facility-conflict':
        return 'whole-facility-booked';
      case 'sub-zone-conflict':
        return 'sub-zone-conflict';
      default:
        return 'booked';
    }
  }
}
