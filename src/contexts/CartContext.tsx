
import React, { createContext, useContext } from 'react';
import { useCartStore, CartItem } from '@/stores/useCartStore';
import { useUIStore } from '@/stores/useUIStore';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
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
    addItem,
    removeItem,
    clearCart: storeClearCart,
    getTotalPrice,
    getItemCount
  } = useCartStore();

  const { addNotification } = useUIStore();

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    addItem(item);
    addNotification({
      type: 'success',
      title: 'Lagt til i handlekurv',
      message: `${item.facilityName} ble lagt til i handlekurven`
    });
  };

  const removeFromCart = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    removeItem(itemId);
    if (item) {
      addNotification({
        type: 'info',
        title: 'Fjernet fra handlekurv',
        message: `${item.facilityName} ble fjernet fra handlekurven`
      });
    }
  };

  const clearCart = () => {
    const count = items.length;
    storeClearCart();
    if (count > 0) {
      addNotification({
        type: 'info',
        title: 'Handlekurv tømt',
        message: `${count} elementer ble fjernet fra handlekurven`
      });
    }
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};
