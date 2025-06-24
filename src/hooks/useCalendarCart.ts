
import { useCartStore } from '@/stores/useCartStore';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from '@/components/booking/types';

export function useCalendarCart() {
  const { addToCart } = useCartStore();

  const handleAddToCart = (
    bookingData: any, 
    allZones: any[], 
    clearSelection: () => void
  ) => {
    console.log('CalendarView: Adding to cart:', bookingData);
    
    // Convert booking data to cart format
    if (bookingData.selectedSlots && bookingData.selectedSlots.length > 0) {
      const slot = bookingData.selectedSlots[0]; // Take first slot for cart item
      const zone = allZones.find(z => z.id === slot.zoneId);
      const totalPrice = (zone?.pricePerHour || 450) * (slot.duration || 1);
      
      addToCart({
        facilityId: bookingData.facilityId || 'all',
        facilityName: bookingData.facilityName || 'Alle lokaler',
        date: slot.date,
        timeSlot: slot.timeSlot,
        zoneId: slot.zoneId,
        duration: slot.duration || 1,
        pricePerHour: zone?.pricePerHour || 450,
        purpose: bookingData.formData?.purpose || 'Booking fra kalender',
        expectedAttendees: bookingData.formData?.attendees || 1,
        organizationType: bookingData.formData?.actorType || 'private',
        eventType: bookingData.formData?.activityType || 'other',
        specialRequirements: bookingData.formData?.additionalInfo || '',
        timeSlots: bookingData.selectedSlots,
        additionalServices: [],
        pricing: {
          baseFacilityPrice: totalPrice,
          servicesPrice: 0,
          discounts: 0,
          vatAmount: 0,
          totalPrice: totalPrice
        }
      });
      
      // Clear selection after adding to cart
      clearSelection();
    }
  };

  return { handleAddToCart };
}
