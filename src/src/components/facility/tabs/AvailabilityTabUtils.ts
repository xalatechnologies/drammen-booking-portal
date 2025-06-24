
import { format } from 'date-fns';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';

export const isSlotSelected = (
  selectedSlots: SelectedTimeSlot[],
  zoneId: string, 
  date: Date, 
  timeSlot: string
): boolean => {
  return selectedSlots.some(slot => 
    slot.zoneId === zoneId && 
    format(slot.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && 
    slot.timeSlot === timeSlot
  );
};

export const addSlotToSelection = (
  selectedSlots: SelectedTimeSlot[],
  zoneId: string,
  date: Date,
  timeSlot: string
): SelectedTimeSlot[] => {
  const newSlot: SelectedTimeSlot = {
    zoneId,
    date: new Date(date),
    timeSlot,
    duration: 2 // Default 2 hours
  };
  return [...selectedSlots, newSlot];
};

export const removeSlotFromSelection = (
  selectedSlots: SelectedTimeSlot[],
  zoneId: string,
  date: Date,
  timeSlot: string
): SelectedTimeSlot[] => {
  return selectedSlots.filter(slot => 
    !(slot.zoneId === zoneId && 
      format(slot.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && 
      slot.timeSlot === timeSlot)
  );
};
