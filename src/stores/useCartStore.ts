
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/cart';

interface CartState {
  // State
  items: CartItem[];
  totalPrice: number;
  itemCount: number;
  
  // Actions
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const calculateTotalPrice = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    if (item.pricing) {
      return total + item.pricing.totalPrice;
    }
    const duration = item.duration || 2;
    return total + (item.pricePerHour * duration);
  }, 0);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      totalPrice: 0,
      itemCount: 0,

      // Actions
      addToCart: (item) => {
        console.log('CartStore: Adding item to cart:', item);
        const itemId = `${item.facilityId}-${item.purpose}-${Date.now()}`;
        
        const newItem: CartItem = { 
          ...item, 
          id: itemId,
          expectedAttendees: item.expectedAttendees || 1,
          organizationType: item.organizationType || 'private',
          additionalServices: item.additionalServices || [],
          timeSlots: item.timeSlots || [{
            date: item.date,
            timeSlot: item.timeSlot,
            zoneId: item.zoneId,
            duration: item.duration
          }],
          pricing: item.pricing || {
            baseFacilityPrice: item.pricePerHour * (item.duration || 2),
            servicesPrice: 0,
            discounts: 0,
            vatAmount: 0,
            totalPrice: item.pricePerHour * (item.duration || 2)
          }
        };
        
        const newItems = [...get().items, newItem];
        console.log('CartStore: New items array:', newItems);
        
        set({
          items: newItems,
          totalPrice: calculateTotalPrice(newItems),
          itemCount: newItems.length
        });
      },

      removeFromCart: (itemId) => {
        console.log('CartStore: Removing item from cart:', itemId);
        const newItems = get().items.filter(item => item.id !== itemId);
        set({
          items: newItems,
          totalPrice: calculateTotalPrice(newItems),
          itemCount: newItems.length
        });
      },

      updateItem: (itemId, updates) => {
        console.log('CartStore: Updating item:', itemId, updates);
        const newItems = get().items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        );
        set({
          items: newItems,
          totalPrice: calculateTotalPrice(newItems),
          itemCount: newItems.length
        });
      },

      clearCart: () => {
        console.log('CartStore: Clearing cart');
        set({
          items: [],
          totalPrice: 0,
          itemCount: 0
        });
      },

      getTotalPrice: () => get().totalPrice,
      getItemCount: () => get().itemCount
    }),
    {
      name: 'cart-storage',
    }
  )
);
