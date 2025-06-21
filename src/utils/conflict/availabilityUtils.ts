
import { Zone } from '@/components/booking/types';

export class AvailabilityUtils {
  static checkTimeSlotAvailability(
    zone: Zone,
    date: Date,
    timeSlot: string
  ): boolean {
    // Basic availability check - can be enhanced later
    return zone.isActive;
  }

  static getAvailableTimeSlots(
    zone: Zone,
    date: Date
  ): string[] {
    if (!zone.isActive) return [];
    
    // Return default time slots - can be enhanced with actual business logic
    return [
      "08:00-10:00",
      "10:00-12:00", 
      "12:00-14:00",
      "14:00-16:00",
      "16:00-18:00",
      "18:00-20:00"
    ];
  }
}
