
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';

export function useAvailabilityStatus(selectedSlots: SelectedTimeSlot[]) {
  const getAvailabilityStatus = (zoneId: string, date: Date, timeSlot: string) => {
    // Check if the time slot is in the past
    const now = new Date();
    const timeHour = parseInt(timeSlot.split(':')[0]);
    const slotDateTime = new Date(date);
    slotDateTime.setHours(timeHour, 0, 0, 0);
    
    if (slotDateTime < now) {
      return { status: 'unavailable', conflict: null };
    }

    // For now, return available - this can be enhanced with conflict checking
    return { status: 'available', conflict: null };
  };

  const isSlotSelected = (zoneId: string, date: Date, timeSlot: string) => {
    return selectedSlots.some(slot => {
      // Ensure slot.date is a proper Date object
      const slotDate = slot.date instanceof Date ? slot.date : new Date(slot.date);
      
      return slot.zoneId === zoneId &&
        slotDate.toDateString() === date.toDateString() &&
        slot.timeSlot === timeSlot;
    });
  };

  return {
    getAvailabilityStatus,
    isSlotSelected
  };
}
