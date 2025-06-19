
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, CartState, CartAction } from '@/types/cart';
import { CartSessionService } from '@/services/CartSessionService';

interface CartContextType extends CartState {
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart reducer function
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const item = action.payload;
      const itemId = `${item.facilityId}-${item.zoneId}-${item.date.toISOString()}-${item.timeSlot}`;
      
      // Check if item already exists
      const existingItem = state.items.find(cartItem => cartItem.id === itemId);
      if (existingItem) {
        return state; // Don't add duplicates
      }

      const newItem: CartItem = { ...item, id: itemId };
      const newItems = [...state.items, newItem];
      const newState = {
        items: newItems,
        totalPrice: calculateTotalPrice(newItems),
        itemCount: newItems.length
      };
      
      // Save to session
      CartSessionService.saveCartToSession(newItems);
      return newState;
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const newState = {
        items: newItems,
        totalPrice: calculateTotalPrice(newItems),
        itemCount: newItems.length
      };
      
      // Save to session
      CartSessionService.saveCartToSession(newItems);
      return newState;
    }

    case 'CLEAR_CART': {
      CartSessionService.clearCartSession();
      return {
        items: [],
        totalPrice: 0,
        itemCount: 0
      };
    }

    case 'LOAD_FROM_SESSION': {
      const items = action.payload;
      return {
        items,
        totalPrice: calculateTotalPrice(items),
        itemCount: items.length
      };
    }

    default:
      return state;
  }
}

// Helper function to calculate total price
function calculateTotalPrice(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const duration = item.duration || 2; // Default to 2 hours if not specified
    return total + (item.pricePerHour * duration);
  }, 0);
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalPrice: 0,
    itemCount: 0
  });

  // Load cart from session on mount
  useEffect(() => {
    const savedItems = CartSessionService.loadCartFromSession();
    if (savedItems.length > 0) {
      dispatch({ type: 'LOAD_FROM_SESSION', payload: savedItems });
    }
  }, []);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalPrice = () => state.totalPrice;
  
  const getItemCount = () => state.itemCount;

  return (
    <CartContext.Provider value={{
      ...state,
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
