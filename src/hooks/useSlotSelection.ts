
import { useBookingStore } from '@/stores/useBookingStore';
import { useUIStore } from '@/stores/useUIStore';
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

  const { addNotification } = useUIStore();

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    console.log('useSlotSelection: handleSlotClick called with:', { zoneId, date, timeSlot, availability });
    
    if (availability !== 'available') {
      addNotification({
        type: 'warning',
        title: 'Tidspunkt ikke tilgjengelig',
        message: 'Dette tidspunktet er ikke tilgjengelig for booking.'
      });
      return;
    }

    const isSelected = selectedSlots.some(slot => 
      slot.zoneId === zoneId &&
      slot.date.toDateString() === date.toDateString() &&
      slot.timeSlot === timeSlot
    );

    console.log('useSlotSelection: isSelected:', isSelected);

    if (isSelected) {
      console.log('useSlotSelection: removing slot');
      removeSlot(zoneId, date, timeSlot);
      addNotification({
        type: 'info',
        title: 'Tidspunkt fjernet',
        message: 'Tidspunktet ble fjernet fra utvalget.'
      });
    } else {
      console.log('useSlotSelection: adding slot');
      addSlot({
        zoneId,
        date,
        timeSlot,
        duration: 2
      });
      addNotification({
        type: 'success',
        title: 'Tidspunkt lagt til',
        message: 'Tidspunktet ble lagt til utvalget.'
      });
    }
  };

  const handleBulkSlotSelection = (newSlots: SelectedTimeSlot[]) => {
    console.log('useSlotSelection: handleBulkSlotSelection called with:', newSlots);
    bulkAddSlots(newSlots);
    
    if (newSlots.length > 0) {
      addNotification({
        type: 'success',
        title: 'Tidspunkt lagt til',
        message: `${newSlots.length} tidspunkt ble lagt til utvalget.`
      });
    }
  };

  const clearSelection = () => {
    console.log('useSlotSelection: clearing all selections');
    const count = selectedSlots.length;
    clearSlots();
    
    if (count > 0) {
      addNotification({
        type: 'info',
        title: 'Utvalg tømt',
        message: `${count} tidspunkt ble fjernet fra utvalget.`
      });
    }
  };

  return {
    selectedSlots,
    setSelectedSlots,
    handleSlotClick,
    handleBulkSlotSelection,
    clearSelection
  };
}
