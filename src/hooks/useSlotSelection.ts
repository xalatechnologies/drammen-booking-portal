
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

  const handleBulkSlotSelection = (newSlots: SelectedTimeSlot[]) => {
    console.log('useSlotSelection: handleBulkSlotSelection called with:', newSlots);
    console.log('useSlotSelection: current selectedSlots before bulk add:', selectedSlots);
    
    setSelectedSlots(prev => {
      // Create a new array to avoid mutations
      const updatedSlots = [...prev];
      
      // Only add slots that aren't already in the selection
      newSlots.forEach(newSlot => {
        const alreadyExists = updatedSlots.some(existingSlot =>
          existingSlot.zoneId === newSlot.zoneId &&
          existingSlot.date.toISOString() === newSlot.date.toISOString() &&
          existingSlot.timeSlot === newSlot.timeSlot
        );
        
        if (!alreadyExists) {
          updatedSlots.push(newSlot);
        }
      });
      
      console.log('useSlotSelection: bulk selection result:', updatedSlots);
      return updatedSlots;
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
