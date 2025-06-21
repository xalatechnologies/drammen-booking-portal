
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType } from '@/types/pricing';
import { useCartStore } from '@/stores/useCartStore';
import { Zone } from '@/components/booking/types';
import { BookingRepository } from '@/dal/repositories/BookingRepository';
import { ApiResponse } from '@/types/api';
import { Booking, BookingCreateRequest, BookingUpdateRequest, BookingFilters } from '@/types/booking';
import { PaginationParams } from '@/types/api';

export interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: ActorType | '';
  termsAccepted: boolean;
}

export interface BookingServiceParams {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones?: Zone[];
  formData: BookingFormData;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingBookings: Booking[];
  availableAlternatives: any[];
}

const bookingRepository = new BookingRepository();

export class BookingService {
  static validateBookingData(params: BookingServiceParams): boolean {
    const { selectedSlots, formData } = params;
    
    return formData.purpose.trim() && 
           formData.attendees > 0 && 
           formData.activityType && 
           formData.actorType &&
           formData.termsAccepted &&
           selectedSlots.length > 0;
  }

  static calculateTotalPricing(selectedSlots: SelectedTimeSlot[], zones: Zone[] = []): {
    totalDuration: number;
    averagePricePerHour: number;
    baseFacilityPrice: number;
  } {
    const totalDuration = selectedSlots.reduce((total, slot) => total + (slot.duration || 2), 0);
    const averagePricePerHour = zones.length > 0 ? 
      selectedSlots.reduce((total, slot) => {
        const zone = zones.find(z => z.id === slot.zoneId);
        return total + (zone?.pricePerHour || 450);
      }, 0) / selectedSlots.length : 450;

    const baseFacilityPrice = averagePricePerHour * totalDuration;

    return {
      totalDuration,
      averagePricePerHour,
      baseFacilityPrice
    };
  }

  // Conflict handling methods
  static async checkBookingConflicts(
    zoneId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string
  ): Promise<ApiResponse<ConflictCheckResult>> {
    try {
      const result = await bookingRepository.checkBookingConflicts(zoneId, startDate, endDate, excludeBookingId);
      
      if (result.error) {
        return {
          success: false,
          error: {
            message: 'Failed to check booking conflicts',
            details: result.error
          }
        };
      }

      return {
        success: true,
        data: result.data || { hasConflict: false, conflictingBookings: [], availableAlternatives: [] }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to check booking conflicts',
          details: error
        }
      };
    }
  }

  static async checkAvailability(
    zoneId: string,
    date: Date,
    timeSlots: string[]
  ): Promise<ApiResponse<Record<string, boolean>>> {
    try {
      // Mock implementation - in real app this would check actual bookings
      const availability: Record<string, boolean> = {};
      
      for (const timeSlot of timeSlots) {
        const [startTime, endTime] = timeSlot.split('-');
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        
        const startDateTime = new Date(date);
        startDateTime.setHours(startHour, startMin, 0, 0);
        
        const endDateTime = new Date(date);
        endDateTime.setHours(endHour, endMin, 0, 0);
        
        const conflictResult = await this.checkBookingConflicts(zoneId, startDateTime, endDateTime);
        availability[timeSlot] = conflictResult.success && !conflictResult.data?.hasConflict;
      }
      
      return {
        success: true,
        data: availability
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to check availability',
          details: error
        }
      };
    }
  }

  static async validateSlotsForConflicts(selectedSlots: SelectedTimeSlot[]): Promise<{
    validSlots: SelectedTimeSlot[];
    conflictedSlots: SelectedTimeSlot[];
    conflicts: ConflictCheckResult[];
  }> {
    const validSlots: SelectedTimeSlot[] = [];
    const conflictedSlots: SelectedTimeSlot[] = [];
    const conflicts: ConflictCheckResult[] = [];

    for (const slot of selectedSlots) {
      const [startTime, endTime] = slot.timeSlot.split('-');
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      
      const startDateTime = new Date(slot.date);
      startDateTime.setHours(startHour, startMin, 0, 0);
      
      const endDateTime = new Date(slot.date);
      endDateTime.setHours(endHour, endMin, 0, 0);

      const conflictResult = await this.checkBookingConflicts(slot.zoneId, startDateTime, endDateTime);
      
      if (conflictResult.success && conflictResult.data?.hasConflict) {
        conflictedSlots.push(slot);
        conflicts.push(conflictResult.data);
      } else {
        validSlots.push(slot);
      }
    }

    return { validSlots, conflictedSlots, conflicts };
  }

  static async addToCart(params: BookingServiceParams): Promise<{ success: boolean; message: string; conflicts?: ConflictCheckResult[] }> {
    try {
      if (!this.validateBookingData(params)) {
        return {
          success: false,
          message: "Manglende informasjon - vennligst fyll ut alle påkrevde felt"
        };
      }

      const { selectedSlots, facilityId, facilityName, zones, formData } = params;

      // Check for conflicts before adding to cart
      const conflictValidation = await this.validateSlotsForConflicts(selectedSlots);
      
      if (conflictValidation.conflictedSlots.length > 0) {
        return {
          success: false,
          message: `${conflictValidation.conflictedSlots.length} tidspunkt har konflikter og kan ikke bookes`,
          conflicts: conflictValidation.conflicts
        };
      }

      const { totalDuration, averagePricePerHour, baseFacilityPrice } = this.calculateTotalPricing(selectedSlots, zones);

      // Get cart store
      const { addToCart } = useCartStore.getState();

      // Create a single cart item with all selected slots
      addToCart({
        facilityId,
        facilityName,
        zoneId: selectedSlots[0].zoneId, // Primary zone for backward compatibility
        date: selectedSlots[0].date, // Primary date for backward compatibility
        timeSlot: selectedSlots[0].timeSlot, // Primary time slot for backward compatibility
        duration: totalDuration,
        pricePerHour: averagePricePerHour,
        purpose: formData.purpose,
        expectedAttendees: formData.attendees,
        organizationType: formData.actorType === 'private-person' ? 'private' : 
                        formData.actorType === 'lag-foreninger' ? 'organization' : 'business',
        additionalServices: [],
        timeSlots: selectedSlots, // All selected slots in one reservation
        customerInfo: {
          name: '',
          email: '',
          phone: ''
        },
        pricing: {
          baseFacilityPrice,
          servicesPrice: 0,
          discounts: 0,
          vatAmount: 0,
          totalPrice: baseFacilityPrice
        }
      });

      return {
        success: true,
        message: `Reservasjon med ${selectedSlots.length} tidspunkt er lagt til i handlekurven`
      };
    } catch (error) {
      console.error('BookingService: Error adding to cart:', error);
      return {
        success: false,
        message: "Kunne ikke legge til i handlekurv. Prøv igjen."
      };
    }
  }

  static async completeBooking(params: BookingServiceParams): Promise<{ success: boolean; message: string; conflicts?: ConflictCheckResult[] }> {
    try {
      const addToCartResult = await this.addToCart(params);
      
      if (!addToCartResult.success) {
        return addToCartResult;
      }

      // Navigate to checkout would be handled by the calling component
      return {
        success: true,
        message: "Reservasjon opprettet - videresendt til checkout"
      };
    } catch (error) {
      console.error('BookingService: Error completing booking:', error);
      return {
        success: false,
        message: "Kunne ikke fullføre reservasjonen. Prøv igjen."
      };
    }
  }

  // Additional methods for useBookings hook compatibility
  static async getBookings(pagination?: PaginationParams, filters?: BookingFilters): Promise<ApiResponse<Booking[]>> {
    try {
      const result = await bookingRepository.findAllWithFilters(pagination, filters);
      return {
        success: true,
        data: result.data || []
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch bookings',
          details: error
        }
      };
    }
  }

  static async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    try {
      const result = await bookingRepository.findById(id);
      if (result.error || !result.data) {
        return {
          success: false,
          error: {
            message: 'Booking not found',
            details: result.error
          }
        };
      }
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch booking',
          details: error
        }
      };
    }
  }

  static async getBookingsByFacility(facilityId: string): Promise<ApiResponse<Booking[]>> {
    try {
      const result = await bookingRepository.getBookingsByFacility(facilityId);
      return {
        success: true,
        data: result.data || []
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch facility bookings',
          details: error
        }
      };
    }
  }

  static async getBookingsByZone(zoneId: string): Promise<ApiResponse<Booking[]>> {
    try {
      const result = await bookingRepository.getBookingsByZone(zoneId);
      return {
        success: true,
        data: result.data || []
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch zone bookings',
          details: error
        }
      };
    }
  }

  static async getConflictingBookings(zoneId: string, startDate: Date, endDate: Date): Promise<ApiResponse<ConflictCheckResult>> {
    return this.checkBookingConflicts(zoneId, startDate, endDate);
  }

  // Placeholder methods for full CRUD operations
  static async createBooking(request: BookingCreateRequest): Promise<ApiResponse<Booking>> {
    // Implementation would go here
    return {
      success: false,
      error: { message: 'Not implemented yet' }
    };
  }

  static async updateBooking(id: string, request: BookingUpdateRequest): Promise<ApiResponse<Booking>> {
    // Implementation would go here
    return {
      success: false,
      error: { message: 'Not implemented yet' }
    };
  }

  static async cancelBooking(id: string, reason?: string): Promise<ApiResponse<Booking>> {
    // Implementation would go here
    return {
      success: false,
      error: { message: 'Not implemented yet' }
    };
  }

  static async approveBooking(id: string, notes?: string): Promise<ApiResponse<Booking>> {
    // Implementation would go here
    return {
      success: false,
      error: { message: 'Not implemented yet' }
    };
  }

  static async rejectBooking(id: string, reason: string): Promise<ApiResponse<Booking>> {
    // Implementation would go here
    return {
      success: false,
      error: { message: 'Not implemented yet' }
    };
  }

  static async createRecurringBooking(request: BookingCreateRequest, pattern: any): Promise<ApiResponse<Booking[]>> {
    // Implementation would go here
    return {
      success: false,
      error: { message: 'Not implemented yet' }
    };
  }
}
