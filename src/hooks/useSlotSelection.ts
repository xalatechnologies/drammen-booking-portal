
import { useState } from 'react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { isSlotSelected, addSlotToSelection, removeSlotFromSelection } from '@/components/facility/tabs/AvailabilityTabUtils';

export function useSlotSelection() {
  const [selectedSlots, setSelectedSlots] = useState<SelectedTimeSlot[]>([]);

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    if (availability !== 'available') return;

    const isSelected = isSlotSelected(selectedSlots, zoneId, date, timeSlot);

    if (isSelected) {
      setSelectedSlots(prev => removeSlotFromSelection(prev, zoneId, date, timeSlot));
    } else {
      // Only add to local selection, not to cart yet
      setSelectedSlots(prev => addSlotToSelection(prev, zoneId, date, timeSlot));
    }
  };

  const clearSelection = () => {
    setSelectedSlots([]);
  };

  return {
    selectedSlots,
    setSelectedSlots,
    handleSlotClick,
    clearSelection
  };
}
