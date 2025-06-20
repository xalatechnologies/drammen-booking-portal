
import { useState } from 'react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { isSlotSelected, addSlotToSelection, removeSlotFromSelection } from '@/components/facility/tabs/AvailabilityTabUtils';

export function useSlotSelection() {
  const [selectedSlots, setSelectedSlots] = useState<SelectedTimeSlot[]>([]);

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    console.log('useSlotSelection: handleSlotClick called with:', { zoneId, date, timeSlot, availability });
    
    if (availability !== 'available') return;

    const isSelected = isSlotSelected(selectedSlots, zoneId, date, timeSlot);
    console.log('useSlotSelection: isSelected:', isSelected);
    console.log('useSlotSelection: current selectedSlots before update:', selectedSlots);

    if (isSelected) {
      const updatedSlots = removeSlotFromSelection(selectedSlots, zoneId, date, timeSlot);
      console.log('useSlotSelection: removing slot, new array:', updatedSlots);
      setSelectedSlots(updatedSlots);
    } else {
      const updatedSlots = addSlotToSelection(selectedSlots, zoneId, date, timeSlot);
      console.log('useSlotSelection: adding slot, new array:', updatedSlots);
      setSelectedSlots(updatedSlots);
    }
  };

  const clearSelection = () => {
    console.log('useSlotSelection: clearing all selections');
    setSelectedSlots([]);
  };

  return {
    selectedSlots,
    setSelectedSlots,
    handleSlotClick,
    clearSelection
  };
}
