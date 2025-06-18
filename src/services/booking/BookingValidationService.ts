
import { BookingCreateRequest } from '@/types/booking';
import { ApiResponse } from '@/types/api';

export class BookingValidationService {
  static async validateBookingRequest(request: BookingCreateRequest): Promise<ApiResponse<null>> {
    // Basic validation
    if (!request.facilityId || !request.zoneId) {
      return {
        success: false,
        error: { message: "Facility ID and Zone ID are required" }
      };
    }

    if (!request.startDate || !request.endDate) {
      return {
        success: false,
        error: { message: "Start date and end date are required" }
      };
    }

    if (request.startDate >= request.endDate) {
      return {
        success: false,
        error: { message: "End date must be after start date" }
      };
    }

    if (request.startDate < new Date()) {
      return {
        success: false,
        error: { message: "Cannot book in the past" }
      };
    }

    if (!request.contactName || !request.contactEmail || !request.contactPhone) {
      return {
        success: false,
        error: { message: "Contact information is required" }
      };
    }

    if (request.expectedAttendees < 1) {
      return {
        success: false,
        error: { message: "Expected attendees must be at least 1" }
      };
    }

    return { success: true, data: null };
  }
}
