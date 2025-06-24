
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
    // Mock implementation since strotime_slots table doesn't exist
    return {
      success: true,
      data: {
        data: [],
        pagination: {
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    };
  }

  // Alias method for backward compatibility
  static async getAvailableStrøtimer(filters: { 
    facilityId?: string; 
    startDate?: Date; 
    endDate?: Date; 
  }): Promise<ApiResponse<StrotimeSlot[]>> {
    // Mock implementation
    return {
      success: true,
      data: []
    };
  }

  static async bookStrotimeSlot(
    slotId: string,
    bookingData: Omit<StrotimeBooking, 'id' | 'strotime_slot_id' | 'booked_at' | 'status'>
  ): Promise<ApiResponse<StrotimeBooking>> {
    // Mock implementation
    return {
      success: false,
      error: {
        message: 'Strotime booking not implemented yet'
      }
    };
  }

  // Alias method for backward compatibility
  static async bookStrøtime(
    slotId: string, 
    formData: { name: string; email: string; phone: string }
  ): Promise<ApiResponse<StrotimeBooking>> {
    // Mock implementation
    return {
      success: false,
      error: {
        message: 'Strotime booking not implemented yet'
      }
    };
  }

  static async getUserStrotimeBookings(
    userId?: string,
    pagination?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<StrotimeBooking>>> {
    // Mock implementation
    return {
      success: true,
      data: {
        data: [],
        pagination: {
          page: pagination?.page || 1,
          limit: pagination?.limit || 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    };
  }

  static async cancelStrotimeBooking(
    bookingId: string,
    reason?: string
  ): Promise<ApiResponse<StrotimeBooking>> {
    // Mock implementation
    return {
      success: false,
      error: {
        message: 'Strotime cancellation not implemented yet'
      }
    };
  }
}
