/**
 * Booking Repository Interface
 *
 * Defines the contract for booking data access operations
 * following Interface Segregation and Dependency Inversion principles.
 */
import { Booking, CreateBookingRequest, UpdateBookingRequest, BookingFilters, TimeSlot } from '../../types/booking';
import { Result } from '@/core/utils/result';

export interface IBookingRepository {
  /**
   * Create a new booking
   */
  createBooking(request: CreateBookingRequest): Promise<Result<Booking>>;
  
  /**
   * Get a booking by ID
   */
  getBookingById(id: string): Promise<Result<Booking>>;
  
  /**
   * Update an existing booking
   */
  updateBooking(id: string, request: UpdateBookingRequest): Promise<Result<Booking>>;
  
  /**
   * Delete a booking
   */
  deleteBooking(id: string): Promise<Result<void>>;
  
  /**
   * Get all bookings matching the provided filters
   */
  getAllBookings(filters: BookingFilters): Promise<Result<Booking[]>>;
  
  /**
   * Check if a time slot is available for a facility
   */
  checkAvailability(facilityId: string, startTime: Date, endTime: Date): Promise<Result<boolean>>;
  
  /**
   * Get all available time slots for a facility in a date range
   */
  getAvailableTimeSlots(facilityId: string, startDate: Date, endDate: Date): Promise<Result<TimeSlot[]>>;
  
  /**
   * Get bookings by user ID
   */
  getBookingsByUserId(userId: string): Promise<Result<Booking[]>>;
  
  /**
   * Get bookings by facility ID
   */
  getBookingsByFacilityId(facilityId: string): Promise<Result<Booking[]>>;
}
