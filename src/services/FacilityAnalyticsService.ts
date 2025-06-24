
import { supabase } from '@/integrations/supabase/client';

export interface FacilityAnalytics {
  totalBookings: number;
  totalRevenue: number;
  averageBookingDuration: number;
  occupancyRate: number;
  popularTimeSlots: Array<{
    hour: number;
    bookingCount: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    bookings: number;
    revenue: number;
  }>;
}

export interface FacilityMetrics {
  facilityId: string;
  facilityName: string;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  occupancyRate: number;
}

export class FacilityAnalyticsService {
  async getFacilityAnalytics(facilityId: string, dateRange?: { start: Date; end: Date }): Promise<FacilityAnalytics> {
    try {
      console.log('Fetching analytics for facility:', facilityId);
      
      // Get bookings data
      let bookingsQuery = supabase
        .from('app_bookings')
        .select('*')
        .eq('location_id', facilityId);

      if (dateRange) {
        bookingsQuery = bookingsQuery
          .gte('start_date_time', dateRange.start.toISOString())
          .lte('start_date_time', dateRange.end.toISOString());
      }

      const { data: bookings, error: bookingsError } = await bookingsQuery;

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        return this.getEmptyAnalytics();
      }

      const bookingData = bookings || [];
      
      // Calculate metrics
      const totalBookings = bookingData.length;
      const totalRevenue = bookingData.reduce((sum, booking) => {
        return sum + (booking.price || 0);
      }, 0);

      const averageBookingDuration = bookingData.length > 0 
        ? bookingData.reduce((sum, booking) => {
            const start = new Date(booking.start_date_time);
            const end = new Date(booking.end_date_time);
            return sum + (end.getTime() - start.getTime()) / (1000 * 60); // minutes
          }, 0) / bookingData.length
        : 0;

      // Calculate popular time slots
      const timeSlotCounts: Record<number, number> = {};
      bookingData.forEach(booking => {
        const hour = new Date(booking.start_date_time).getHours();
        timeSlotCounts[hour] = (timeSlotCounts[hour] || 0) + 1;
      });

      const popularTimeSlots = Object.entries(timeSlotCounts)
        .map(([hour, count]) => ({ hour: parseInt(hour), bookingCount: count }))
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 10);

      // Calculate monthly trends
      const monthlyData: Record<string, { bookings: number; revenue: number }> = {};
      bookingData.forEach(booking => {
        const month = new Date(booking.start_date_time).toISOString().substring(0, 7);
        if (!monthlyData[month]) {
          monthlyData[month] = { bookings: 0, revenue: 0 };
        }
        monthlyData[month].bookings++;
        monthlyData[month].revenue += booking.price || 0;
      });

      const monthlyTrends = Object.entries(monthlyData)
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => a.month.localeCompare(b.month));

      return {
        totalBookings,
        totalRevenue,
        averageBookingDuration,
        occupancyRate: 0.75, // Mock value
        popularTimeSlots,
        monthlyTrends
      };

    } catch (error) {
      console.error('Analytics service error:', error);
      return this.getEmptyAnalytics();
    }
  }

  async getAllFacilitiesMetrics(dateRange?: { start: Date; end: Date }): Promise<FacilityMetrics[]> {
    try {
      const { data: facilities, error: facilitiesError } = await supabase
        .from('app_locations')
        .select('*')
        .eq('is_published', true);

      if (facilitiesError || !facilities) {
        console.error('Error fetching facilities:', facilitiesError);
        return [];
      }

      const metrics = await Promise.all(
        facilities.map(async (facility) => {
          const analytics = await this.getFacilityAnalytics(facility.id, dateRange);
          
          const facilityName = typeof facility.name === 'object' && facility.name
            ? (facility.name as any).no || (facility.name as any).en || 'Unknown'
            : facility.name || 'Unknown';

          return {
            facilityId: facility.id,
            facilityName,
            totalBookings: analytics.totalBookings,
            totalRevenue: analytics.totalRevenue,
            averageRating: 4.2, // Mock value
            occupancyRate: analytics.occupancyRate
          };
        })
      );

      return metrics.sort((a, b) => b.totalRevenue - a.totalRevenue);

    } catch (error) {
      console.error('Error fetching facility metrics:', error);
      return [];
    }
  }

  private getEmptyAnalytics(): FacilityAnalytics {
    return {
      totalBookings: 0,
      totalRevenue: 0,
      averageBookingDuration: 0,
      occupancyRate: 0,
      popularTimeSlots: [],
      monthlyTrends: []
    };
  }
}

export const facilityAnalyticsService = new FacilityAnalyticsService();
