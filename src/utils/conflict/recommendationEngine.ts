
import { Zone } from '@/components/booking/types';
import { ConflictCheckResult, AlternativeSlot } from './types';
import { AvailabilityUtils } from './availabilityUtils';
import { ExistingBooking } from './types';

export class RecommendationEngine {
  private zones: Zone[];
  private existingBookings: ExistingBooking[];

  constructor(zones: Zone[], existingBookings: ExistingBooking[] = []) {
    this.zones = zones;
    this.existingBookings = existingBookings;
  }

  getZoneAvailabilityStatus(zoneId: string, date: Date, timeSlot: string): boolean {
    const zone = this.zones.find(z => z.id === zoneId);
    if (!zone) return false;
    
    return AvailabilityUtils.checkTimeSlotAvailability(zone, date, timeSlot);
  }

  generateAlternatives(
    preferredZoneId: string,
    preferredDate: Date,
    preferredTimeSlot: string
  ): AlternativeSlot[] {
    const alternatives: AlternativeSlot[] = [];
    
    // Find alternative zones
    this.zones.forEach(zone => {
      if (zone.id !== preferredZoneId && zone.isActive) {
        if (this.getZoneAvailabilityStatus(zone.id, preferredDate, preferredTimeSlot)) {
          alternatives.push({
            startTime: new Date(`${preferredDate.toDateString()} ${preferredTimeSlot.split('-')[0]}`),
            endTime: new Date(`${preferredDate.toDateString()} ${preferredTimeSlot.split('-')[1]}`),
            zoneId: zone.id,
            zoneName: zone.name,
            reason: `Alternative zone available`
          });
        }
      }
    });

    return alternatives;
  }
}
