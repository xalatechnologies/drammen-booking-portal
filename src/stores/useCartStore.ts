
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
    // Calculate based on number of time slots (each slot = 1 hour typically)
    const numberOfSlots = item.timeSlots.length;
    return total + (item.pricePerHour * numberOfSlots);
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
        
        // Check if there's an existing reservation package for the same facility and purpose
        const existingItems = get().items;
        const existingPackage = existingItems.find(existing => 
          existing.facilityId === item.facilityId && 
          existing.purpose === item.purpose &&
          existing.organizationType === item.organizationType
        );

        if (existingPackage) {
          // Add the new time slot to the existing package
          const newTimeSlot = {
            date: item.date,
            timeSlot: item.timeSlot,
            zoneId: item.zoneId,
            duration: item.duration || 1 // Default to 1 hour per slot
          };

          // Check if this exact time slot already exists
          const slotExists = existingPackage.timeSlots.some(slot => 
            slot.date.getTime() === newTimeSlot.date.getTime() &&
            slot.timeSlot === newTimeSlot.timeSlot &&
            slot.zoneId === newTimeSlot.zoneId
          );

          if (!slotExists) {
            const updatedTimeSlots = [...existingPackage.timeSlots, newTimeSlot];
            const numberOfSlots = updatedTimeSlots.length;
            
            const updatedPackage = {
              ...existingPackage,
              timeSlots: updatedTimeSlots,
              pricing: {
                ...existingPackage.pricing,
                baseFacilityPrice: item.pricePerHour * numberOfSlots,
                totalPrice: item.pricePerHour * numberOfSlots
              }
            };

            const newItems = existingItems.map(existing => 
              existing.id === existingPackage.id ? updatedPackage : existing
            );

            set({
              items: newItems,
              totalPrice: calculateTotalPrice(newItems),
              itemCount: newItems.length
            });
          }
        } else {
          // Create a new reservation package
          const packageId = `${item.facilityId}-${item.purpose.replace(/\s+/g, '-')}-${Date.now()}`;
          const slotDuration = item.duration || 1; // Default to 1 hour per slot
          
          const newPackage: CartItem = { 
            ...item, 
            id: packageId,
            expectedAttendees: item.expectedAttendees || 1,
            organizationType: item.organizationType || 'private',
            additionalServices: item.additionalServices || [],
            timeSlots: [{
              date: item.date,
              timeSlot: item.timeSlot,
              zoneId: item.zoneId,
              duration: slotDuration
            }],
            pricing: item.pricing || {
              baseFacilityPrice: item.pricePerHour * slotDuration,
              servicesPrice: 0,
              discounts: 0,
              vatAmount: 0,
              totalPrice: item.pricePerHour * slotDuration
            }
          };
          
          const newItems = [...existingItems, newPackage];
          console.log('CartStore: Created new reservation package:', newPackage);
          
          set({
            items: newItems,
            totalPrice: calculateTotalPrice(newItems),
            itemCount: newItems.length
          });
        }
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
