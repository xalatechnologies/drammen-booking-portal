
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { useCart } from '@/contexts/CartContext';
import { BookingSessionService } from '@/services/BookingSessionService';

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

export interface BookingValidationErrors {
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  purpose?: string;
  attendees?: string;
  general?: string[];
}

export interface BookingState {
  selectedSlots: SelectedTimeSlot[];
  formData: BookingFormData;
  currentStep: 'selection' | 'booking' | 'cart';
  isBookingInProgress: boolean;
  bookingErrors: string[];
  validationErrors: BookingValidationErrors;
  lastSavedAt?: Date;
  isDirty: boolean;
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
  | { type: 'SET_VALIDATION_ERRORS'; payload: BookingValidationErrors }
  | { type: 'CLEAR_VALIDATION_ERRORS' }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<BookingState> }
  | { type: 'MARK_SAVED' }
  | { type: 'MARK_DIRTY' }
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
  validationErrors: {},
  isDirty: false,
};

// Business logic functions
const validateFormData = (formData: BookingFormData): BookingValidationErrors => {
  const errors: BookingValidationErrors = {};

  if (!formData.contactName || formData.contactName.trim().length < 2) {
    errors.contactName = 'Navn må være minst 2 tegn';
  }

  if (!formData.contactEmail || !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
    errors.contactEmail = 'Ugyldig e-postadresse';
  }

  if (!formData.contactPhone || formData.contactPhone.replace(/\D/g, '').length < 8) {
    errors.contactPhone = 'Telefonnummer må være minst 8 siffer';
  }

  if (formData.purpose && formData.purpose.trim().length < 3) {
    errors.purpose = 'Formål må være minst 3 tegn';
  }

  if (formData.attendees && (formData.attendees < 1 || formData.attendees > 1000)) {
    errors.attendees = 'Antall deltakere må være mellom 1 og 1000';
  }

  return errors;
};

const isFormValid = (formData: BookingFormData, selectedSlots: SelectedTimeSlot[]): boolean => {
  const errors = validateFormData(formData);
  return Object.keys(errors).length === 0 && selectedSlots.length > 0;
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_SELECTED_SLOTS':
      return { 
        ...state, 
        selectedSlots: action.payload,
        isDirty: true,
        validationErrors: { ...state.validationErrors, general: undefined }
      };
    
    case 'ADD_SELECTED_SLOT':
      const exists = state.selectedSlots.some(slot => 
        slot.zoneId === action.payload.zoneId &&
        slot.date.toDateString() === action.payload.date.toDateString() &&
        slot.timeSlot === action.payload.timeSlot
      );
      if (exists) return state;
      return { 
        ...state, 
        selectedSlots: [...state.selectedSlots, action.payload],
        isDirty: true
      };
    
    case 'REMOVE_SELECTED_SLOT':
      return {
        ...state,
        selectedSlots: state.selectedSlots.filter(slot =>
          !(slot.zoneId === action.payload.zoneId &&
            slot.date.toDateString() === action.payload.date.toDateString() &&
            slot.timeSlot === action.payload.timeSlot)
        ),
        isDirty: true
      };
    
    case 'CLEAR_SELECTED_SLOTS':
      return { ...state, selectedSlots: [], isDirty: true };
    
    case 'UPDATE_FORM_DATA':
      const updatedFormData = { ...state.formData, ...action.payload };
      const validationErrors = validateFormData(updatedFormData);
      return { 
        ...state, 
        formData: updatedFormData,
        validationErrors,
        isDirty: true
      };
    
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'SET_BOOKING_IN_PROGRESS':
      return { ...state, isBookingInProgress: action.payload };
    
    case 'ADD_BOOKING_ERROR':
      return { ...state, bookingErrors: [...state.bookingErrors, action.payload] };
    
    case 'CLEAR_BOOKING_ERRORS':
      return { ...state, bookingErrors: [] };

    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.payload };

    case 'CLEAR_VALIDATION_ERRORS':
      return { ...state, validationErrors: {} };

    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload, isDirty: false };

    case 'MARK_SAVED':
      return { ...state, isDirty: false, lastSavedAt: new Date() };

    case 'MARK_DIRTY':
      return { ...state, isDirty: true };
    
    case 'RESET_BOOKING_STATE':
      return { ...initialState, isDirty: false };
    
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
        saveToStorage();
      }, 1000); // Debounce saves by 1 second

      return () => clearTimeout(timer);
    }
  }, [state.isDirty, state.formData, state.selectedSlots]);

  // Load from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, []);

  const saveToStorage = () => {
    try {
      const dataToSave = {
        formData: state.formData,
        selectedSlots: state.selectedSlots.map(slot => ({
          ...slot,
          date: slot.date.toISOString() // Serialize dates
        })),
        currentStep: state.currentStep
      };
      localStorage.setItem('bookingState', JSON.stringify(dataToSave));
      BookingSessionService.saveSessionData({
        customerType: state.formData.customerType,
        contactName: state.formData.contactName,
        contactEmail: state.formData.contactEmail,
        contactPhone: state.formData.contactPhone,
        organization: state.formData.organization
      });
      dispatch({ type: 'MARK_SAVED' });
    } catch (error) {
      console.warn('Failed to save booking state:', error);
    }
  };

  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem('bookingState');
      const sessionData = BookingSessionService.getSessionData();
      
      if (saved) {
        const parsed = JSON.parse(saved);
        const restoredState = {
          ...parsed,
          selectedSlots: parsed.selectedSlots?.map((slot: any) => ({
            ...slot,
            date: new Date(slot.date) // Deserialize dates
          })) || []
        };
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: restoredState });
      } else if (sessionData) {
        // Load only contact info from session
        dispatch({ type: 'UPDATE_FORM_DATA', payload: {
          customerType: sessionData.customerType as any,
          contactName: sessionData.contactName,
          contactEmail: sessionData.contactEmail,
          contactPhone: sessionData.contactPhone,
          organization: sessionData.organization
        }});
      }
    } catch (error) {
      console.warn('Failed to load booking state:', error);
    }
  };

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

    validateAndContinue: (): boolean => {
      const errors = validateFormData(state.formData);
      if (Object.keys(errors).length > 0) {
        dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors });
        return false;
      }
      if (state.selectedSlots.length === 0) {
        dispatch({ type: 'ADD_BOOKING_ERROR', payload: 'Velg minst ett tidspunkt' });
        return false;
      }
      dispatch({ type: 'CLEAR_VALIDATION_ERRORS' });
      dispatch({ type: 'CLEAR_BOOKING_ERRORS' });
      return true;
    },

    addToCartAndContinue: (facilityId: string, facilityName: string): boolean => {
      if (!isFormValid(state.formData, state.selectedSlots)) {
        const errors = validateFormData(state.formData);
        dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors });
        if (state.selectedSlots.length === 0) {
          dispatch({ type: 'ADD_BOOKING_ERROR', payload: 'Velg minst ett tidspunkt' });
        }
        return false;
      }

      // Add slots to cart with complete cart item structure
      state.selectedSlots.forEach(slot => {
        const pricePerHour = 225; // Default price, should come from facility data
        const duration = slot.duration || 2;
        
        addToCart({
          facilityId,
          facilityName,
          zoneId: slot.zoneId,
          date: slot.date,
          timeSlot: slot.timeSlot,
          duration,
          pricePerHour,
          // Required new fields
          purpose: state.formData.purpose || 'Generell booking',
          expectedAttendees: state.formData.attendees || 1,
          organizationType: state.formData.customerType,
          additionalServices: [],
          timeSlots: [slot],
          customerInfo: {
            name: state.formData.contactName,
            email: state.formData.contactEmail,
            phone: state.formData.contactPhone,
            organization: state.formData.organization
          },
          pricing: {
            baseFacilityPrice: pricePerHour * duration,
            servicesPrice: 0,
            discounts: 0,
            vatAmount: 0,
            totalPrice: pricePerHour * duration
          }
        });
      });

      // Clear current booking and move to cart
      dispatch({ type: 'CLEAR_SELECTED_SLOTS' });
      dispatch({ type: 'SET_CURRENT_STEP', payload: 'cart' });
      
      return true;
    },
    
    resetBookingState: () => 
      dispatch({ type: 'RESET_BOOKING_STATE' }),

    saveToStorage,
    loadFromStorage,
  };

  const businessLogic = {
    isFormValid: (): boolean => isFormValid(state.formData, state.selectedSlots),
    
    canProceedToNextStep: (): boolean => {
      switch (state.currentStep) {
        case 'selection':
          return state.selectedSlots.length > 0;
        case 'booking':
          return isFormValid(state.formData, state.selectedSlots);
        case 'cart':
          return true;
        default:
          return false;
      }
    },
    
    requiresApproval: (): boolean => {
      return ['business', 'organization'].includes(state.formData.customerType);
    },
    
    calculateTotalPrice: (): number => {
      return state.selectedSlots.reduce((total, slot) => {
        const basePrice = 225; // Default price per hour
        const duration = 2; // Assuming 2-hour slots
        let price = basePrice * duration;
        
        // Apply customer type discounts
        switch (state.formData.customerType) {
          case 'organization':
            price *= 0.8; // 20% discount
            break;
          case 'business':
            price *= 0.9; // 10% discount
            break;
        }
        
        return total + price;
      }, 0);
    }
  };

  return (
    <BookingContext.Provider value={{ state, actions, businessLogic }}>
      {children}
    </BookingContext.Provider>
  );
};
