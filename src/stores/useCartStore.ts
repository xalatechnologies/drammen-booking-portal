
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  facilityId: string;
  facilityName: string;
  zoneName?: string;
  startTime: Date;
  endTime: Date;
  price: number;
  duration: number;
  purpose: string;
  expectedAttendees: number;
  organizationType: string;
  additionalServices: any[];
  actorType: string;
  eventType: string;
  ageGroup: string;
  specialRequirements?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

interface CartStore {
  items: CartItem[];
  totalPrice: number;
  itemCount: number;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,
      itemCount: 0,

      addToCart: (item) => {
        const id = `${item.facilityId}-${item.startTime.getTime()}`;
        const newItem = { ...item, id };
        
        set((state) => {
          const newItems = [...state.items, newItem];
          const totalPrice = newItems.reduce((sum, item) => sum + item.price, 0);
          return {
            items: newItems,
            totalPrice,
            itemCount: newItems.length
          };
        });
      },

      removeFromCart: (itemId) => {
        set((state) => {
          const newItems = state.items.filter(item => item.id !== itemId);
          const totalPrice = newItems.reduce((sum, item) => sum + item.price, 0);
          return {
            items: newItems,
            totalPrice,
            itemCount: newItems.length
          };
        });
      },

      updateItem: (itemId, updates) => {
        set((state) => {
          const newItems = state.items.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
          );
          const totalPrice = newItems.reduce((sum, item) => sum + item.price, 0);
          return {
            items: newItems,
            totalPrice,
            itemCount: newItems.length
          };
        });
      },

      clearCart: () => {
        set({ items: [], totalPrice: 0, itemCount: 0 });
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price, 0);
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
