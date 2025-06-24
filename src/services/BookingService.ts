
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from '@/components/booking/types';
import { ActorType } from '@/types/pricing';

export interface BookingData {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones?: Zone[];
  formData: any;
}

export interface BookingValidationResult {
  isValid: boolean;
  message?: string;
  conflicts?: any[];
}

export interface AddToCartResult {
  success: boolean;
  message?: string;
  conflicts?: any[];
}

export interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: ActorType;
  termsAccepted: boolean;
}

export interface BookingServiceParams {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones?: Zone[];
  formData: BookingFormData;
}

export const BookingService = {
  validateBookingData: (bookingData: any): BookingValidationResult => {
    if (!bookingData.selectedSlots || bookingData.selectedSlots.length === 0) {
      return {
        isValid: false,
        message: "Vennligst velg minst ett tidspunkt."
      };
    }

    if (!bookingData.formData.termsAccepted) {
      return {
        isValid: false,
        message: "Vennligst aksepter vilkårene for å fortsette."
      };
    }

    return { isValid: true };
  },

  addToCart: async (bookingData: BookingData): Promise<AddToCartResult> => {
    const { selectedSlots, facilityId, facilityName, zones, formData } = bookingData;

    // Mock conflict check - replace with real implementation
    const hasConflicts = selectedSlots.some(slot => {
      const slotDate = slot.date.toISOString().slice(0, 10);
      return slotDate === '2025-06-25'; // Simulate conflict on this date
    });

    if (hasConflicts) {
      return {
        success: false,
        message: "Beklager, ett eller flere av de valgte tidspunktene er ikke tilgjengelige.",
        conflicts: [{ date: '2025-06-25', zone: 'Zone A' }]
      };
    }

    return {
      success: true,
      message: "Tidspunkt lagt til i handlekurven."
    };
  },

  completeBooking: async (bookingData: BookingData): Promise<AddToCartResult> => {
    // For now, just use the same logic as addToCart
    return await BookingService.addToCart(bookingData);
  },

  getBookings: async () => {
    return { success: true, data: [] };
  },

  getBookingById: async (id: string) => {
    return { success: true, data: null };
  },

  getBookingsByFacility: async (facilityId: string) => {
    return { success: true, data: [] };
  },

  getBookingsByZone: async (zoneId: string) => {
    return { success: true, data: [] };
  },

  checkAvailability: async (facilityId: string, date: Date, timeSlot: string) => {
    return { success: true, available: true };
  },

  getConflictingBookings: async (facilityId: string, date: Date, timeSlot: string) => {
    return { success: true, data: [] };
  },

  createBooking: async (bookingData: any) => {
    return { success: true, data: null };
  },

  updateBooking: async (id: string, updates: any) => {
    return { success: true, data: null };
  },

  cancelBooking: async (id: string, reason?: string) => {
    return { success: true, data: null };
  },

  approveBooking: async (id: string) => {
    return { success: true, data: null };
  },

  rejectBooking: async (id: string, reason: string) => {
    return { success: true, data: null };
  },

  createRecurringBooking: async (bookingData: any) => {
    return { success: true, data: null };
  },

  calculateTotalPricing: async (bookingData: any) => {
    return { success: true, data: { total: 0 } };
  }
};
