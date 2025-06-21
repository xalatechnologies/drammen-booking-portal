
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
      console.log('useSlotSelection: slot not available, showing notification');
      addNotification({
        type: 'warning',
        title: 'Tidspunkt ikke tilgjengelig',
        message: 'Dette tidspunktet er ikke tilgjengelig for booking.'
      });
      return;
    }

    // Ensure date is a Date object
    const slotDate = date instanceof Date ? date : new Date(date);

    const isSelected = selectedSlots.some(slot => {
      const selectedDate = slot.date instanceof Date ? slot.date : new Date(slot.date);
      return slot.zoneId === zoneId &&
        selectedDate.toDateString() === slotDate.toDateString() &&
        slot.timeSlot === timeSlot;
    });

    console.log('useSlotSelection: isSelected:', isSelected);

    if (isSelected) {
      console.log('useSlotSelection: removing slot');
      removeSlot(zoneId, slotDate, timeSlot);
      addNotification({
        type: 'info',
        title: 'Tidspunkt fjernet',
        message: 'Tidspunktet ble fjernet fra utvalget.'
      });
    } else {
      console.log('useSlotSelection: adding slot');
      addSlot({
        zoneId,
        date: slotDate,
        timeSlot,
        duration: 1
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
    
    if (newSlots.length === 0) {
      console.log('useSlotSelection: no slots to add');
      return;
    }

    // Ensure all dates are Date objects
    const normalizedSlots = newSlots.map(slot => ({
      ...slot,
      date: slot.date instanceof Date ? slot.date : new Date(slot.date)
    }));

    bulkAddSlots(normalizedSlots);
    
    addNotification({
      type: 'success',
      title: 'Tidspunkt lagt til',
      message: `${normalizedSlots.length} tidspunkt ble lagt til utvalget.`
    });
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
