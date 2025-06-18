
import { Booking, BookingStatus } from '@/types/booking';
import { Zone } from '@/types/zone';

interface BookingConflictResult {
  hasConflict: boolean;
  conflictingBookings: Booking[];
  availableAlternatives: Zone[];
}

export class BookingConflictRepository {
  constructor(private zones: Zone[], private bookings: Booking[]) {}

  async checkBookingConflicts(
    zoneId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string
  ): Promise<{ success: boolean; data?: BookingConflictResult; error?: any }> {
    try {
      const zone = this.zones.find(z => z.id === zoneId);
      if (!zone) {
        return { success: false, error: { message: 'Zone not found' } };
      }

      // Get all bookings for this zone and date range
      const zoneBookings = this.bookings.filter(booking => 
        booking.zoneId === zoneId &&
        booking.id !== excludeBookingId &&
        booking.status !== 'cancelled' &&
        booking.status !== 'rejected' &&
        booking.startDate < endDate && booking.endDate > startDate
      );

      // Check for conflicts with main zone if booking a sub-zone
      let mainZoneConflicts: Booking[] = [];
      if (zone.parentZoneId) {
        mainZoneConflicts = this.bookings.filter(booking =>
          booking.zoneId === zone.parentZoneId &&
          booking.id !== excludeBookingId &&
          booking.status !== 'cancelled' &&
          booking.status !== 'rejected' &&
          booking.startDate < endDate && booking.endDate > startDate
        );
      }

      // Check for conflicts with sub-zones if booking main zone
      let subZoneConflicts: Booking[] = [];
      const subZones = this.zones.filter(z => z.parentZoneId === zoneId);
      if (zone.isMainZone && subZones.length > 0) {
        const subZoneIds = subZones.map(z => z.id);
        subZoneConflicts = this.bookings.filter(booking =>
          subZoneIds.includes(booking.zoneId) &&
          booking.id !== excludeBookingId &&
          booking.status !== 'cancelled' &&
          booking.status !== 'rejected' &&
          booking.startDate < endDate && booking.endDate > startDate
        );
      }

      const allConflicts = [...zoneBookings, ...mainZoneConflicts, ...subZoneConflicts];
      const hasConflict = allConflicts.length > 0;

      // Find alternative zones if there's a conflict
      const availableAlternatives: Zone[] = [];
      if (hasConflict) {
        for (const alternativeZone of this.zones) {
          if (alternativeZone.id === zoneId || !alternativeZone.isActive) continue;
          
          const alternativeConflicts = await this.checkBookingConflicts(
            alternativeZone.id,
            startDate,
            endDate,
            excludeBookingId
          );
          
          if (alternativeConflicts.success && !alternativeConflicts.data?.hasConflict) {
            availableAlternatives.push(alternativeZone);
          }
        }
      }

      return {
        success: true,
        data: {
          hasConflict,
          conflictingBookings: allConflicts,
          availableAlternatives
        }
      };
    } catch (error) {
      return { success: false, error: { message: 'Failed to check booking conflicts', details: error } };
    }
  }

  async getBookingAvailability(
    zoneId: string,
    date: Date,
    timeSlots: string[]
  ): Promise<{ success: boolean; data?: Record<string, boolean>; error?: any }> {
    try {
      const availability: Record<string, boolean> = {};
      
      for (const timeSlot of timeSlots) {
        const [startTime, endTime] = timeSlot.split('-');
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        
        const startDate = new Date(date);
        startDate.setHours(startHour, startMin, 0, 0);
        
        const endDate = new Date(date);
        endDate.setHours(endHour, endMin, 0, 0);
        
        const conflictCheck = await this.checkBookingConflicts(zoneId, startDate, endDate);
        availability[timeSlot] = conflictCheck.success && !conflictCheck.data?.hasConflict;
      }
      
      return { success: true, data: availability };
    } catch (error) {
      return { success: false, error: { message: 'Failed to check availability', details: error } };
    }
  }
}
