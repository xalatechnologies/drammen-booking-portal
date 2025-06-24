
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

export type BookingAction =
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
