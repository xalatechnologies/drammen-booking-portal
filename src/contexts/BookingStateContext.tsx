
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { useCart } from '@/contexts/CartContext';
import { BookingFormData, BookingValidationErrors, BookingState } from './booking/types';
import { bookingReducer, initialState } from './booking/reducer';
import { createActions } from './booking/actions';
import { createBusinessLogic } from './booking/businessLogic';
import { saveToStorage, loadFromStorage } from './booking/storage';

interface BookingContextType {
  state: BookingState;
  actions: {
    setSelectedSlots: (slots: SelectedTimeSlot[]) => void;
    addSelectedSlot: (slot: SelectedTimeSlot) => void;
    removeSelectedSlot: (zoneId: string, date: Date, timeSlot: string) => void;
    clearSelectedSlots: () => void;
    updateFormData: (data: Partial<BookingFormData>) => void;
    setCurrentStep: (step: 'selection' | 'booking' | 'cart') => void;
    setBookingInProgress: (inProgress: boolean) => void;
    addBookingError: (error: string) => void;
    clearBookingErrors: () => void;
    validateAndContinue: () => boolean;
    resetBookingState: () => void;
    saveToStorage: () => void;
    loadFromStorage: () => void;
    addToCartAndContinue: (facilityId: string, facilityName: string) => boolean;
  };
  businessLogic: {
    isFormValid: () => boolean;
    canProceedToNextStep: () => boolean;
    requiresApproval: () => boolean;
    calculateTotalPrice: () => number;
  };
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBookingState = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingState must be used within a BookingStateProvider');
  }
  return context;
};

interface BookingStateProviderProps {
  children: ReactNode;
}

export const BookingStateProvider: React.FC<BookingStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const { addToCart } = useCart();

  // Auto-save to localStorage when state changes
  useEffect(() => {
    if (state.isDirty) {
      const timer = setTimeout(() => {
        saveToStorage(state);
        dispatch({ type: 'MARK_SAVED' });
      }, 1000); // Debounce saves by 1 second

      return () => clearTimeout(timer);
    }
  }, [state.isDirty, state.formData, state.selectedSlots]);

  // Load from storage on mount
  useEffect(() => {
    const savedData = loadFromStorage();
    if (savedData) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: savedData });
    }
  }, []);

  const actions = createActions(dispatch, state, addToCart);
  const businessLogic = createBusinessLogic(state);

  return (
    <BookingContext.Provider value={{ state, actions, businessLogic }}>
      {children}
    </BookingContext.Provider>
  );
};

// Re-export types for backward compatibility
export type { BookingFormData, BookingValidationErrors, BookingState };
