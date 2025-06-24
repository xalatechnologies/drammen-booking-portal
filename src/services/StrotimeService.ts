import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export interface StrotimeSlot {
  id: string;
  facility_id: number;
  zone_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: 30 | 60;
  price_per_slot: number;
  max_participants: number;
  current_participants: number;
  is_available: boolean;
  published_at: string;
  published_by: string;
  released_from_rammetid: boolean;
  original_booking_id?: string;
  created_at: string;
}

export interface StrotimeBooking {
  id: string;
  strotime_slot_id: string;
  user_id?: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  participants: number;
  special_requirements?: string;
  status: 'confirmed' | 'cancelled' | 'no-show';
  booked_at: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  payment_status: string;
  total_price: number;
}

export interface StrotimeFilters {
  facility_id?: number;
  zone_id?: string;
  date?: string;
  start_date?: string;
  end_date?: string;
  is_available?: boolean;
}

export class StrotimeService {
  static async getAvailableSlots(
    pagination?: PaginationParams,
    filters?: StrotimeFilters
  ): Promise<ApiResponse<PaginatedResponse<StrotimeSlot>>> {
    try {
      let query = supabase
        .from('strotime_slots')
        .select('*', { count: 'exact' })
        .eq('is_available', true)
        .gte('slot_date', new Date().toISOString().split('T')[0]); // Only future slots

      // Apply filters
      if (filters?.facility_id) {
        query = query.eq('facility_id', filters.facility_id);
      }
      
      if (filters?.zone_id) {
        query = query.eq('zone_id', filters.zone_id);
      }
      
      if (filters?.date) {
        query = query.eq('slot_date', filters.date);
      }
      
      if (filters?.start_date) {
        query = query.gte('slot_date', filters.start_date);
      }
      
      if (filters?.end_date) {
        query = query.lte('slot_date', filters.end_date);
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);
      }

      // Order by date and time
      query = query.order('slot_date', { ascending: true })
                   .order('start_time', { ascending: true });

      const { data, error, count } = await query;

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch strotime slots',
            details: error
          }
        };
      }

      // Transform database response to match interface
      const transformedData = (data || []).map(slot => ({
        ...slot,
        duration_minutes: slot.duration_minutes as 30 | 60
      }));

      const totalPages = pagination ? Math.ceil((count || 0) / pagination.limit) : 1;

      return {
        success: true,
        data: {
          data: transformedData,
          pagination: {
            page: pagination?.page || 1,
            limit: pagination?.limit || transformedData.length || 0,
            total: count || 0,
            totalPages,
            hasNext: pagination ? pagination.page < totalPages : false,
            hasPrev: pagination ? pagination.page > 1 : false
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch strotime slots',
          details: error
        }
      };
    }
  }

  // Alias method for backward compatibility
  static async getAvailableStrøtimer(filters: { 
    facilityId?: string; 
    startDate?: Date; 
    endDate?: Date; 
  }): Promise<ApiResponse<StrotimeSlot[]>> {
    const strotimeFilters: StrotimeFilters = {
      facility_id: filters.facilityId ? parseInt(filters.facilityId) : undefined,
      start_date: filters.startDate?.toISOString().split('T')[0],
      end_date: filters.endDate?.toISOString().split('T')[0]
    };

    const result = await this.getAvailableSlots(undefined, strotimeFilters);
    
    if (result.success) {
      return {
        success: true,
        data: result.data.data
      };
    }
    
    return {
      success: false,
      error: result.error
    };
  }

  static async bookStrotimeSlot(
    slotId: string,
    bookingData: Omit<StrotimeBooking, 'id' | 'strotime_slot_id' | 'booked_at' | 'status'>
  ): Promise<ApiResponse<StrotimeBooking>> {
    try {
      // First check if slot is still available
      const { data: slot, error: slotError } = await supabase
        .from('strotime_slots')
        .select('*')
        .eq('id', slotId)
        .eq('is_available', true)
        .single();

      if (slotError || !slot) {
        return {
          success: false,
          error: {
            message: 'Slot not available'
          }
        };
      }

      // Check capacity
      if (slot.current_participants + bookingData.participants > slot.max_participants) {
        return {
          success: false,
          error: {
            message: 'Not enough capacity'
          }
        };
      }

      // Create the booking
      const { data, error } = await supabase
        .from('strotime_bookings')
        .insert({
          ...bookingData,
          strotime_slot_id: slotId,
          status: 'confirmed',
          total_price: slot.price_per_slot * bookingData.participants
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to book strotime slot',
            details: error
          }
        };
      }

      return {
        success: true,
        data: {
          ...data,
          status: data.status as 'confirmed' | 'cancelled' | 'no-show'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to book strotime slot',
          details: error
        }
      };
    }
  }

  // Alias method for backward compatibility
  static async bookStrøtime(
    slotId: string, 
    formData: { name: string; email: string; phone: string }
  ): Promise<ApiResponse<StrotimeBooking>> {
    const bookingData = {
      contact_name: formData.name,
      contact_email: formData.email,
      contact_phone: formData.phone,
      participants: 1,
      payment_status: 'pending',
      total_price: 0 // Will be calculated in bookStrotimeSlot
    };

    return this.bookStrotimeSlot(slotId, bookingData);
  }

  static async getUserStrotimeBookings(
    userId?: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<StrotimeBooking>>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;

      let query = supabase
        .from('strotime_bookings')
        .select('*', { count: 'exact' });

      if (targetUserId) {
        query = query.eq('user_id', targetUserId);
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);
      }

      // Order by booking date (newest first)
      query = query.order('booked_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch strotime bookings',
            details: error
          }
        };
      }

      // Transform database response to match interface
      const transformedData = (data || []).map(booking => ({
        ...booking,
        status: booking.status as 'confirmed' | 'cancelled' | 'no-show'
      }));

      const totalPages = pagination ? Math.ceil((count || 0) / pagination.limit) : 1;

      return {
        success: true,
        data: {
          data: transformedData,
          pagination: {
            page: pagination?.page || 1,
            limit: pagination?.limit || transformedData.length || 0,
            total: count || 0,
            totalPages,
            hasNext: pagination ? pagination.page < totalPages : false,
            hasPrev: pagination ? pagination.page > 1 : false
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch strotime bookings',
          details: error
        }
      };
    }
  }

  static async cancelStrotimeBooking(
    bookingId: string,
    reason?: string
  ): Promise<ApiResponse<StrotimeBooking>> {
    try {
      const { data, error } = await supabase
        .from('strotime_bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason
        })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to cancel strotime booking',
            details: error
          }
        };
      }

      return {
        success: true,
        data: {
          ...data,
          status: data.status as 'confirmed' | 'cancelled' | 'no-show'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to cancel strotime booking',
          details: error
        }
      };
    }
  }
}
