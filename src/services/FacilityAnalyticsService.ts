
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse } from '@/types/api';

interface FacilityUsageStats {
  facilityId: number;
  facilityName: string;
  totalBookings: number;
  totalRevenue: number;
  averageBookingDuration: number;
  occupancyRate: number;
  popularTimeSlots: Array<{
    timeSlot: string;
    bookingCount: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    bookings: number;
    revenue: number;
  }>;
}

interface SystemAnalytics {
  totalFacilities: number;
  totalBookings: number;
  totalRevenue: number;
  averageOccupancyRate: number;
  topFacilities: Array<{
    facilityId: number;
    name: string;
    bookingCount: number;
    revenue: number;
  }>;
  bookingTrends: Array<{
    date: string;
    bookings: number;
    revenue: number;
  }>;
}

export class FacilityAnalyticsService {
  static async getFacilityUsageStats(
    facilityId: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<ApiResponse<FacilityUsageStats>> {
    try {
      console.log('FacilityAnalyticsService.getFacilityUsageStats - Called with:', { facilityId, startDate, endDate });

      // Get facility basic info
      const { data: facility, error: facilityError } = await supabase
        .from('facilities')
        .select('id, name')
        .eq('id', facilityId)
        .single();

      if (facilityError || !facility) {
        return {
          success: false,
          error: { message: 'Facility not found' }
        };
      }

      // Build date filter
      let dateFilter = '';
      if (startDate && endDate) {
        dateFilter = `and(start_date.gte.${startDate.toISOString()},end_date.lte.${endDate.toISOString()})`;
      } else if (startDate) {
        dateFilter = `start_date.gte.${startDate.toISOString()}`;
      } else if (endDate) {
        dateFilter = `end_date.lte.${endDate.toISOString()}`;
      }

      // Get bookings for this facility
      let bookingsQuery = supabase
        .from('bookings')
        .select('*')
        .eq('facility_id', facilityId)
        .in('status', ['confirmed', 'completed']);

      if (dateFilter) {
        bookingsQuery = bookingsQuery.or(dateFilter);
      }

      const { data: bookings, error: bookingsError } = await bookingsQuery;

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        return {
          success: false,
          error: { message: 'Failed to fetch bookings data', details: bookingsError }
        };
      }

      // Calculate statistics
      const totalBookings = bookings?.length || 0;
      const totalRevenue = bookings?.reduce((sum, booking) => sum + Number(booking.total_price), 0) || 0;
      const averageBookingDuration = bookings?.length 
        ? bookings.reduce((sum, booking) => sum + booking.duration_minutes, 0) / bookings.length 
        : 0;

      // Calculate occupancy rate (simplified - would need more complex logic for real calculation)
      const occupancyRate = totalBookings > 0 ? Math.min(totalBookings * 2, 100) : 0; // Placeholder calculation

      // Popular time slots analysis
      const timeSlotCounts: Record<string, number> = {};
      bookings?.forEach(booking => {
        const hour = new Date(booking.start_date).getHours();
        const timeSlot = `${hour}:00-${hour + 1}:00`;
        timeSlotCounts[timeSlot] = (timeSlotCounts[timeSlot] || 0) + 1;
      });

      const popularTimeSlots = Object.entries(timeSlotCounts)
        .map(([timeSlot, bookingCount]) => ({ timeSlot, bookingCount }))
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 5);

      // Monthly trends (last 12 months)
      const monthlyTrends: Array<{ month: string; bookings: number; revenue: number }> = [];
      const now = new Date();
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        
        const monthBookings = bookings?.filter(booking => {
          const bookingDate = new Date(booking.start_date);
          return bookingDate.getMonth() === date.getMonth() && 
                 bookingDate.getFullYear() === date.getFullYear();
        }) || [];

        monthlyTrends.push({
          month: monthName,
          bookings: monthBookings.length,
          revenue: monthBookings.reduce((sum, booking) => sum + Number(booking.total_price), 0)
        });
      }

      const stats: FacilityUsageStats = {
        facilityId: facility.id,
        facilityName: facility.name,
        totalBookings,
        totalRevenue,
        averageBookingDuration,
        occupancyRate,
        popularTimeSlots,
        monthlyTrends
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('FacilityAnalyticsService.getFacilityUsageStats - Error:', error);
      return {
        success: false,
        error: { message: 'Failed to fetch facility usage stats', details: error }
      };
    }
  }

  static async getSystemAnalytics(
    startDate?: Date,
    endDate?: Date
  ): Promise<ApiResponse<SystemAnalytics>> {
    try {
      console.log('FacilityAnalyticsService.getSystemAnalytics - Called with:', { startDate, endDate });

      // Get total facilities count
      const { count: totalFacilities, error: facilitiesError } = await supabase
        .from('facilities')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (facilitiesError) {
        return {
          success: false,
          error: { message: 'Failed to fetch facilities count', details: facilitiesError }
        };
      }

      // Build date filter for bookings
      let bookingsQuery = supabase
        .from('bookings')
        .select('*')
        .in('status', ['confirmed', 'completed']);

      if (startDate && endDate) {
        bookingsQuery = bookingsQuery
          .gte('start_date', startDate.toISOString())
          .lte('end_date', endDate.toISOString());
      }

      const { data: bookings, error: bookingsError } = await bookingsQuery;

      if (bookingsError) {
        return {
          success: false,
          error: { message: 'Failed to fetch bookings data', details: bookingsError }
        };
      }

      const totalBookings = bookings?.length || 0;
      const totalRevenue = bookings?.reduce((sum, booking) => sum + Number(booking.total_price), 0) || 0;

      // Calculate average occupancy rate
      const averageOccupancyRate = totalFacilities && totalBookings 
        ? Math.min((totalBookings / (totalFacilities * 30)) * 100, 100) // Rough calculation
        : 0;

      // Get top facilities by booking count
      const facilityStats: Record<number, { bookings: number; revenue: number; name?: string }> = {};
      
      bookings?.forEach(booking => {
        if (!facilityStats[booking.facility_id]) {
          facilityStats[booking.facility_id] = { bookings: 0, revenue: 0 };
        }
        facilityStats[booking.facility_id].bookings++;
        facilityStats[booking.facility_id].revenue += Number(booking.total_price);
      });

      // Get facility names for top facilities
      const facilityIds = Object.keys(facilityStats).map(id => parseInt(id));
      const { data: facilityNames } = await supabase
        .from('facilities')
        .select('id, name')
        .in('id', facilityIds);

      facilityNames?.forEach(facility => {
        if (facilityStats[facility.id]) {
          facilityStats[facility.id].name = facility.name;
        }
      });

      const topFacilities = Object.entries(facilityStats)
        .map(([facilityId, stats]) => ({
          facilityId: parseInt(facilityId),
          name: stats.name || `Facility ${facilityId}`,
          bookingCount: stats.bookings,
          revenue: stats.revenue
        }))
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 10);

      // Daily booking trends (last 30 days)
      const bookingTrends: Array<{ date: string; bookings: number; revenue: number }> = [];
      const now = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayBookings = bookings?.filter(booking => {
          const bookingDate = new Date(booking.start_date).toISOString().split('T')[0];
          return bookingDate === dateStr;
        }) || [];

        bookingTrends.push({
          date: dateStr,
          bookings: dayBookings.length,
          revenue: dayBookings.reduce((sum, booking) => sum + Number(booking.total_price), 0)
        });
      }

      const analytics: SystemAnalytics = {
        totalFacilities: totalFacilities || 0,
        totalBookings,
        totalRevenue,
        averageOccupancyRate,
        topFacilities,
        bookingTrends
      };

      return {
        success: true,
        data: analytics
      };
    } catch (error) {
      console.error('FacilityAnalyticsService.getSystemAnalytics - Error:', error);
      return {
        success: false,
        error: { message: 'Failed to fetch system analytics', details: error }
      };
    }
  }

  static async exportFacilityData(facilityId: number, format: 'csv' | 'json' = 'csv'): Promise<ApiResponse<string>> {
    try {
      const statsResult = await this.getFacilityUsageStats(facilityId);
      
      if (!statsResult.success || !statsResult.data) {
        return {
          success: false,
          error: { message: 'Failed to fetch facility data for export' }
        };
      }

      const stats = statsResult.data;

      if (format === 'json') {
        return {
          success: true,
          data: JSON.stringify(stats, null, 2)
        };
      }

      // CSV format
      let csv = 'Metric,Value\n';
      csv += `Facility Name,${stats.facilityName}\n`;
      csv += `Total Bookings,${stats.totalBookings}\n`;
      csv += `Total Revenue,${stats.totalRevenue}\n`;
      csv += `Average Booking Duration (minutes),${stats.averageBookingDuration}\n`;
      csv += `Occupancy Rate (%),${stats.occupancyRate}\n\n`;
      
      csv += 'Popular Time Slots\n';
      csv += 'Time Slot,Booking Count\n';
      stats.popularTimeSlots.forEach(slot => {
        csv += `${slot.timeSlot},${slot.bookingCount}\n`;
      });

      csv += '\nMonthly Trends\n';
      csv += 'Month,Bookings,Revenue\n';
      stats.monthlyTrends.forEach(trend => {
        csv += `${trend.month},${trend.bookings},${trend.revenue}\n`;
      });

      return {
        success: true,
        data: csv
      };
    } catch (error) {
      console.error('FacilityAnalyticsService.exportFacilityData - Error:', error);
      return {
        success: false,
        error: { message: 'Failed to export facility data', details: error }
      };
    }
  }
}
