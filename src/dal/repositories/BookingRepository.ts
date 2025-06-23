import { SupabaseRepository } from '../SupabaseRepository';
import { Booking } from '@/types/booking';
import { RepositoryResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

interface BookingCreateRequest {
  facility_id: number;
  zone_id: number;
  start_time: string;
  end_time: string;
  user_id: string;
  status: string;
  total_price: number;
  additional_notes?: string;
}

interface BookingUpdateRequest extends Partial<BookingCreateRequest> {
  status?: string;
  total_price?: number;
}

export class BookingRepository extends SupabaseRepository<Booking> {
  protected tableName = 'bookings';

  constructor() {
    super();
  }

  async getAllBookings(filters?: any): Promise<RepositoryResponse<Booking[]>> {
    try {
      let query = supabase.from('bookings').select('*');
      
      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined) {
            query = query.eq(key, filters[key]);
          }
        });
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      return {
        data: data || [],
        error: null
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async getBookingById(id: string): Promise<RepositoryResponse<Booking | null>> {
    try {
      const { data, error } = await supabase
        .from('bookings')
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
        data: data as Booking | null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async createBooking(bookingData: BookingCreateRequest): Promise<RepositoryResponse<Booking | null>> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data as Booking | null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async updateBooking(id: string, bookingData: BookingUpdateRequest): Promise<RepositoryResponse<Booking | null>> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data as Booking | null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async deleteBooking(id: string): Promise<RepositoryResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        return {
          data: false,
          error: error.message
        };
      }

      return {
        data: true,
        error: null
      };
    } catch (error: any) {
      return {
        data: false,
        error: error.message
      };
    }
  }

  async checkBookingConflicts(bookingData: any): Promise<RepositoryResponse<{
    hasConflict: boolean;
    conflictingBookings: Booking[];
    availableAlternatives: any[];
  }>> {
    try {
      // Extract relevant data from bookingData
      const { facility_id, zone_id, start_time, end_time } = bookingData;
  
      // Construct the conflict query
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('facility_id', facility_id)
        .eq('zone_id', zone_id)
        .lte('start_time', end_time)
        .gte('end_time', start_time);
  
      if (error) {
        return {
          data: {
            hasConflict: true,
            conflictingBookings: [],
            availableAlternatives: []
          },
          error: error.message
        };
      }
  
      const conflictingBookings = data as Booking[];
      const hasConflict = conflictingBookings.length > 0;
  
      return {
        data: {
          hasConflict: false,
          conflictingBookings: [],
          availableAlternatives: []
        },
        error: null
      };
    } catch (error: any) {
      return {
        data: {
          hasConflict: false,
          conflictingBookings: [],
          availableAlternatives: []
        },
        error: error.message
      };
    }
  }
}
