import { SupabaseRepository } from '../SupabaseRepository';
import { ServiceBooking } from '@/types/serviceBooking';
import { RepositoryResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

export class ServiceBookingRepository extends SupabaseRepository<ServiceBooking> {
  protected tableName = 'service_bookings';

  constructor() {
    super();
  }

  async getAllServiceBookings(bookingId?: string): Promise<RepositoryResponse<ServiceBooking[]>> {
    try {
      let query = supabase.from('service_bookings').select('*');
      
      if (bookingId) {
        query = query.eq('booking_id', bookingId);
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

  async createServiceBooking(serviceBookingData: Omit<ServiceBooking, 'id' | 'created_at'>): Promise<RepositoryResponse<ServiceBooking | null>> {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .insert(serviceBookingData)
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data || null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async updateServiceBooking(id: string, updates: Partial<ServiceBooking>): Promise<RepositoryResponse<ServiceBooking | null>> {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data || null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async deleteServiceBooking(id: string): Promise<RepositoryResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('service_bookings')
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

  async getServiceBookingById(id: string): Promise<RepositoryResponse<ServiceBooking | null>> {
    try {
      const { data, error } = await supabase
        .from('service_bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data || null,
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const serviceBookingRepository = new ServiceBookingRepository();
