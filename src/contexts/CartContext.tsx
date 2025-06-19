
import React, { createContext, useContext, useState, useEffect } from 'react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';

interface CartItem extends SelectedTimeSlot {
  id: string;
  facilityId: string;
  facilityName: string;
  pricePerHour: number;
}

interface CartContextType {
  cartItems: CartItem[];
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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('facilityCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Convert date strings back to Date objects
        const restoredCart = parsedCart.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        }));
        setCartItems(restoredCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('facilityCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const itemId = `${item.facilityId}-${item.zoneId}-${item.date.toISOString()}-${item.timeSlot}`;
    const existingItem = cartItems.find(cartItem => cartItem.id === itemId);

    if (!existingItem) {
      setCartItems(prev => [...prev, { ...item, id: itemId }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const duration = item.duration || 2; // Default to 2 hours if not specified
      return total + (item.pricePerHour * duration);
    }, 0);
  };

  const getItemCount = () => {
    return cartItems.length;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
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
