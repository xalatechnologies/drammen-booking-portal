
import { bookingRepository } from '@/dal/repositories';
import { ApiResponse } from '@/types/api';
import { Booking } from '@/types/booking';

export class BookingConflictService {
  static async checkBookingConflicts(
    zoneId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string
  ): Promise<ApiResponse<{ hasConflict: boolean; conflicts: Booking[]; alternatives: any[] }>> {
    try {
      const result = await bookingRepository.checkBookingConflicts(
        zoneId,
        startDate,
        endDate,
        excludeBookingId
      );
      
      if (result.error) {
        return {
          success: false,
          error: { message: result.error }
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
}
