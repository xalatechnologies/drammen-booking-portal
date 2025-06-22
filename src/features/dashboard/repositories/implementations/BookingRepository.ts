/**
 * Booking Repository Implementation
 *
 * Implements the IBookingRepository interface with Prisma ORM
 * following Single Responsibility and Dependency Inversion principles.
 */

import { IBookingRepository } from '../interfaces/IBookingRepository';
import { Booking, BookingStatus, CreateBookingRequest, UpdateBookingRequest, BookingFilters, TimeSlot } from '../../types/booking';
import { IDatabaseClient } from '@/core/database/interfaces/IDatabaseClient';
import { ILocalizationService } from '@/core/localization/interfaces/ILocalizationService';
import { Result, ErrorType } from '@/core/utils/result';

export class BookingRepository implements IBookingRepository {
  private readonly tableName = 'bookings';
  
  constructor(
    private readonly databaseClient: IDatabaseClient,
    private readonly localizationService: ILocalizationService
  ) {}
  
  /**
   * Create a new booking
   */
  async createBooking(request: CreateBookingRequest): Promise<Result<Booking>> {
    try {
      // Check availability first
      const availabilityResult = await this.checkAvailability(
        request.facilityId,
        request.startTime,
        request.endTime
      );
      
      if (!availabilityResult.isSuccess) {
        return Result.validationError(
          this.localizationService.translate('errors:bookingTimeUnavailable')
        );
      }
      
      const data = this.mapToDbModel(request);
      
      const result = await this.databaseClient.insert(this.tableName, data);
      
      if (result.isFailure) {
        return Result.databaseError(
          this.localizationService.translate('errors:bookingCreateFailed')
        );
      }
      
      return Result.success(this.mapToDomainModel(result.value));
    } catch (error) {
      console.error('Error creating booking:', error);
      return Result.databaseError(
        this.localizationService.translate('errors:bookingCreateFailed')
      );
    }
  }
  
  /**
   * Get a booking by ID
   */
  async getBookingById(id: string): Promise<Result<Booking>> {
    try {
      const result = await this.databaseClient.getById(this.tableName, id);
      
      if (result.isFailure) {
        return Result.notFound(
          this.localizationService.translate('errors:bookingNotFound', { id })
        );
      }
      
      return Result.success(this.mapToDomainModel(result.value));
    } catch (error) {
      console.error('Error getting booking:', error);
      return Result.databaseError(
        error instanceof Error ? error.message : 'Unknown error',
        { id }
      );
    }
  }
  
  /**
   * Update an existing booking
   */
  async updateBooking(id: string, request: UpdateBookingRequest): Promise<Result<Booking>> {
    try {
      // Get the current booking
      const currentBookingResult = await this.getBookingById(id);
      
      if (currentBookingResult.isFailure) {
        return Result.notFound(
          this.localizationService.translate('errors:bookingNotFound', { id })
        );
      }
      
      const currentBooking = currentBookingResult.value;
      
      // Check availability if times are changing
      if (request.startTime || request.endTime) {
        const startTime = request.startTime || currentBooking.startTime;
        const endTime = request.endTime || currentBooking.endTime;
        
        // Only check availability if the times actually changed
        if (startTime !== currentBooking.startTime || endTime !== currentBooking.endTime) {
          // Check if the dates conflict with existing bookings
          const conflictsResult = await this.databaseClient.getMany(this.tableName, {
            filters: {
              facilityId: currentBooking.facilityId,
              status: { ne: BookingStatus.CANCELLED },
              $or: [
                // Various conflict scenarios
                { startTime: { gte: startTime, lt: endTime } },
                { endTime: { gt: startTime, lte: endTime } },
                { startTime: { lte: startTime }, endTime: { gte: endTime } }
              ]
            }
          });
          
          if (conflictsResult.isFailure) {
            return Result.databaseError(
              this.localizationService.translate('errors:databaseError')
            );
          }
          
          if (conflictsResult.value.length > 0) {
            return Result.validationError(
              this.localizationService.translate('errors:bookingTimeUnavailable')
            );
          }
        }
      }
      
      const data = this.mapToDbModel(request);
      
      const result = await this.databaseClient.update(this.tableName, id, data);
      
      if (result.isFailure) {
        return Result.databaseError(
          this.localizationService.translate('errors:bookingUpdateFailed', { id }),
          result.error
        );
      }
      
      return Result.success(this.mapToDomainModel(result.value));
    } catch (error) {
      console.error('Error updating booking:', error);
      return Result.databaseError(
        error instanceof Error ? error.message : 'Unknown error',
        { id }
      );
    }
  }
  
  /**
   * Delete a booking
   */
  async deleteBooking(id: string): Promise<Result<void>> {
    try {
      const result = await this.databaseClient.delete(this.tableName, id);
      
      if (result.isFailure) {
        // Check if it's specifically a not found error or a different error
        if (result.error && result.error.type === ErrorType.NOT_FOUND_ERROR) {
          return Result.notFound(
            this.localizationService.translate('errors:bookingNotFound', { id })
          );
        } else {
          return Result.databaseError(
            this.localizationService.translate('errors:bookingDeleteFailed', { id }),
            result.error
          );
        }
      }
      
      return Result.success(undefined);
    } catch (error) {
      console.error('Error deleting booking:', error);
      return Result.databaseError(
        error instanceof Error ? error.message : 'Unknown error',
        { id }
      );
    }
  }
  
  /**
   * Get all bookings matching the provided filters
   */
  async getAllBookings(filters: BookingFilters = {}): Promise<Result<Booking[]>> {
    try {
      const dbFilters = this.mapFiltersToDbFilters(filters);
      
      const result = await this.databaseClient.getMany(this.tableName, { filters: dbFilters });
      
      if (result.isFailure) {
        return Result.databaseError('Failed to retrieve bookings', result.error);
      }
      
      if (!result.value || result.value.length === 0) {
        return Result.success<Booking[]>([]);
      }
      
      return Result.success<Booking[]>(result.value.map(booking => this.mapToDomainModel(booking)));
    } catch (error) {
      console.error('Error getting bookings:', error);
      return Result.databaseError(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
  
  /**
   * Check if a time slot is available for a facility
   * @param excludeBookingId - Optional booking ID to exclude from the check (for updates)
   */
  async checkAvailability(facilityId: string, startTime: Date, endTime: Date, excludeBookingId?: string): Promise<Result<boolean>> {
    try {
      const filters: any = {
        facilityId,
        status: { ne: BookingStatus.CANCELLED },
        $or: [
          // Overlapping scenarios
          { startTime: { lt: endTime }, endTime: { gt: startTime } }
        ]
      };
      
      if (excludeBookingId) {
        filters.id = { ne: excludeBookingId };
      }
      
      const result = await this.databaseClient.getMany(this.tableName, { filters });
      
      if (result.isFailure) {
        return Result.databaseError('Failed to retrieve bookings', result.error);
      }
      
      const isAvailable = result.value.length === 0;
      
      return Result.success(isAvailable);
    } catch (error) {
      console.error('Error checking availability:', error);
      return Result.databaseError(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
  
  /**
   * Get all available time slots for a facility in a date range
   */
  async getAvailableTimeSlots(
    facilityId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Result<TimeSlot[]>> {
    try {
      // First, get all existing bookings in this date range
      const bookingsResult = await this.getAllBookings({
        facilityId,
        startDate,
        endDate,
        status: [BookingStatus.CONFIRMED, BookingStatus.PENDING]
      });
      
      if (bookingsResult.isFailure) {
        return Result.databaseError(
          this.localizationService.translate('errors:availabilityCheckFailed'),
          bookingsResult.error
        );
      }
      
      const bookings = bookingsResult.value;
      
      // Generate time slots based on facility operating hours
      // For this example, we'll generate hourly slots from 8AM to 8PM
      const slots: TimeSlot[] = [];
      const currentDate = new Date(startDate);
      
      while (currentDate < endDate) {
        // Only generate slots for working hours (8AM-8PM)
        const dayStart = new Date(currentDate);
        dayStart.setHours(8, 0, 0, 0);
        
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(20, 0, 0, 0);
        
        // Generate hourly slots
        for (let hour = 8; hour < 20; hour++) {
          const slotStart = new Date(currentDate);
          slotStart.setHours(hour, 0, 0, 0);
          
          const slotEnd = new Date(currentDate);
          slotEnd.setHours(hour + 1, 0, 0, 0);
          
          // Check if this slot overlaps with any existing booking
          const isAvailable = !bookings.some(booking => {
            const bookingStart = new Date(booking.startTime);
            const bookingEnd = new Date(booking.endTime);
            
            // Check for overlap
            return (
              (slotStart >= bookingStart && slotStart < bookingEnd) ||
              (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
              (slotStart <= bookingStart && slotEnd >= bookingEnd)
            );
          });
          
          slots.push({
            startTime: slotStart,
            endTime: slotEnd,
            available: isAvailable
          });
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return Result.success(slots);
    } catch (error) {
      console.error('Error getting available time slots:', error);
      return Result.databaseError(
        this.localizationService.translate('errors:availabilityCheckFailed')
      );
    }
  }
  
  async getBookingsByUserId(userId: string): Promise<Result<Booking[]>> {
    try {
      const filters = { userId };
      const result = await this.databaseClient.getMany(this.tableName, { filters });
      
      if (result.isFailure) {
        return Result.databaseError(
          this.localizationService.translate('errors:bookingsGetFailed'),
          result.error
        );
      }
      
      return Result.success(result.value.map(booking => this.mapToDomainModel(booking)));
    } catch (error) {
      console.error(`Error getting bookings for user ${userId}:`, error);
      return Result.databaseError(
        this.localizationService.translate('errors:bookingsGetFailed')
      );
    }
  }
  
  async getBookingsByFacilityId(facilityId: string): Promise<Result<Booking[]>> {
    try {
      const filters = { facilityId };
      const result = await this.databaseClient.getMany(this.tableName, { filters });
      
      if (result.isFailure) {
        return Result.databaseError(
          this.localizationService.translate('errors:bookingsGetFailed'),
          result.error
        );
      }
      
      return Result.success(result.value.map(booking => this.mapToDomainModel(booking)));
    } catch (error) {
      console.error(`Error getting bookings for facility ${facilityId}:`, error);
      return Result.databaseError(
        this.localizationService.translate('errors:bookingsGetFailed')
      );
    }
  }
  
  /**
   * Maps a domain model to a database model
   * Following Single Responsibility Principle by isolating data transformation logic
   */
  private mapToDbModel(booking: CreateBookingRequest | UpdateBookingRequest): any {
    // Base properties that exist in both types
    const baseProps: any = {};
    
    // Handle properties that might exist in either request type
    if ('startTime' in booking && booking.startTime !== undefined) {
      baseProps.start_time = booking.startTime;
    }
    
    if ('endTime' in booking && booking.endTime !== undefined) {
      baseProps.end_time = booking.endTime;
    }
    
    if ('status' in booking && booking.status !== undefined) {
      baseProps.status = booking.status;
    } else if ('status' in booking === false) {
      // For CreateBookingRequest, set default status
      baseProps.status = BookingStatus.PENDING;
    }
    
    if ('recurrenceRule' in booking && booking.recurrenceRule !== undefined) {
      baseProps.recurrence_rule = booking.recurrenceRule;
    }
    
    if ('purpose' in booking && booking.purpose !== undefined) {
      baseProps.purpose = booking.purpose;
    }
    
    if ('attendees' in booking && booking.attendees !== undefined) {
      baseProps.attendees = booking.attendees;
    }
    
    if ('notes' in booking && booking.notes !== undefined) {
      baseProps.notes = booking.notes;
    }
    
    // Handle CreateBookingRequest specific fields
    if ('facilityId' in booking && booking.facilityId !== undefined) {
      baseProps.facility_id = booking.facilityId;
    }
    
    if ('userId' in booking && booking.userId !== undefined) {
      baseProps.user_id = booking.userId;
    }
    
    return baseProps;
  }
  
  /**
   * Maps a database model to a domain model
   * Following Single Responsibility Principle by isolating data transformation logic
   */
  private mapToDomainModel(data: any): Booking {
    return {
      id: data.id,
      facilityId: data.facility_id,
      userId: data.user_id,
      startTime: new Date(data.start_time),
      endTime: new Date(data.end_time),
      status: data.status as BookingStatus,
      recurrenceRule: data.recurrence_rule,
      purpose: data.purpose,
      attendees: data.attendees,
      notes: data.notes,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
  
  /**
   * Maps domain filters to database filters
   * Following Single Responsibility Principle by isolating filter transformation logic
   */
  private mapFiltersToDbFilters(filters: BookingFilters): any {
    const result: any = {};
    
    if (filters.facilityId) {
      result.facility_id = filters.facilityId;
    }
    
    if (filters.userId) {
      result.user_id = filters.userId;
    }
    
    // Handle date filters
    if (filters.startDate) {
      result.start_time = { gte: filters.startDate };
    }
    
    if (filters.endDate) {
      result.end_time = { lte: filters.endDate };
    }
    
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        result.status = { in: filters.status };
      } else {
        result.status = filters.status;
      }
    }
    
    // Handle date range filtering
    if (filters.startDate || filters.endDate) {
      const dateFilters: Record<string, any> = {};
      
      if (filters.startDate) {
        dateFilters.gte = filters.startDate;
      }
      
      if (filters.endDate) {
        dateFilters.lte = filters.endDate;
      }
      
      result.start_time = dateFilters;
    }
    
    return result;
  }
}
