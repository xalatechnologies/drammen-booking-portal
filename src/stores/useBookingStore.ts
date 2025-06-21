
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType } from '@/types/pricing';

interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: ActorType;
  termsAccepted: boolean;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organization?: string;
}

interface BookingState {
  // State
  selectedSlots: SelectedTimeSlot[];
  formData: BookingFormData;
  currentStep: 'selection' | 'activity' | 'pricing' | 'details';
  isSubmitting: boolean;
  errors: string[];
  
  // Facility context
  currentFacilityId: string;
  currentFacilityName: string;
  
  // Actions
  setSelectedSlots: (slots: SelectedTimeSlot[]) => void;
  addSlot: (slot: SelectedTimeSlot) => void;
  removeSlot: (zoneId: string, date: Date, timeSlot: string) => void;
  clearSlots: () => void;
  bulkAddSlots: (slots: SelectedTimeSlot[]) => void;
  
  updateFormData: (data: Partial<BookingFormData>) => void;
  setCurrentStep: (step: 'selection' | 'activity' | 'pricing' | 'details') => void;
  setSubmitting: (submitting: boolean) => void;
  addError: (error: string) => void;
  clearErrors: () => void;
  
  setFacilityContext: (facilityId: string, facilityName: string) => void;
  resetBooking: () => void;
}

const initialFormData: BookingFormData = {
  purpose: '',
  attendees: 1,
  activityType: '',
  additionalInfo: '',
  actorType: 'private-person',
  termsAccepted: false,
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  organization: ''
};

// Helper function to ensure date is a Date object
const ensureDate = (date: Date | string): Date => {
  return date instanceof Date ? date : new Date(date);
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedSlots: [],
      formData: initialFormData,
      currentStep: 'selection',
      isSubmitting: false,
      errors: [],
      currentFacilityId: '',
      currentFacilityName: '',

      // Slot management actions
      setSelectedSlots: (slots) => {
        // Ensure all dates are Date objects
        const normalizedSlots = slots.map(slot => ({
          ...slot,
          date: ensureDate(slot.date)
        }));
        set({ selectedSlots: normalizedSlots });
      },

      addSlot: (slot) => {
        const { selectedSlots } = get();
        const normalizedSlot = {
          ...slot,
          date: ensureDate(slot.date)
        };
        
        const exists = selectedSlots.some(s => {
          const sDate = ensureDate(s.date);
          return s.zoneId === normalizedSlot.zoneId &&
            sDate.toDateString() === normalizedSlot.date.toDateString() &&
            s.timeSlot === normalizedSlot.timeSlot;
        });
        
        if (!exists) {
          set({ selectedSlots: [...selectedSlots, normalizedSlot] });
        }
      },

      removeSlot: (zoneId, date, timeSlot) => {
        const { selectedSlots } = get();
        const targetDate = ensureDate(date);
        
        const filtered = selectedSlots.filter(slot => {
          const slotDate = ensureDate(slot.date);
          return !(slot.zoneId === zoneId &&
            slotDate.toDateString() === targetDate.toDateString() &&
            slot.timeSlot === timeSlot);
        });
        set({ selectedSlots: filtered });
      },

      clearSlots: () => {
        set({ selectedSlots: [] });
      },

      bulkAddSlots: (slots) => {
        const { selectedSlots } = get();
        const normalizedNewSlots = slots.map(slot => ({
          ...slot,
          date: ensureDate(slot.date)
        }));
        
        const newSlots = normalizedNewSlots.filter(newSlot => 
          !selectedSlots.some(existingSlot => {
            const existingDate = ensureDate(existingSlot.date);
            return existingSlot.zoneId === newSlot.zoneId &&
              existingDate.toDateString() === newSlot.date.toDateString() &&
              existingSlot.timeSlot === newSlot.timeSlot;
          })
        );
        
        if (newSlots.length > 0) {
          set({ selectedSlots: [...selectedSlots, ...newSlots] });
        }
      },

      // Form management actions
      updateFormData: (data) => {
        set(state => ({
          formData: { ...state.formData, ...data }
        }));
      },

      setCurrentStep: (step) => {
        set({ currentStep: step });
      },

      setSubmitting: (submitting) => {
        set({ isSubmitting: submitting });
      },

      addError: (error) => {
        set(state => ({
          errors: [...state.errors, error]
        }));
      },

      clearErrors: () => {
        set({ errors: [] });
      },

      setFacilityContext: (facilityId, facilityName) => {
        set({ 
          currentFacilityId: facilityId, 
          currentFacilityName: facilityName 
        });
      },

      resetBooking: () => {
        set({
          selectedSlots: [],
          formData: initialFormData,
          currentStep: 'selection',
          isSubmitting: false,
          errors: [],
          currentFacilityId: '',
          currentFacilityName: ''
        });
      }
    }),
    {
      name: 'booking-storage',
      partialize: (state) => ({
        selectedSlots: state.selectedSlots,
        formData: state.formData,
        currentFacilityId: state.currentFacilityId,
        currentFacilityName: state.currentFacilityName
      }),
    }
  )
);
