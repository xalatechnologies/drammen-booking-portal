
import { SupabaseRepository } from '../SupabaseRepository';
import { Booking, BookingFilters, BookingCreateRequest, BookingUpdateRequest } from '@/types/booking';
import { PaginationParams, RepositoryResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

export class BookingRepository extends SupabaseRepository<Booking> {
  protected tableName = 'bookings';

  constructor() {
    super();
  }

  // Rename to avoid signature conflict with parent class
  async findAllWithFilters(
    pagination?: PaginationParams,
    filters?: BookingFilters
  ): Promise<RepositoryResponse<Booking[]>> {
    try {
      let query = supabase.from(this.tableName as any).select('*');

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
        data: (data as unknown as Booking[]) || []
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  // Simplified query methods
  async getBookingsByFacility(facilityId: string): Promise<RepositoryResponse<Booking[]>> {
    return this.findAllWithFilters(undefined, { facilityId });
  }

  async getBookingsByZone(zoneId: string): Promise<RepositoryResponse<Booking[]>> {
    return this.findAllWithFilters(undefined, { zoneId });
  }

  // Add the missing checkBookingConflicts method
  async checkBookingConflicts(
    zoneId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string
  ): Promise<RepositoryResponse<{ hasConflict: boolean; conflictingBookings: Booking[]; availableAlternatives: any[] }>> {
    try {
      let query = supabase
        .from(this.tableName as any)
        .select('*')
        .eq('zone_id', zoneId)
        .neq('status', 'cancelled')
        .or(`start_date.lte.${endDate.toISOString()},end_date.gte.${startDate.toISOString()}`);

      if (excludeBookingId) {
        query = query.neq('id', excludeBookingId);
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: { hasConflict: false, conflictingBookings: [], availableAlternatives: [] },
          error: error.message
        };
      }

      const conflictingBookings = (data as unknown as Booking[]) || [];
      const hasConflict = conflictingBookings.length > 0;

      return {
        data: {
          hasConflict,
          conflictingBookings,
          availableAlternatives: [] // Would implement alternative time slot suggestions here
        }
      };
    } catch (error: any) {
      return {
        data: { hasConflict: false, conflictingBookings: [], availableAlternatives: [] },
        error: error.message
      };
    }
  }
}
