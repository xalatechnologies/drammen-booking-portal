import { Booking, BookingCreateRequest, BookingFilters, BookingUpdateRequest } from '@/types/booking';
import { PaginationParams, ServiceResponse } from '@/types/api';

/**
 * Interface for booking service operations
 * Follows Interface Segregation Principle by defining focused methods
 * for booking-related service operations
 */
export interface IBookingService {
  /**
   * Get all bookings with optional filtering and pagination
   */
  getAll(params?: PaginationParams, filters?: BookingFilters): Promise<ServiceResponse<Booking[]>>;
  
  /**
   * Get a booking by ID
   */
  getById(id: string): Promise<ServiceResponse<Booking | null>>;
  
  /**
   * Create a new booking
   */
  create(data: BookingCreateRequest): Promise<ServiceResponse<Booking | null>>;
  
  /**
   * Update an existing booking
   */
  update(id: string, data: BookingUpdateRequest): Promise<ServiceResponse<Booking | null>>;
  
  /**
   * Delete a booking by ID
   */
  delete(id: string): Promise<ServiceResponse<boolean>>;
  
  /**
   * Check for booking conflicts for a given time and facility/zone
   */
  checkConflicts(
    facilityId: string,
    zoneId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string
  ): Promise<ServiceResponse<boolean>>;
}
