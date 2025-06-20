
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';

export interface EnhancedBooking {
  id: string;
  facility_id: number;
  zone_id?: string;
  user_id: string;
  organization_id?: string;
  booking_reference: string;
  status: 'draft' | 'pending-approval' | 'approved' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'rejected' | 'no-show';
  type: 'engangs' | 'fastlan' | 'rammetid' | 'strotimer';
  actor_type: 'lag-foreninger' | 'paraply' | 'private-firma' | 'kommunale-enheter' | 'private-person';
  purpose: string;
  event_type: 'training' | 'competition' | 'meeting' | 'celebration' | 'course' | 'conference' | 'performance' | 'exhibition' | 'drop-in' | 'other';
  expected_attendees: number;
  age_group: 'children' | 'youth' | 'adults' | 'seniors' | 'mixed' | 'family';
  description?: string;
  special_requirements?: string;
  start_date: string;
  end_date: string;
  duration_minutes: number;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  requires_approval: boolean;
  approval_status: 'not-required' | 'pending' | 'in-review' | 'approved' | 'rejected' | 'escalated';
  base_price: number;
  services_price: number;
  total_price: number;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export interface BookingFilters {
  status?: string;
  type?: string;
  actor_type?: string;
  facility_id?: number;
  start_date?: string;
  end_date?: string;
  organization_id?: string;
}

export class EnhancedBookingService {
  static async getBookings(
    pagination?: PaginationParams,
    filters?: BookingFilters
  ): Promise<ApiResponse<PaginatedResponse<EnhancedBooking>>> {
    try {
      let query = supabase
        .from('bookings')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters?.actor_type) {
        query = query.eq('actor_type', filters.actor_type);
      }
      
      if (filters?.facility_id) {
        query = query.eq('facility_id', filters.facility_id);
      }
      
      if (filters?.organization_id) {
        query = query.eq('organization_id', filters.organization_id);
      }
      
      if (filters?.start_date) {
        query = query.gte('start_date', filters.start_date);
      }
      
      if (filters?.end_date) {
        query = query.lte('end_date', filters.end_date);
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);
      }

      // Order by creation date (newest first)
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch bookings',
            details: error
          }
        };
      }

      const totalPages = pagination ? Math.ceil((count || 0) / pagination.limit) : 1;

      return {
        success: true,
        data: {
          data: data || [],
          pagination: {
            page: pagination?.page || 1,
            limit: pagination?.limit || data?.length || 0,
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
          message: 'Failed to fetch bookings',
          details: error
        }
      };
    }
  }

  static async getBookingById(id: string): Promise<ApiResponse<EnhancedBooking>> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch booking',
            details: error
          }
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch booking',
          details: error
        }
      };
    }
  }

  static async createBooking(
    bookingData: Omit<EnhancedBooking, 'id' | 'booking_reference' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<EnhancedBooking>> {
    try {
      // Generate booking reference
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      const booking_reference = `BK-${timestamp}-${random}`.toUpperCase();

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          booking_reference
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to create booking',
            details: error
          }
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to create booking',
          details: error
        }
      };
    }
  }

  static async updateBooking(
    id: string,
    updates: Partial<EnhancedBooking>
  ): Promise<ApiResponse<EnhancedBooking>> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to update booking',
            details: error
          }
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to update booking',
          details: error
        }
      };
    }
  }

  static async cancelBooking(
    id: string,
    reason?: string
  ): Promise<ApiResponse<EnhancedBooking>> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to cancel booking',
            details: error
          }
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to cancel booking',
          details: error
        }
      };
    }
  }

  static async getUserBookings(
    userId?: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<EnhancedBooking>>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;

      if (!targetUserId) {
        return {
          success: false,
          error: {
            message: 'User not authenticated',
            code: 'UNAUTHENTICATED'
          }
        };
      }

      return this.getBookings(pagination, { 
        // No additional filters here since RLS will handle access control
      });
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch user bookings',
          details: error
        }
      };
    }
  }
}
