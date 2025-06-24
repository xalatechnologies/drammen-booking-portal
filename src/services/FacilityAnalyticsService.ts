
import { supabase } from '@/integrations/supabase/client';

export interface FacilityAnalytics {
  totalBookings: number;
  activeUsers: number;
  averageRating: number;
  revenueThisMonth: number;
  popularTimeSlots: string[];
  occupancyRate: number;
}

export class FacilityAnalyticsService {
  static async getFacilityAnalytics(facilityId: string): Promise<FacilityAnalytics> {
    try {
      // Get total bookings for this facility
      const { data: bookings, error: bookingsError } = await supabase
        .from('app_bookings')
        .select('*')
        .eq('location_id', facilityId);

      if (bookingsError) throw bookingsError;

      // Get facility data
      const { data: facility, error: facilityError } = await supabase
        .from('app_locations')
        .select('*')
        .eq('id', facilityId)
        .single();

      if (facilityError) throw facilityError;

      // Calculate analytics
      const totalBookings = bookings?.length || 0;
      const activeUsers = new Set(bookings?.map(b => b.user_id).filter(Boolean)).size;
      
      // Mock data for now since we don't have ratings/revenue yet
      const analytics: FacilityAnalytics = {
        totalBookings,
        activeUsers,
        averageRating: 4.2,
        revenueThisMonth: totalBookings * 450, // Mock calculation
        popularTimeSlots: ['10:00-12:00', '14:00-16:00', '18:00-20:00'],
        occupancyRate: Math.min(totalBookings * 0.1, 0.85) // Mock calculation
      };

      return analytics;
    } catch (error) {
      console.error('Error fetching facility analytics:', error);
      throw error;
    }
  }

  static async getAllFacilitiesAnalytics(): Promise<{ [facilityId: string]: FacilityAnalytics }> {
    try {
      const { data: facilities, error } = await supabase
        .from('app_locations')
        .select('id');

      if (error) throw error;

      const analytics: { [facilityId: string]: FacilityAnalytics } = {};
      
      for (const facility of facilities || []) {
        analytics[facility.id] = await this.getFacilityAnalytics(facility.id);
      }

      return analytics;
    } catch (error) {
      console.error('Error fetching all facilities analytics:', error);
      throw error;
    }
  }
}
