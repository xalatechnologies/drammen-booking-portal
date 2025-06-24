
import { BookingState } from './types';
import { BookingSessionService } from '@/services/BookingSessionService';

export const saveToStorage = (state: BookingState): void => {
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
  } catch (error) {
    console.warn('Failed to save booking state:', error);
  }
};

export const loadFromStorage = (): Partial<BookingState> | null => {
  try {
    const saved = localStorage.getItem('bookingState');
    const sessionData = BookingSessionService.getSessionData();
    
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        selectedSlots: parsed.selectedSlots?.map((slot: any) => ({
          ...slot,
          date: new Date(slot.date) // Deserialize dates
        })) || []
      };
    } else if (sessionData) {
      // Load only contact info from session
      return {
        formData: {
          customerType: sessionData.customerType as any,
          contactName: sessionData.contactName,
          contactEmail: sessionData.contactEmail,
          contactPhone: sessionData.contactPhone,
          organization: sessionData.organization
        }
      };
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to load booking state:', error);
    return null;
  }
};
