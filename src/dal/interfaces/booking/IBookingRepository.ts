import { PaginationParams, RepositoryResponse } from '@/types/api';
import { Booking, BookingCreateRequest, BookingFilters, BookingUpdateRequest } from '@/types/booking';
import { BookingConflictResult } from '@/types/booking/bookingConflict';

/**
 * Interface for booking repository operations
 * Following Interface Segregation Principle by providing focused booking-related methods
 */
export interface IBookingRepository {
  /**
   * Get a booking by its ID
   * @param id The booking ID
   */
  getById(id: string): Promise<RepositoryResponse<Booking | null>>;

  /**
   * Get bookings with pagination and filtering
   * @param pagination Pagination parameters
   * @param filters Optional filters to apply
   */
  findAllWithFilters(
    pagination?: PaginationParams,
    filters?: BookingFilters
  ): Promise<RepositoryResponse<Booking[]>>;

  /**
   * Create a new booking
   * @param data The booking data
   */
  create(data: BookingCreateRequest): Promise<RepositoryResponse<Booking | null>>;

  /**
   * Update an existing booking
   * @param id The booking ID
   * @param data The updated booking data
   */
  update(id: string, data: BookingUpdateRequest): Promise<RepositoryResponse<Booking | null>>;

  /**
   * Delete a booking
   * @param id The booking ID
   */
  delete(id: string): Promise<RepositoryResponse<boolean>>;

  /**
   * Get bookings for a specific facility
   * @param facilityId The facility ID
   */
  getBookingsByFacility(facilityId: string): Promise<RepositoryResponse<Booking[]>>;

  /**
   * Get bookings for a specific zone
   * @param zoneId The zone ID
   */
  getBookingsByZone(zoneId: string): Promise<RepositoryResponse<Booking[]>>;

  /**
   * Check for booking conflicts
   * @param zoneId The zone ID
   * @param startDate Start date and time
   * @param endDate End date and time
   * @param excludeBookingId Optional booking ID to exclude from conflict check
   */
  checkBookingConflicts(
    zoneId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string
  ): Promise<RepositoryResponse<BookingConflictResult>>;
}
