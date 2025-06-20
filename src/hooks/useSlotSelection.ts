
import { useState } from 'react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { isSlotSelected, addSlotToSelection, removeSlotFromSelection } from '@/components/facility/tabs/AvailabilityTabUtils';

export function useSlotSelection() {
  const [selectedSlots, setSelectedSlots] = useState<SelectedTimeSlot[]>([]);

  // Function to remove duplicates from selected slots
  const removeDuplicates = (slots: SelectedTimeSlot[]): SelectedTimeSlot[] => {
    const seen = new Set<string>();
    return slots.filter(slot => {
      const key = `${slot.zoneId}-${slot.date.toISOString()}-${slot.timeSlot}`;
      if (seen.has(key)) {
        console.log('useSlotSelection: removing duplicate slot:', slot);
        return false;
      }
      seen.add(key);
      return true;
    });
  };

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

  const handleBulkSlotSelection = (newSlots: SelectedTimeSlot[]) => {
    console.log('useSlotSelection: handleBulkSlotSelection called with:', newSlots);
    console.log('useSlotSelection: current selectedSlots before bulk add:', selectedSlots);
    
    setSelectedSlots(prev => {
      const combined = [...prev, ...newSlots];
      const deduplicated = removeDuplicates(combined);
      console.log('useSlotSelection: combined slots:', combined.length);
      console.log('useSlotSelection: after deduplication:', deduplicated.length);
      return deduplicated;
    });
  };

  const clearSelection = () => {
    console.log('useSlotSelection: clearing all selections');
    setSelectedSlots([]);
  };

  return {
    selectedSlots,
    setSelectedSlots,
    handleSlotClick,
    handleBulkSlotSelection,
    clearSelection
  };
}
