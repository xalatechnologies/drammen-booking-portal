
import { Zone, ZoneAvailabilityStatus, BookingConflict } from "@/components/booking/types";
import { ConflictChecker } from "./conflictChecker";
import { ExistingBooking, ConflictReason } from "./types";

export class AvailabilityUtils extends ConflictChecker {
  constructor(zones: Zone[], existingBookings: ExistingBooking[]) {
    super(zones, existingBookings);
  }

  /**
   * Get availability status for all zones for a specific date and time
   */
  getZoneAvailabilityStatus(date: Date, timeSlot: string): ZoneAvailabilityStatus[] {
    return this.zones.map(zone => {
      const conflict = this.checkZoneConflict(zone.id, date, timeSlot);
      
      return {
        zoneId: zone.id,
        date,
        timeSlot,
        isAvailable: !conflict && zone.isActive,
        conflictReason: conflict ? this.getConflictReason(conflict) : undefined,
        conflictDetails: conflict || undefined
      };
    });
  }

  /**
   * Get available alternative zones when a preferred zone is unavailable
   */
  getAlternativeZones(
    preferredZoneId: string,
    date: Date,
    timeSlot: string,
    requiredCapacity: number
  ): Zone[] {
    const availabilityStatuses = this.getZoneAvailabilityStatus(date, timeSlot);
    
    return this.zones.filter(zone => {
      const status = availabilityStatuses.find(s => s.zoneId === zone.id);
      return (
        zone.id !== preferredZoneId &&
        status?.isAvailable &&
        zone.capacity >= requiredCapacity &&
        zone.isActive
      );
    });
  }

  private getConflictReason(conflict: BookingConflict): ConflictReason {
    return super.getConflictReason(conflict);
  }
}
