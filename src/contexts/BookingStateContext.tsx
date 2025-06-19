
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';

export interface BookingFormData {
  customerType: 'private' | 'business' | 'organization';
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organization: string;
  purpose?: string;
  eventType?: string;
  attendees?: number;
}

export interface BookingState {
  selectedSlots: SelectedTimeSlot[];
  formData: BookingFormData;
  currentStep: 'selection' | 'booking' | 'cart';
  isBookingInProgress: boolean;
  bookingErrors: string[];
}

type BookingAction =
  | { type: 'SET_SELECTED_SLOTS'; payload: SelectedTimeSlot[] }
  | { type: 'ADD_SELECTED_SLOT'; payload: SelectedTimeSlot }
  | { type: 'REMOVE_SELECTED_SLOT'; payload: { zoneId: string; date: Date; timeSlot: string } }
  | { type: 'CLEAR_SELECTED_SLOTS' }
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<BookingFormData> }
  | { type: 'SET_CURRENT_STEP'; payload: 'selection' | 'booking' | 'cart' }
  | { type: 'SET_BOOKING_IN_PROGRESS'; payload: boolean }
  | { type: 'ADD_BOOKING_ERROR'; payload: string }
  | { type: 'CLEAR_BOOKING_ERRORS' }
  | { type: 'RESET_BOOKING_STATE' };

const initialState: BookingState = {
  selectedSlots: [],
  formData: {
    customerType: 'private',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    organization: '',
  },
  currentStep: 'selection',
  isBookingInProgress: false,
  bookingErrors: [],
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_SELECTED_SLOTS':
      return { ...state, selectedSlots: action.payload };
    
    case 'ADD_SELECTED_SLOT':
      const exists = state.selectedSlots.some(slot => 
        slot.zoneId === action.payload.zoneId &&
        slot.date.toDateString() === action.payload.date.toDateString() &&
        slot.timeSlot === action.payload.timeSlot
      );
      if (exists) return state;
      return { ...state, selectedSlots: [...state.selectedSlots, action.payload] };
    
    case 'REMOVE_SELECTED_SLOT':
      return {
        ...state,
        selectedSlots: state.selectedSlots.filter(slot =>
          !(slot.zoneId === action.payload.zoneId &&
            slot.date.toDateString() === action.payload.date.toDateString() &&
            slot.timeSlot === action.payload.timeSlot)
        )
      };
    
    case 'CLEAR_SELECTED_SLOTS':
      return { ...state, selectedSlots: [] };
    
    case 'UPDATE_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'SET_BOOKING_IN_PROGRESS':
      return { ...state, isBookingInProgress: action.payload };
    
    case 'ADD_BOOKING_ERROR':
      return { ...state, bookingErrors: [...state.bookingErrors, action.payload] };
    
    case 'CLEAR_BOOKING_ERRORS':
      return { ...state, bookingErrors: [] };
    
    case 'RESET_BOOKING_STATE':
      return initialState;
    
    default:
      return state;
  }
}

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
    resetBookingState: () => void;
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

  const actions = {
    setSelectedSlots: (slots: SelectedTimeSlot[]) => 
      dispatch({ type: 'SET_SELECTED_SLOTS', payload: slots }),
    
    addSelectedSlot: (slot: SelectedTimeSlot) => 
      dispatch({ type: 'ADD_SELECTED_SLOT', payload: slot }),
    
    removeSelectedSlot: (zoneId: string, date: Date, timeSlot: string) => 
      dispatch({ type: 'REMOVE_SELECTED_SLOT', payload: { zoneId, date, timeSlot } }),
    
    clearSelectedSlots: () => 
      dispatch({ type: 'CLEAR_SELECTED_SLOTS' }),
    
    updateFormData: (data: Partial<BookingFormData>) => 
      dispatch({ type: 'UPDATE_FORM_DATA', payload: data }),
    
    setCurrentStep: (step: 'selection' | 'booking' | 'cart') => 
      dispatch({ type: 'SET_CURRENT_STEP', payload: step }),
    
    setBookingInProgress: (inProgress: boolean) => 
      dispatch({ type: 'SET_BOOKING_IN_PROGRESS', payload: inProgress }),
    
    addBookingError: (error: string) => 
      dispatch({ type: 'ADD_BOOKING_ERROR', payload: error }),
    
    clearBookingErrors: () => 
      dispatch({ type: 'CLEAR_BOOKING_ERRORS' }),
    
    resetBookingState: () => 
      dispatch({ type: 'RESET_BOOKING_STATE' }),
  };

  return (
    <BookingContext.Provider value={{ state, actions }}>
      {children}
    </BookingContext.Provider>
  );
};
