
import { useBookingStore } from '@/stores/useBookingStore';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';

export function useSlotSelection() {
  const {
    selectedSlots,
    addSlot,
    removeSlot,
    clearSlots,
    bulkAddSlots,
    setSelectedSlots
  } = useBookingStore();

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    console.log('useSlotSelection: handleSlotClick called with:', { zoneId, date, timeSlot, availability });
    
    if (availability !== 'available') return;

    const isSelected = selectedSlots.some(slot => 
      slot.zoneId === zoneId &&
      slot.date.toDateString() === date.toDateString() &&
      slot.timeSlot === timeSlot
    );

    console.log('useSlotSelection: isSelected:', isSelected);

    if (isSelected) {
      console.log('useSlotSelection: removing slot');
      removeSlot(zoneId, date, timeSlot);
    } else {
      console.log('useSlotSelection: adding slot');
      addSlot({
        zoneId,
        date,
        timeSlot,
        duration: 2
      });
    }
  };

  const handleBulkSlotSelection = (newSlots: SelectedTimeSlot[]) => {
    console.log('useSlotSelection: handleBulkSlotSelection called with:', newSlots);
    bulkAddSlots(newSlots);
  };

  const clearSelection = () => {
    console.log('useSlotSelection: clearing all selections');
    clearSlots();
  };

  return {
    selectedSlots,
    setSelectedSlots,
    handleSlotClick,
    handleBulkSlotSelection,
    clearSelection
  };
}
