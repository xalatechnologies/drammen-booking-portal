
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  facilityId: string;
  facilityName: string;
  zoneId: string;
  startTime: string;
  endTime: string;
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

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => ({
        items: [...state.items, { ...item, id: item.id || crypto.randomUUID() }]
      })),
      
      removeItem: (itemId) => set((state) => ({
        items: state.items.filter((item) => item.id !== itemId)
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price, 0);
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.length;
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
