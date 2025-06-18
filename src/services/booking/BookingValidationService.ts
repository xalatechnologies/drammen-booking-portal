
import { BookingCreateRequest } from '@/types/booking';
import { ApiResponse } from '@/types/api';

export class BookingValidationService {
  static async validateBookingRequest(
    request: BookingCreateRequest
  ): Promise<ApiResponse<void>> {
    try {
      const errors: string[] = [];

      // Validate required fields
      if (!request.facilityId) errors.push('Facility ID is required');
      if (!request.zoneId) errors.push('Zone ID is required');
      if (!request.startDate) errors.push('Start date is required');
      if (!request.endDate) errors.push('End date is required');
      if (!request.purpose || request.purpose.trim().length === 0) {
        errors.push('Purpose is required');
      }
      if (!request.contactName || request.contactName.trim().length === 0) {
        errors.push('Contact name is required');
      }
      if (!request.contactEmail || request.contactEmail.trim().length === 0) {
        errors.push('Contact email is required');
      }
      if (!request.contactPhone || request.contactPhone.trim().length === 0) {
        errors.push('Contact phone is required');
      }

      // Validate date logic
      if (request.startDate && request.endDate) {
        if (request.startDate >= request.endDate) {
          errors.push('End date must be after start date');
        }

        // Check if booking is in the past
        const now = new Date();
        if (request.startDate < now) {
          errors.push('Cannot book in the past');
        }

        // Check advance booking limits (max 90 days)
        const maxAdvanceMs = 90 * 24 * 60 * 60 * 1000;
        const maxBookingDate = new Date(now.getTime() + maxAdvanceMs);
        if (request.startDate > maxBookingDate) {
          errors.push('Cannot book more than 90 days in advance');
        }
      }

      // Validate attendees
      if (request.expectedAttendees <= 0) {
        errors.push('Number of attendees must be greater than 0');
      }

      // Validate email format
      if (request.contactEmail) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(request.contactEmail)) {
          errors.push('Invalid email format');
        }
      }

      // Validate phone format (Norwegian format)
      if (request.contactPhone) {
        const phoneRegex = /^(\+47|0047|47)?[2-9]\d{7}$/;
        const cleanPhone = request.contactPhone.replace(/\s/g, '');
        if (!phoneRegex.test(cleanPhone)) {
          errors.push('Invalid Norwegian phone number format');
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          error: {
            message: 'Validation failed',
            details: { validationErrors: errors }
          }
        };
      }

      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Validation error',
          details: error
        }
      };
    }
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateNorwegianPhone(phone: string): boolean {
    const phoneRegex = /^(\+47|0047|47)?[2-9]\d{7}$/;
    const cleanPhone = phone.replace(/\s/g, '');
    return phoneRegex.test(cleanPhone);
  }
}
