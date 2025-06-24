
import { Dispatch } from 'react';
import { BookingAction, BookingFormData } from './types';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { validateFormData, isFormValid } from './validation';
import { saveToStorage, loadFromStorage } from './storage';
import { useCart } from '@/contexts/CartContext';

export const createActions = (
  dispatch: Dispatch<BookingAction>,
  state: any,
  addToCart: ReturnType<typeof useCart>['addToCart']
) => ({
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
    state.selectedSlots.forEach((slot: SelectedTimeSlot) => {
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

  saveToStorage: () => saveToStorage(state),
  
  loadFromStorage: () => {
    const data = loadFromStorage();
    if (data) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: data });
    }
  },
});
