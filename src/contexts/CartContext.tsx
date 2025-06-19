
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, CartState, CartAction } from '@/types/cart';
import { CartSessionService } from '@/services/CartSessionService';

interface CartContextType extends CartState {
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateReservation: (itemId: string, updates: Partial<CartItem>) => void;
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
      const itemId = `${item.facilityId}-${item.purpose}-${Date.now()}`;
      
      // Initialize default values for new cart structure
      const newItem: CartItem = { 
        ...item, 
        id: itemId,
        expectedAttendees: item.expectedAttendees || 1,
        organizationType: item.organizationType || 'private',
        additionalServices: item.additionalServices || [],
        timeSlots: item.timeSlots || [{
          date: item.date,
          timeSlot: item.timeSlot,
          zoneId: item.zoneId,
          duration: item.duration
        }],
        pricing: item.pricing || {
          baseFacilityPrice: item.pricePerHour * (item.duration || 2),
          servicesPrice: 0,
          discounts: 0,
          vatAmount: 0,
          totalPrice: item.pricePerHour * (item.duration || 2)
        }
      };
      
      const newItems = [...state.items, newItem];
      const newState = {
        items: newItems,
        totalPrice: calculateTotalPrice(newItems),
        itemCount: newItems.length
      };
      
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
      
      CartSessionService.saveCartToSession(newItems);
      return newState;
    }

    case 'UPDATE_RESERVATION': {
      const newItems = state.items.map(item => 
        item.id === action.payload.itemId 
          ? { ...item, ...action.payload.updates }
          : item
      );
      const newState = {
        items: newItems,
        totalPrice: calculateTotalPrice(newItems),
        itemCount: newItems.length
      };
      
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
    // Use pricing object if available, otherwise calculate from legacy fields
    if (item.pricing) {
      return total + item.pricing.totalPrice;
    }
    
    const duration = item.duration || 2;
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

  const updateReservation = (itemId: string, updates: Partial<CartItem>) => {
    dispatch({ type: 'UPDATE_RESERVATION', payload: { itemId, updates } });
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
      updateReservation,
      clearCart,
      getTotalPrice,
      getItemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};
