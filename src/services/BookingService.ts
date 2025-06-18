
import { Booking, BookingCreateRequest, BookingUpdateRequest, BookingFilters } from '@/types/booking';
import { PaginatedResponse, PaginationParams, ApiResponse } from '@/types/api';
import { bookingRepository } from '@/dal/repositories';
import { BookingValidationService } from './booking/BookingValidationService';
import { BookingNotificationService } from './booking/BookingNotificationService';
import { BookingConflictService } from './booking/BookingConflictService';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class BookingService {
  static async getBookings(
    pagination: PaginationParams,
    filters?: BookingFilters
  ): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    try {
      await delay(300);
      const result = await bookingRepository.findAll(pagination, filters, 'createdAt', 'desc');
      return result;
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to fetch bookings", details: error },
      };
    }
  }

  static async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    try {
      await delay(200);
      const result = await bookingRepository.findById(id);
      return result;
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to fetch booking", details: error },
      };
    }
  }

  static async createBooking(request: BookingCreateRequest): Promise<ApiResponse<Booking>> {
    try {
      await delay(400);

      // Validate the booking request
      const validation = await BookingValidationService.validateBookingRequest(request);
      if (!validation.success) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Check for conflicts
      const conflictResult = await BookingConflictService.checkBookingConflicts(
        request.zoneId,
        request.startDate,
        request.endDate
      );

      if (!conflictResult.success) {
        return {
          success: false,
          error: { message: "Failed to check booking conflicts", details: conflictResult.error },
        };
      }

      if (conflictResult.data?.hasConflict) {
        return {
          success: false,
          error: {
            message: "Booking conflict detected",
            details: {
              conflicts: conflictResult.data.conflicts,
              alternatives: conflictResult.data.alternatives
            },
          },
        };
      }

      // Create the booking
      const result = await bookingRepository.create(request);
      
      if (result.success && result.data) {
        await BookingNotificationService.triggerBookingNotifications(result.data, 'created');
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to create booking", details: error },
      };
    }
  }

  static async updateBooking(id: string, request: BookingUpdateRequest): Promise<ApiResponse<Booking>> {
    try {
      await delay(300);

      // If updating dates/times, check for conflicts
      if (request.startDate || request.endDate) {
        const existing = await bookingRepository.findById(id);
        if (!existing.success || !existing.data) {
          return {
            success: false,
            error: { message: "Booking not found" },
          };
        }

        const startDate = request.startDate || existing.data.startDate;
        const endDate = request.endDate || existing.data.endDate;

        const conflictResult = await BookingConflictService.checkBookingConflicts(
          existing.data.zoneId,
          startDate,
          endDate,
          id
        );

        if (conflictResult.success && conflictResult.data?.hasConflict) {
          return {
            success: false,
            error: {
              message: "Booking conflict detected",
              details: {
                conflicts: conflictResult.data.conflicts,
                alternatives: conflictResult.data.alternatives
              },
            },
          };
        }
      }

      const result = await bookingRepository.update(id, request);
      
      if (result.success && result.data) {
        await BookingNotificationService.triggerBookingNotifications(result.data, 'updated');
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: { message: "Failed to update booking", details: error },
      };
    }
  }

  static async cancelBooking(id: string, reason?: string): Promise<ApiResponse<Booking>> {
    try {
      await delay(250);

      const result = await bookingRepository.updateBookingStatus(
        id,
        'cancelled',
        reason ? `Cancelled: ${reason}` : 'Booking cancelled'
      );

      if (result.success && result.data) {
        await BookingNotificationService.triggerBookingNotifications(result.data, 'cancelled');
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to cancel booking",
          details: error,
        },
      };
    }
  }

  static async approveBooking(id: string, approverNotes?: string): Promise<ApiResponse<Booking>> {
    try {
      await delay(200);

      const result = await bookingRepository.updateBookingStatus(
        id,
        'approved',
        approverNotes ? `Approved: ${approverNotes}` : 'Booking approved'
      );

      if (result.success && result.data) {
        if (result.data.approvalWorkflow) {
          result.data.approvalStatus = 'approved';
        }
        
        await BookingNotificationService.triggerBookingNotifications(result.data, 'approved');
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to approve booking",
          details: error,
        },
      };
    }
  }

  static async rejectBooking(id: string, rejectionReason: string): Promise<ApiResponse<Booking>> {
    try {
      await delay(200);

      const result = await bookingRepository.updateBookingStatus(
        id,
        'rejected',
        `Rejected: ${rejectionReason}`
      );

      if (result.success && result.data) {
        if (result.data.approvalWorkflow) {
          result.data.approvalStatus = 'rejected';
        }
        
        await BookingNotificationService.triggerBookingNotifications(result.data, 'rejected');
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to reject booking",
          details: error,
        },
      };
    }
  }

  static async getBookingsByFacility(facilityId: string): Promise<ApiResponse<Booking[]>> {
    try {
      await delay(250);

      const result = await bookingRepository.getBookingsByFacility(facilityId);
      return result;
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch bookings by facility",
          details: error,
        },
      };
    }
  }

  static async getBookingsByZone(zoneId: string): Promise<ApiResponse<Booking[]>> {
    try {
      await delay(200);

      const result = await bookingRepository.getBookingsByZone(zoneId);
      return result;
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to fetch bookings by zone",
          details: error,
        },
      };
    }
  }

  static async checkAvailability(
    zoneId: string,
    date: Date,
    timeSlots: string[]
  ): Promise<ApiResponse<Record<string, boolean>>> {
    try {
      await delay(150);

      const result = await bookingRepository.getBookingAvailability(zoneId, date, timeSlots);
      return result;
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to check availability",
          details: error,
        },
      };
    }
  }

  static async getConflictingBookings(
    zoneId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ApiResponse<{ hasConflict: boolean; conflicts: Booking[]; alternatives: any[] }>> {
    try {
      await delay(200);

      const result = await bookingRepository.checkBookingConflicts(zoneId, startDate, endDate);
      
      if (!result.success) {
        return {
          success: false,
          error: result.error
        };
      }

      return {
        success: true,
        data: {
          hasConflict: result.data?.hasConflict || false,
          conflicts: result.data?.conflictingBookings || [],
          alternatives: result.data?.availableAlternatives || []
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to check conflicts",
          details: error,
        },
      };
    }
  }

  static async createRecurringBooking(
    baseRequest: BookingCreateRequest,
    pattern: any
  ): Promise<ApiResponse<Booking[]>> {
    try {
      await delay(500);

      // Create the base booking first
      const baseBooking = await this.createBooking(baseRequest);
      if (!baseBooking.success || !baseBooking.data) {
        return baseBooking as any;
      }

      // Update the base booking with recurrence pattern
      baseBooking.data.isRecurring = true;
      baseBooking.data.recurrencePattern = pattern;

      // Generate recurring occurrences
      const recurringResult = await bookingRepository.generateRecurringBookings(
        baseBooking.data,
        pattern
      );

      if (!recurringResult.success) {
        return recurringResult;
      }

      // Create all the recurring bookings
      const allBookings = [baseBooking.data, ...(recurringResult.data || [])];
      
      // Trigger notifications for recurring booking series
      await BookingNotificationService.triggerBookingNotifications(baseBooking.data, 'recurring-created');

      return {
        success: true,
        data: allBookings
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Failed to create recurring booking",
          details: error,
        },
      };
    }
  }
}
