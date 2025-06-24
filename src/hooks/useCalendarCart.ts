
import { useCartStore } from '@/stores/useCartStore';
import { useUIStore } from '@/stores/useUIStore';

export const useCalendarCart = () => {
  const { items: cartItems, addItem } = useCartStore();
  const { addNotification } = useUIStore();

  const addSlotToCart = (slotData: any) => {
    const cartItem = {
      facilityId: slotData.facilityId,
      facilityName: slotData.facilityName,
      zoneId: slotData.zoneId,
      startTime: slotData.startTime,
      endTime: slotData.endTime,
      price: slotData.price || 450,
      duration: slotData.duration || 60,
      purpose: slotData.purpose || '',
      expectedAttendees: slotData.expectedAttendees || 1,
      actorType: slotData.actorType || 'private-person',
      eventType: slotData.eventType || 'other',
      ageGroup: slotData.ageGroup || 'mixed',
      contactName: slotData.contactName || '',
      contactEmail: slotData.contactEmail || '',
      contactPhone: slotData.contactPhone || '',
    };
    
    addItem(cartItem);
    addNotification({
      type: 'success',
      title: 'Added to cart',
      message: 'Slot added to cart successfully'
    });
  };

  const handleAddToCart = (bookingData: any, allZones: any[] = [], clearSelection: () => void = () => {}) => {
    addSlotToCart(bookingData);
    clearSelection();
  };

  return {
    cartItems,
    addSlotToCart,
    handleAddToCart
  };
};
