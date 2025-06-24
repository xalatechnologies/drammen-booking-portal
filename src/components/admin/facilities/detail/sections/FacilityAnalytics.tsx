
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Calendar, Euro } from "lucide-react";

interface FacilityAnalyticsProps {
  facility: any;
}

export const FacilityAnalytics: React.FC<FacilityAnalyticsProps> = ({ facility }) => {
  // Mock analytics data - replace with real data
  const analytics = {
    totalBookings: 156,
    revenue: 89450,
    utilizationRate: 73,
    averageBookingDuration: 2.5,
    popularTimeSlots: ['18:00-20:00', '19:00-21:00', '20:00-22:00'],
    monthlyGrowth: 12.5
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Analytics & Performance</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{analytics.totalBookings}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{analytics.monthlyGrowth}% this month
                </p>
              </div>
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold">{analytics.revenue.toLocaleString()} NOK</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <Euro className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilization Rate</p>
                <p className="text-2xl font-bold">{analytics.utilizationRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Average this month</p>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Duration</p>
                <p className="text-2xl font-bold">{analytics.averageBookingDuration}h</p>
                <p className="text-xs text-gray-500 mt-1">Per booking</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.popularTimeSlots.map((slot, index) => (
              <div key={slot} className="flex items-center justify-between">
                <span className="text-sm font-medium">#{index + 1} {slot}</span>
                <div className="w-32 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full" 
                    style={{ width: `${(3 - index) * 33}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Chart coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Chart coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
