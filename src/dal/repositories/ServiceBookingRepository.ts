
import { SupabaseRepository } from '../SupabaseRepository';
import { ServiceBooking, ServiceBookingStatus } from '@/types/additionalServices';
import { PaginationParams, RepositoryResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

interface ServiceBookingFilters {
  bookingId?: string;
  serviceId?: string;
  status?: ServiceBookingStatus;
  startDate?: Date;
  endDate?: Date;
}

interface ServiceBookingCreateRequest {
  booking_id: string;
  service_id: string;
  quantity: number;
  start_time?: Date;
  end_time?: Date;
  special_instructions?: string;
  unit_price: number;
  total_price: number;
}

interface ServiceBookingUpdateRequest extends Partial<ServiceBookingCreateRequest> {
  status?: ServiceBookingStatus;
}

export class ServiceBookingRepository extends SupabaseRepository<ServiceBooking> {
  protected tableName = 'service_bookings';

  constructor() {
    super();
  }

  async findAll(
    pagination?: PaginationParams,
    filters?: ServiceBookingFilters
  ): Promise<RepositoryResponse<ServiceBooking[]>> {
    try {
      let query = supabase.from(this.tableName).select('*');

      // Apply filters
      if (filters?.bookingId) {
        query = query.eq('booking_id', filters.bookingId);
      }
      if (filters?.serviceId) {
        query = query.eq('service_id', filters.serviceId);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.startDate) {
        query = query.gte('start_time', filters.startDate.toISOString());
      }
      if (filters?.endDate) {
        query = query.lte('start_time', filters.endDate.toISOString());
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      return {
        data: (data as ServiceBooking[]) || []
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async getServiceBookingsByBooking(bookingId: string): Promise<RepositoryResponse<ServiceBooking[]>> {
    return this.findAll(undefined, { bookingId });
  }

  async updateServiceBookingStatus(
    serviceBookingId: string,
    status: ServiceBookingStatus
  ): Promise<RepositoryResponse<ServiceBooking | null>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceBookingId)
        .select()
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data as ServiceBooking | null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }
}
