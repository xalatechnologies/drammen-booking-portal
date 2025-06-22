import { IBookingRepository } from '@/dal/interfaces/booking/IBookingRepository';
import { IBookingService } from '@/services/interfaces/booking/IBookingService';
import { PaginationParams, ServiceResponse } from '@/types/api';
import { Booking, BookingCreateRequest, BookingFilters, BookingUpdateRequest } from '@/types/booking';
import { BookingConflictResult } from '@/types/booking/bookingConflict';
import { bookingRepository } from '@/dal/repositories/booking/BookingRepository';

/**
 * Service implementation for booking operations
 * Follows Single Responsibility Principle by focusing only on booking operations
 * Follows Open/Closed Principle by being open for extension but closed for modification
 * Follows Dependency Inversion Principle by depending on abstractions (IBookingRepository)
 */
export class BookingService implements IBookingService {
  private repository: IBookingRepository;

  /**
   * Constructor with dependency injection
   * @param repository The booking repository interface implementation
   */
  constructor(repository: IBookingRepository = bookingRepository) {
    this.repository = repository;
  }

  /**
   * Get all bookings with optional filtering and pagination
   * @param params Pagination parameters
   * @param filters Booking filters
   */
  async getAll(params?: PaginationParams, filters?: BookingFilters): Promise<ServiceResponse<Booking[]>> {
    try {
      const result = await this.repository.findAllWithFilters(params, filters);
      
      if (result.error) {
        return {
          data: [],
          error: result.error
        };
      }
      
      return {
        data: result.data || []
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Get a booking by ID
   * @param id The booking ID
   */
  async getById(id: string): Promise<ServiceResponse<Booking | null>> {
    try {
      const result = await this.repository.getById(id);
      
      if (result.error) {
        return {
          data: null,
          error: result.error
        };
      }

      return {
        data: result.data
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  /**
   * Create a new booking
   * @param data The booking data
   */
  async create(data: BookingCreateRequest): Promise<ServiceResponse<Booking | null>> {
    try {
      // Check for booking conflicts before creating
      if (data.facilityId && data.zoneId && data.startDate && data.endDate) {
        const conflictCheck = await this.checkConflicts(
          data.facilityId,
          data.zoneId,
          data.startDate,
          data.endDate
        );
        
        if (conflictCheck.error) {
          return {
            data: null,
            error: conflictCheck.error
          };
        }
        
        if (conflictCheck.data === true) {
          return {
            data: null,
            error: 'Booking conflict detected. The facility/zone is not available for the selected time.'
          };
        }
      }
      
      const result = await this.repository.create(data);
      
      if (result.error) {
        return {
          data: null,
          error: result.error
        };
      }

      return {
        data: result.data
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  /**
   * Update an existing booking
   * @param id The booking ID
   * @param data The updated booking data
   */
  async update(id: string, data: BookingUpdateRequest): Promise<ServiceResponse<Booking | null>> {
    try {
      // Check for booking conflicts if dates or location changed
      if (data.facilityId || data.zoneId || data.startDate || data.endDate) {
        // Get current booking details
        const currentBooking = await this.repository.getById(id);
        
        if (currentBooking.error || !currentBooking.data) {
          return {
            data: null,
            error: currentBooking.error || 'Booking not found'
          };
        }
        
        const facilityId = data.facilityId || currentBooking.data.facilityId;
        const zoneId = data.zoneId || currentBooking.data.zoneId;
        const startDate = data.startDate || currentBooking.data.startDate;
        const endDate = data.endDate || currentBooking.data.endDate;
        
        // Only check conflicts if any of these values changed
        if (
          data.facilityId !== undefined || 
          data.zoneId !== undefined ||
          data.startDate !== undefined ||
          data.endDate !== undefined
        ) {
          const conflictCheck = await this.checkConflicts(
            facilityId,
            zoneId,
            startDate,
            endDate,
            id // exclude current booking from conflict check
          );
          
          if (conflictCheck.error) {
            return {
              data: null,
              error: conflictCheck.error
            };
          }
          
          if (conflictCheck.data === true) {
            return {
              data: null,
              error: 'Booking conflict detected. The facility/zone is not available for the updated time.'
            };
          }
        }
      }
      
      const result = await this.repository.update(id, data);
      
      if (result.error) {
        return {
          data: null,
          error: result.error
        };
      }

      return {
        data: result.data
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  /**
   * Delete a booking by ID
   * @param id The booking ID
   */
  async delete(id: string): Promise<ServiceResponse<boolean>> {
    try {
      const result = await this.repository.delete(id);
      
      if (result.error) {
        return {
          data: false,
          error: result.error
        };
      }

      return {
        data: result.data
      };
    } catch (error: any) {
      return {
        data: false,
        error: error.message
      };
    }
  }

  /**
   * Check for booking conflicts for a given time and facility/zone
   * @param facilityId Facility ID
   * @param zoneId Zone ID
   * @param startDate Start date and time
   * @param endDate End date and time
   * @param excludeBookingId Optional booking ID to exclude from conflict check
   */
  async checkConflicts(
    facilityId: string,
    zoneId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string
  ): Promise<ServiceResponse<boolean>> {
    try {
      const result = await this.repository.checkBookingConflicts(
        zoneId,
        startDate,
        endDate,
        excludeBookingId
      );
      
      if (result.error) {
        return {
          data: false,
          error: result.error
        };
      }

      // Extract the hasConflict boolean from the BookingConflictResult
      const conflictResult = result.data as BookingConflictResult;
      return {
        data: conflictResult ? conflictResult.hasConflict : false
      };
    } catch (error: any) {
      return {
        data: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance for DI
export const bookingService = new BookingService();
