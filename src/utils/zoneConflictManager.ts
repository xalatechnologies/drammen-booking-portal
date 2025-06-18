import { Zone, BookingConflict, ZoneAvailabilityStatus } from "@/components/booking/types";

export interface ExistingBooking {
  id: string;
  zoneId: string;
  date: Date;
  timeSlot: string;
  bookedBy: string;
}

export class ZoneConflictManager {
  protected zones: Zone[];  // Changed from private to protected
  private existingBookings: ExistingBooking[];

  constructor(zones: Zone[], existingBookings: ExistingBooking[] = []) {
    this.zones = zones;
    this.existingBookings = existingBookings;
  }

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

  private getConflictReason(conflict: BookingConflict): 'booked' | 'maintenance' | 'whole-facility-booked' | 'sub-zone-conflict' {
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

  /**
   * Get booking recommendations based on requirements
   */
  getBookingRecommendations(
    requiredCapacity: number,
    preferredEquipment: string[],
    date: Date,
    timeSlot: string
  ): Zone[] {
    const availabilityStatuses = this.getZoneAvailabilityStatus(date, timeSlot);
    
    return this.zones
      .filter(zone => {
        const status = availabilityStatuses.find(s => s.zoneId === zone.id);
        return (
          status?.isAvailable &&
          zone.capacity >= requiredCapacity &&
          zone.isActive
        );
      })
      .sort((a, b) => {
        // Score zones based on equipment match and efficiency
        const aEquipmentScore = preferredEquipment.filter(eq => a.equipment.includes(eq)).length;
        const bEquipmentScore = preferredEquipment.filter(eq => b.equipment.includes(eq)).length;
        
        if (aEquipmentScore !== bEquipmentScore) {
          return bEquipmentScore - aEquipmentScore;
        }
        
        // Prefer zones that are closer to required capacity (more efficient)
        const aEfficiency = Math.abs(a.capacity - requiredCapacity);
        const bEfficiency = Math.abs(b.capacity - requiredCapacity);
        
        return aEfficiency - bEfficiency;
      });
  }
}
