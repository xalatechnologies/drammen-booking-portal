
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  facilityId: string;
  facilityName: string;
  zoneId?: string;
  startTime: Date;
  endTime: Date;
  price: number;
  duration: number;
  purpose: string;
  expectedAttendees: number;
  actorType: string;
  eventType: string;
  ageGroup: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const id = `${item.facilityId}-${item.startTime.getTime()}`;
        const newItem = { ...item, id };
        
        set((state) => ({
          items: [...state.items, newItem]
        }));
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== itemId)
        }));
      },

      clearCart: () => {
        set({ items: [] });
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
