import { IBookingRepository } from '@/dal/interfaces/booking/IBookingRepository';
import { PaginationParams, RepositoryResponse } from '@/types/api';
import { Booking, BookingCreateRequest, BookingFilters, BookingUpdateRequest } from '@/types/booking';
import { BookingConflictResult } from '@/types/booking/bookingConflict';
import { mapCreateRequestToDTO, mapToDomain, mapToDTO, mapUpdateRequestToDTO } from '@/types/db/bookingDTO';
import { supabaseClient } from '@/supabase/client';

/**
 * Repository implementation for booking operations
 * Follows Single Responsibility Principle by focusing only on booking operations
 * Follows Interface Segregation Principle by implementing focused IBookingRepository
 */
export class BookingRepository implements IBookingRepository {
  protected tableName = 'bookings';
  protected client;

  constructor(client = supabaseClient) {
    this.client = client;
  }
  
  /**
   * Get a booking by its ID
   * @param id The booking ID
   */
  async getById(id: string): Promise<RepositoryResponse<Booking | null>> {
    try {
      const { data, error } = await this.client
        .from(this.tableName as any)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data as Booking || null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  /**
   * Get bookings with pagination and filtering
   * @param pagination Pagination parameters
   * @param filters Optional filters to apply
   */
  async findAllWithFilters(
    pagination?: PaginationParams,
    filters?: BookingFilters
  ): Promise<RepositoryResponse<Booking[]>> {
    try {
      let query = this.client.from(this.tableName as any).select('*');

      // Apply filters
      if (filters?.facilityId) {
        query = query.eq('facility_id', filters.facilityId);
      }
      if (filters?.zoneId) {
        query = query.eq('zone_id', filters.zoneId);
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters?.organizationId) {
        query = query.eq('organization_id', filters.organizationId);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.eventType) {
        query = query.eq('event_type', filters.eventType);
      }
      if (filters?.startDate) {
        query = query.gte('start_date', filters.startDate.toISOString());
      }
      if (filters?.endDate) {
        query = query.lte('start_date', filters.endDate.toISOString());
      }
      if (filters?.requiresApproval !== undefined) {
        query = query.eq('requires_approval', filters.requiresApproval);
      }
      if (filters?.approvalStatus) {
        query = query.eq('approval_status', filters.approvalStatus);
      }

      // Apply search
      if (filters?.searchTerm && filters.searchTerm.trim() !== "") {
        query = query.or(`purpose.ilike.%${filters.searchTerm}%,contact_name.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }

      // Apply pagination
      if (pagination) {
        if (pagination.page && pagination.pageSize) {
          const from = (pagination.page - 1) * pagination.pageSize;
          const to = from + pagination.pageSize - 1;
          query = query.range(from, to);
        }
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      return {
        data: (data as unknown as Booking[]) || []
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  /**
   * Get bookings for a specific facility
   * @param facilityId The facility ID
   */
  async getBookingsByFacility(facilityId: string): Promise<RepositoryResponse<Booking[]>> {
    return this.findAllWithFilters(undefined, { facilityId });
  }

  /**
   * Get bookings for a specific zone
   * @param zoneId The zone ID
   */
  async getBookingsByZone(zoneId: string): Promise<RepositoryResponse<Booking[]>> {
    return this.findAllWithFilters(undefined, { zoneId });
  }

  /**
   * Check for booking conflicts
   * @param zoneId The zone ID
   * @param startDate Start date and time
   * @param endDate End date and time
   * @param excludeBookingId Optional booking ID to exclude from conflict check
   */
  async checkBookingConflicts(
    zoneId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string
  ): Promise<RepositoryResponse<BookingConflictResult>> {
    try {
      // Query for conflicting bookings
      let query = this.client
        .from(this.tableName as any)
        .select('*')
        .eq('zone_id', zoneId)
        .lt('start_date', endDate.toISOString())
        .gt('end_date', startDate.toISOString())
        .in('status', ['pending-approval', 'approved', 'confirmed', 'in-progress']);

      // Exclude the current booking if provided
      if (excludeBookingId) {
        query = query.neq('id', excludeBookingId);
      }

      const { data: conflictingBookingsData, error } = await query;

      if (error) throw error;

      // Transform data to match Booking interface
      const conflictingBookings = conflictingBookingsData.map((booking: any) => 
        mapToDomain(booking)
      );

      // Create a strongly typed BookingConflictResult
      const conflictResult: BookingConflictResult = {
        hasConflict: conflictingBookings.length > 0,
        conflictingBookings,
        availableAlternatives: [] // Would be populated in a real system
      };

      return { data: conflictResult };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Creates a new booking
   * @param data Booking data
   * @returns RepositoryResponse with created booking or error
   */
  async create(data: BookingCreateRequest): Promise<RepositoryResponse<Booking>> {
    try {
      // Transform data to DTO for database insertion
      const insertData = mapCreateRequestToDTO(data);

      const { data: createdBooking, error } = await this.client
        .from(this.tableName as any)
        .insert([insertData])
        .select('*')
        .single();

      if (error) throw error;

      // Transform response to match Booking interface
      const booking = mapToDomain(createdBooking);

      return { data: booking };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Updates an existing booking
   * @param id Booking ID
   * @param data Updated booking data
   * @returns RepositoryResponse with updated booking or error
   */
  async update(id: string, data: BookingUpdateRequest): Promise<RepositoryResponse<Booking>> {
    try {
      // Transform data for database update using our mapping function
      const updateData = mapUpdateRequestToDTO(data);

      const { data: updatedBooking, error } = await this.client
        .from(this.tableName as any)
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      // Transform response to match Booking interface
      const booking = mapToDomain(updatedBooking);

      return { data: booking };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  /**
   * Delete a booking by its ID
   * @param id The booking ID
   */
  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    try {
      const { error } = await this.client
        .from(this.tableName as any)
        .delete()
        .eq('id', id);

      if (error) {
        return {
          data: false,
          error: error.message
        };
      }

      return {
        data: true
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
export const bookingRepository = new BookingRepository();
