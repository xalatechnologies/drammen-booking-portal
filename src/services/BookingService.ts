
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
      const result = await bookingRepository.findAllWithFilters(pagination, filters);
      
      if (result.error) {
        return {
          success: false,
          error: { message: result.error },
        };
      }

      return {
        success: true,
        data: {
          data: result.data || [],
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: result.data?.length || 0,
            totalPages: Math.ceil((result.data?.length || 0) / pagination.limit),
            hasNext: false,
            hasPrev: false
          }
        }
      };
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
      
      if (result.error) {
        return {
          success: false,
          error: { message: result.error },
        };
      }

      return {
        success: true,
        data: result.data
      };
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

      // Transform BookingCreateRequest to match database structure
      const bookingData = {
        facility_id: parseInt(request.facilityId),
        zone_id: request.zoneId,
        user_id: 'temp-user-id',
        start_date: request.startDate,
        end_date: request.endDate,
        purpose: request.purpose,
        event_type: request.eventType,
        expected_attendees: request.expectedAttendees,
        age_group: request.ageGroup,
        contact_name: request.contactName,
        contact_email: request.contactEmail,
        contact_phone: request.contactPhone,
        special_requirements: request.specialRequirements,
        organization_id: request.organizationId,
        duration_minutes: Math.floor((request.endDate.getTime() - request.startDate.getTime()) / (1000 * 60)),
        booking_reference: `BK-${Date.now()}`,
        base_price: 0,
        total_price: 0,
        services_price: 0,
        type: 'engangs' as any,
        status: 'draft' as any,
        approval_status: 'not-required' as any,
        requires_approval: false,
        description: '',
        // Core Booking interface fields
        eventType: request.eventType,
        expectedAttendees: request.expectedAttendees,
        ageGroup: request.ageGroup,
        contactName: request.contactName,
        contactEmail: request.contactEmail,
        contactPhone: request.contactPhone,
        startDate: request.startDate,
        endDate: request.endDate,
        facilityId: parseInt(request.facilityId),
        zoneId: request.zoneId,
        additionalServices: [],
        pricing: {
          basePrice: 0,
          servicesPrice: 0,
          discounts: [],
          surcharges: [],
          taxes: [],
          totalPrice: 0,
          breakdown: []
        },
        requiresApproval: false,
        approvalStatus: 'not-required' as any,
        notes: [],
        attachments: []
      };

      // Create the booking
      const result = await bookingRepository.create(bookingData as any);
      
      if (result.error) {
        return {
          success: false,
          error: { message: result.error },
        };
      }

      if (result.data) {
        await BookingNotificationService.triggerBookingNotifications(result.data, 'created');
      }

      return {
        success: true,
        data: result.data
      };
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
        if (existing.error || !existing.data) {
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

      // Transform update request to match database structure
      const updateData: any = {};
      
      if (request.startDate) updateData.start_date = request.startDate;
      if (request.endDate) updateData.end_date = request.endDate;
      if (request.purpose) updateData.purpose = request.purpose;
      if (request.eventType) updateData.event_type = request.eventType;
      if (request.expectedAttendees) updateData.expected_attendees = request.expectedAttendees;
      if (request.ageGroup) updateData.age_group = request.ageGroup;
      if (request.contactName) updateData.contact_name = request.contactName;
      if (request.contactEmail) updateData.contact_email = request.contactEmail;
      if (request.contactPhone) updateData.contact_phone = request.contactPhone;
      if (request.specialRequirements) updateData.special_requirements = request.specialRequirements;
      if (request.organizationId) updateData.organization_id = request.organizationId;

      const result = await bookingRepository.update(id, updateData);
      
      if (result.error) {
        return {
          success: false,
          error: { message: result.error },
        };
      }

      if (result.data) {
        await BookingNotificationService.triggerBookingNotifications(result.data, 'updated');
      }

      return {
        success: true,
        data: result.data
      };
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

      const updateData = {
        status: 'cancelled' as any,
        cancellation_reason: reason ? `Cancelled: ${reason}` : 'Booking cancelled',
        cancelled_at: new Date()
      };

      const result = await bookingRepository.update(id, updateData);

      if (result.error) {
        return {
          success: false,
          error: { message: result.error },
        };
      }

      if (result.data) {
        await BookingNotificationService.triggerBookingNotifications(result.data, 'cancelled');
      }

      return {
        success: true,
        data: result.data
      };
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

      const updateData = {
        status: 'approved' as any,
        approval_status: 'approved' as any,
        approved_at: new Date(),
        internal_notes: approverNotes ? `Approved: ${approverNotes}` : 'Booking approved'
      };

      const result = await bookingRepository.update(id, updateData);

      if (result.error) {
        return {
          success: false,
          error: { message: result.error },
        };
      }

      if (result.data) {
        await BookingNotificationService.triggerBookingNotifications(result.data, 'approved');
      }

      return {
        success: true,
        data: result.data
      };
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

      const updateData = {
        status: 'rejected' as any,
        approval_status: 'rejected' as any,
        rejection_reason: `Rejected: ${rejectionReason}`
      };

      const result = await bookingRepository.update(id, updateData);

      if (result.error) {
        return {
          success: false,
          error: { message: result.error },
        };
      }

      if (result.data) {
        await BookingNotificationService.triggerBookingNotifications(result.data, 'rejected');
      }

      return {
        success: true,
        data: result.data
      };
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
      
      if (result.error) {
        return {
          success: false,
          error: { message: result.error },
        };
      }

      return {
        success: true,
        data: result.data || []
      };
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
      
      if (result.error) {
        return {
          success: false,
          error: { message: result.error },
        };
      }

      return {
        success: true,
        data: result.data || []
      };
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

      // Simple availability check - return all slots as available for now
      const availability: Record<string, boolean> = {};
      timeSlots.forEach(slot => {
        availability[slot] = true;
      });

      return {
        success: true,
        data: availability
      };
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

      const result = await BookingConflictService.checkBookingConflicts(zoneId, startDate, endDate);
      
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
          conflicts: result.data?.conflicts || [],
          alternatives: result.data?.alternatives || []
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

      // For now, just return the single booking
      // Recurring logic would be implemented here
      const allBookings = [baseBooking.data];
      
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
