
import React, { createContext, useContext, useEffect } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useUIStore } from '@/stores/useUIStore';
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
    addToCart: storeAddToCart,
    removeFromCart: storeRemoveFromCart,
    updateItem,
    clearCart: storeClearCart,
    getTotalPrice,
    getItemCount
  } = useCartStore();

  const { addNotification } = useUIStore();

  // Enhanced actions with notifications
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    storeAddToCart(item);
    addNotification({
      type: 'success',
      title: 'Lagt til i handlekurv',
      message: `${item.facilityName} ble lagt til i handlekurven`
    });
  };

  const removeFromCart = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    storeRemoveFromCart(itemId);
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
