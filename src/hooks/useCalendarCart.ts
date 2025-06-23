
import { useCallback } from 'react';
import { useCartStore } from '@/stores/useCartStore';

export const useCalendarCart = () => {
  const { items, addToCart, removeFromCart } = useCartStore();

  const addSlotToCart = useCallback((slotData: any) => {
    const cartItem = {
      facilityId: slotData.facilityId.toString(),
      facilityName: slotData.facilityName,
      zoneName: slotData.zoneName,
      startTime: slotData.startTime,
      endTime: slotData.endTime,
      price: slotData.price || 450,
      duration: slotData.duration || 60,
      purpose: 'Event booking',
      expectedAttendees: 1,
      organizationType: 'private-person',
      additionalServices: [],
      actorType: 'private-person',
      eventType: 'other',
      ageGroup: 'mixed',
      contactName: '',
      contactEmail: '',
      contactPhone: ''
    };

    addToCart(cartItem);
  }, [addToCart]);

  const removeSlotFromCart = useCallback((slotId: string) => {
    removeFromCart(slotId);
  }, [removeFromCart]);

  const isSlotInCart = useCallback((slotId: string) => {
    return items.some(item => item.id === slotId);
  }, [items]);

  return {
    cartItems: items,
    addSlotToCart,
    removeSlotFromCart,
    isSlotInCart
  };
};
