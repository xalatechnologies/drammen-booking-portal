
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  facilityId: string;
  facilityName: string;
  startDate: string;
  endDate: string;
  duration: number;
  price: number;
  selectedSlots: any[];
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => ({
          items: [...state.items, { ...item, id: Date.now().toString() }]
        }));
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price, 0);
      },
      
      getItemCount: () => {
        return get().items.length;
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);
