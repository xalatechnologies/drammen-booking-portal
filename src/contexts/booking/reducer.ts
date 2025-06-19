
import { BookingState, BookingAction } from './types';
import { validateFormData } from './validation';

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

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
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

export { initialState };
