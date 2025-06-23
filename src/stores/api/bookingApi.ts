import { supabase } from '@/lib/supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';
import { GenericApi } from '@/types/api';
import { Booking, BookingCreateRequest, BookingUpdateRequest, BookingFilters, EventType } from '@/types/models';
import { PaginationParams, QueryResult } from '@/types/api';
import { BaseRepository } from '@/dal/BaseRepository';

/**
 * BookingApi provides methods for interacting with the bookings table in Supabase
 * Implements the GenericApi interface for consistent CRUD operations
 */
export class BookingApi implements GenericApi<Booking> {
  private repository: BaseRepository<Booking>;

  constructor() {
    this.repository = new BaseRepository<Booking>('bookings');
  }

  /**
   * Fetch a paginated list of bookings with optional filters
   * @param params Pagination parameters
   * @param filters Optional booking filters
   */
  async fetchList(
    params: PaginationParams,
    filters?: BookingFilters
  ): Promise<QueryResult<Booking>> {
    try {
      let query = supabase
        .from('bookings')
        .select('*, zones(*), facilities(*), users!bookings_user_id_fkey(*)', { count: 'exact' });

      // Apply filters if provided
      if (filters) {
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        }
        if (filters.facilityId) {
          query = query.eq('facility_id', filters.facilityId);
        }
        if (filters.zoneId) {
          query = query.eq('zone_id', filters.zoneId);
        }
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        if (filters.startDate) {
          query = query.gte('start_time', filters.startDate.toISOString());
        }
        if (filters.endDate) {
          query = query.lte('end_time', filters.endDate.toISOString());
        }
        if (filters.eventType) {
          query = query.eq('event_type', filters.eventType);
        }
        if (filters.search) {
          query = query.or(`purpose.ilike.%${filters.search}%,id.eq.${filters.search}`);
        }
      }

      // Apply pagination
      const { from, to } = this.calculatePaginationRange(params);
      query = query.range(from, to);

      // Apply ordering
      const orderColumn = params.orderBy || 'created_at';
      const orderDirection = params.orderDirection || 'desc';
      query = query.order(orderColumn, { ascending: orderDirection === 'asc' });

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        items: data as Booking[],
        total: count || 0,
        page: params.page,
        limit: params.limit
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  /**
   * Fetch a single booking by ID
   * @param id Booking ID
   */
  async fetchById(id: string): Promise<Booking> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, zones(*), facilities(*), users!bookings_user_id_fkey(*)')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as Booking;
    } catch (error) {
      console.error(`Error fetching booking with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new booking
   * @param booking Booking data to create
   */
  async create(booking: BookingCreateRequest): Promise<Booking> {
    try {
      // First check for conflicts
      const hasConflicts = await this.checkForConflicts(
        booking.zone_id,
        new Date(booking.start_time),
        new Date(booking.end_time)
      );

      if (hasConflicts) {
        throw new Error('Booking conflicts with existing bookings');
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            ...booking,
            status: booking.status || 'pending',
            created_at: new Date().toISOString()
          }
        ])
        .select('*, zones(*), facilities(*)')
        .single();

      if (error) {
        throw error;
      }

      return data as Booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  /**
   * Update an existing booking
   * @param id Booking ID
   * @param booking Updated booking data
   */
  async update(id: string, booking: BookingUpdateRequest): Promise<Booking> {
    try {
      // Check for conflicts if time is being changed
      if (booking.start_time && booking.end_time) {
        const currentBooking = await this.fetchById(id);
        
        // Only check conflicts if the time is actually changing
        if (
          currentBooking.start_time !== booking.start_time ||
          currentBooking.end_time !== booking.end_time
        ) {
          const hasConflicts = await this.checkForConflicts(
            booking.zone_id || currentBooking.zone_id,
            new Date(booking.start_time),
            new Date(booking.end_time),
            id // Exclude current booking from conflict check
          );

          if (hasConflicts) {
            throw new Error('Updated booking time conflicts with existing bookings');
          }
        }
      }

      const { data, error } = await supabase
        .from('bookings')
        .update({
          ...booking,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*, zones(*), facilities(*)')
        .single();

      if (error) {
        throw error;
      }

      return data as Booking;
    } catch (error) {
      console.error(`Error updating booking with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a booking
   * @param id Booking ID
   */
  async remove(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Error deleting booking with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Check for booking conflicts in a specific time range
   * @param zoneId Zone ID to check
   * @param startTime Start time to check
   * @param endTime End time to check
   * @param excludeBookingId Optional booking ID to exclude from conflict check
   */
  async checkForConflicts(
    zoneId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
  ): Promise<boolean> {
    try {
      let query = supabase
        .from('bookings')
        .select('id')
        .eq('zone_id', zoneId)
        .eq('status', 'approved') // Only check against approved bookings
        .or(`start_time.lt.${endTime.toISOString()},end_time.gt.${startTime.toISOString()}`);

      // Exclude the current booking if updating
      if (excludeBookingId) {
        query = query.neq('id', excludeBookingId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking for booking conflicts:', error);
      throw error;
    }
  }

  /**
   * Get all bookings for a specific user
   * @param userId User ID
   * @param params Pagination parameters
   */
  async getUserBookings(
    userId: string,
    params: PaginationParams = { page: 1, limit: 10 }
  ): Promise<QueryResult<Booking>> {
    return this.fetchList(params, { userId });
  }

  /**
   * Get all bookings for a specific facility
   * @param facilityId Facility ID
   * @param params Pagination parameters
   */
  async getFacilityBookings(
    facilityId: string,
    params: PaginationParams = { page: 1, limit: 10 }
  ): Promise<QueryResult<Booking>> {
    return this.fetchList(params, { facilityId });
  }

  /**
   * Get all bookings for a specific zone
   * @param zoneId Zone ID
   * @param params Pagination parameters
   */
  async getZoneBookings(
    zoneId: string,
    params: PaginationParams = { page: 1, limit: 10 }
  ): Promise<QueryResult<Booking>> {
    return this.fetchList(params, { zoneId });
  }

  /**
   * Get all bookings within a date range
   * @param startDate Start date
   * @param endDate End date
   * @param params Pagination parameters
   */
  async getBookingsInDateRange(
    startDate: Date,
    endDate: Date,
    params: PaginationParams = { page: 1, limit: 10 }
  ): Promise<QueryResult<Booking>> {
    return this.fetchList(params, { startDate, endDate });
  }

  /**
   * Approve a booking
   * @param id Booking ID
   * @param adminNotes Optional admin notes
   */
  async approveBooking(id: string, adminNotes?: string): Promise<Booking> {
    return this.update(id, {
      status: 'approved',
      admin_notes: adminNotes,
      approved_at: new Date().toISOString()
    });
  }

  /**
   * Reject a booking
   * @param id Booking ID
   * @param reason Rejection reason
   */
  async rejectBooking(id: string, reason: string): Promise<Booking> {
    return this.update(id, {
      status: 'rejected',
      admin_notes: reason,
      rejected_at: new Date().toISOString()
    });
  }

  /**
   * Cancel a booking
   * @param id Booking ID
   * @param reason Cancellation reason
   */
  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    return this.update(id, {
      status: 'cancelled',
      cancellation_reason: reason,
      cancelled_at: new Date().toISOString()
    });
  }

  /**
   * Check in a booking (mark as attended)
   * @param id Booking ID
   */
  async checkInBooking(id: string): Promise<Booking> {
    return this.update(id, {
      status: 'attended',
      attended_at: new Date().toISOString()
    });
  }

  /**
   * Create a recurring booking based on a pattern
   * @param baseBooking Base booking data
   * @param recurrencePattern Recurrence pattern
   */
  async createRecurringBooking(
    baseBooking: BookingCreateRequest,
    recurrencePattern: {
      frequency: 'daily' | 'weekly' | 'monthly';
      interval: number;
      occurrences: number;
      weekdays?: number[];
    }
  ): Promise<Booking[]> {
    try {
      const bookings: Booking[] = [];
      const baseStartTime = new Date(baseBooking.start_time);
      const baseEndTime = new Date(baseBooking.end_time);
      const durationMs = baseEndTime.getTime() - baseStartTime.getTime();

      // Generate dates based on recurrence pattern
      const dates: Date[] = [];
      let currentDate = new Date(baseStartTime);
      
      for (let i = 0; i < recurrencePattern.occurrences; i++) {
        dates.push(new Date(currentDate));
        
        // Calculate next date based on frequency
        switch (recurrencePattern.frequency) {
          case 'daily':
            currentDate.setDate(currentDate.getDate() + recurrencePattern.interval);
            break;
          case 'weekly':
            currentDate.setDate(currentDate.getDate() + (7 * recurrencePattern.interval));
            break;
          case 'monthly':
            currentDate.setMonth(currentDate.getMonth() + recurrencePattern.interval);
            break;
        }
      }

      // Create bookings for each date
      for (const date of dates) {
        const startTime = new Date(date);
        const endTime = new Date(startTime.getTime() + durationMs);
        
        const bookingData: BookingCreateRequest = {
          ...baseBooking,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          is_recurring: true,
          recurrence_group_id: baseBooking.recurrence_group_id || crypto.randomUUID()
        };
        
        try {
          const booking = await this.create(bookingData);
          bookings.push(booking);
        } catch (error) {
          console.error(`Failed to create recurring booking for date ${date}:`, error);
          // Continue with other dates even if one fails
        }
      }

      return bookings;
    } catch (error) {
      console.error('Error creating recurring bookings:', error);
      throw error;
    }
  }

  /**
   * Calculate pagination range from page and limit
   * @param params Pagination parameters
   */
  private calculatePaginationRange(params: PaginationParams): { from: number; to: number } {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    return { from, to };
  }
}