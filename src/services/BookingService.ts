
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from '@/components/booking/types';
import { useCartStore } from '@/stores/useCartStore';
import { ActorType as CartActorType } from '@/types/cart';
import { ActorType as PricingActorType } from '@/types/pricing';
import { EventType } from '@/types/booking';
import { Booking, BookingFilters, BookingCreateRequest, BookingUpdateRequest } from '@/types/booking';
import { PaginationParams } from '@/types/api';

export interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: PricingActorType;
  termsAccepted: boolean;
}

export interface BookingServiceParams {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones: Zone[];
  formData: BookingFormData;
}

interface BookingResult {
  success: boolean;
  message: string;
  conflicts?: any[];
}

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

// Helper function to convert between ActorType formats
const convertActorType = (pricingType: PricingActorType): CartActorType => {
  switch (pricingType) {
    case 'private-person': return 'private';
    case 'lag-foreninger': return 'lag-foreninger';
    case 'paraply': return 'paraply';
    case 'private-firma': return 'business';
    case 'kommunale-enheter': return 'organization';
    default: return 'private';
  }
};

// Helper function to convert activity type to event type
const convertActivityToEventType = (activityType: string): EventType => {
  switch (activityType) {
    case 'sport':
    case 'sports': return 'training'; // Use valid EventType
    case 'kultur':
    case 'cultural': return 'performance'; // Use valid EventType
    case 'møte':
    case 'meeting': return 'meeting';
    case 'trening':
    case 'training': return 'training';
    case 'konkurranse':
    case 'competition': return 'competition';
    default: return 'other';
  }
};

export class BookingService {
  static validateBookingData(params: BookingServiceParams): boolean {
    const { selectedSlots, formData } = params;
    
    if (selectedSlots.length === 0) return false;
    if (!formData.purpose || formData.purpose.trim().length === 0) return false;
    if (formData.attendees < 1) return false;
    if (!formData.actorType) return false;
    if (!formData.termsAccepted) return false;
    
    return true;
  }

  static calculateTotalPricing(selectedSlots: SelectedTimeSlot[], zones: Zone[] = []): number {
    return selectedSlots.reduce((total, slot) => {
      const duration = slot.duration || 2;
      const pricePerHour = 225; // Default price
      return total + (pricePerHour * duration);
    }, 0);
  }

  static async addToCart(params: BookingServiceParams): Promise<BookingResult> {
    try {
      console.log('BookingService: Adding to cart with form data:', params.formData);
      
      if (!this.validateBookingData(params)) {
        return {
          success: false,
          message: 'Ugyldig booking data',
          conflicts: []
        };
      }

      const { selectedSlots, facilityId, facilityName, formData } = params;
      const { addToCart } = useCartStore.getState();
      
      // Process each selected slot
      for (const slot of selectedSlots) {
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
          purpose: formData.purpose,
          eventType: convertActivityToEventType(formData.activityType),
          expectedAttendees: formData.attendees,
          organizationType: convertActorType(formData.actorType),
          specialRequirements: formData.additionalInfo || undefined,
          additionalServices: [],
          timeSlots: [slot],
          customerInfo: {
            name: '', // Will be filled later in checkout
            email: '',
            phone: '',
            organization: ''
          },
          pricing: {
            baseFacilityPrice: pricePerHour * duration,
            servicesPrice: 0,
            discounts: 0,
            vatAmount: 0,
            totalPrice: pricePerHour * duration
          }
        });
      }

      return {
        success: true,
        message: `${selectedSlots.length} tidspunkt lagt til i handlekurv`,
        conflicts: []
      };

    } catch (error) {
      console.error('BookingService: Error adding to cart:', error);
      return {
        success: false,
        message: 'Kunne ikke legge til i handlekurv',
        conflicts: []
      };
    }
  }

  static async completeBooking(params: BookingServiceParams): Promise<BookingResult> {
    try {
      console.log('BookingService: Completing booking with form data:', params.formData);
      
      if (!this.validateBookingData(params)) {
        return {
          success: false,
          message: 'Ugyldig booking data',
          conflicts: []
        };
      }
      
      // This would normally submit to a booking API
      // For now, we'll just return success
      
      return {
        success: true,
        message: `Booking opprettet for ${params.selectedSlots.length} tidspunkt`,
        conflicts: []
      };

    } catch (error) {
      console.error('BookingService: Error completing booking:', error);
      return {
        success: false,
        message: 'Kunne ikke opprette booking',
        conflicts: []
      };
    }
  }

  // Mock implementations for missing methods with proper error handling
  static async getBookings(pagination: PaginationParams, filters?: BookingFilters): Promise<ServiceResponse<{ items: any[]; total: number; page: number; limit: number; }>> {
    try {
      return { 
        success: true, 
        data: { items: [], total: 0, page: pagination.page, limit: pagination.limit } 
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to fetch bookings' }
      };
    }
  }

  static async getBookingById(id: string): Promise<ServiceResponse<any>> {
    try {
      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to fetch booking' }
      };
    }
  }

  static async getBookingsByFacility(facilityId: string): Promise<ServiceResponse<any[]>> {
    try {
      return { success: true, data: [] };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to fetch facility bookings' }
      };
    }
  }

  static async getBookingsByZone(zoneId: string): Promise<ServiceResponse<any[]>> {
    try {
      return { success: true, data: [] };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to fetch zone bookings' }
      };
    }
  }

  static async checkAvailability(zoneId: string, date: Date, timeSlots: string[]): Promise<ServiceResponse<{}>> {
    try {
      return { success: true, data: {} };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to check availability' }
      };
    }
  }

  static async getConflictingBookings(zoneId: string, startDate: Date, endDate: Date): Promise<ServiceResponse<{ hasConflict: boolean; conflictingBookings: any[]; availableAlternatives: any[]; }>> {
    try {
      return { 
        success: true, 
        data: { hasConflict: false, conflictingBookings: [], availableAlternatives: [] } 
      };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to check conflicts' }
      };
    }
  }

  static async createBooking(request: BookingCreateRequest): Promise<ServiceResponse<any>> {
    try {
      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to create booking' }
      };
    }
  }

  static async updateBooking(id: string, request: BookingUpdateRequest): Promise<ServiceResponse<any>> {
    try {
      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to update booking' }
      };
    }
  }

  static async cancelBooking(id: string, reason?: string): Promise<ServiceResponse<any>> {
    try {
      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to cancel booking' }
      };
    }
  }

  static async approveBooking(id: string, notes?: string): Promise<ServiceResponse<any>> {
    try {
      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to approve booking' }
      };
    }
  }

  static async rejectBooking(id: string, reason: string): Promise<ServiceResponse<any>> {
    try {
      return { success: true, data: null };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to reject booking' }
      };
    }
  }

  static async createRecurringBooking(request: BookingCreateRequest, pattern: any): Promise<ServiceResponse<any[]>> {
    try {
      return { success: true, data: [] };
    } catch (error) {
      return {
        success: false,
        error: { message: 'Failed to create recurring booking' }
      };
    }
  }
}
