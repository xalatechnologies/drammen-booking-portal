
import React, { createContext, useContext } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { CartItem } from '@/types/cart';

interface CartContextType {
  items: CartItem[];
  totalPrice: number;
  itemCount: number;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateReservation: (itemId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    items,
    totalPrice,
    itemCount,
    addToCart,
    removeFromCart,
    updateItem,
    clearCart,
    getTotalPrice,
    getItemCount
  } = useCartStore();

  console.log('CartContext: Current cart state:', { items, totalPrice, itemCount });

  return (
    <CartContext.Provider value={{
      items,
      totalPrice,
      itemCount,
      addToCart,
      removeFromCart,
      updateReservation: updateItem,
      clearCart,
      getTotalPrice,
      getItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};
