import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FacilityService } from "@/services/FacilityService";
import { FacilityAnalyticsService } from "@/services/FacilityAnalyticsService";
import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react";

interface FacilityAnalyticsDashboardProps {
  selectedFacilityId?: number;
}

export const FacilityAnalyticsDashboard: React.FC<FacilityAnalyticsDashboardProps> = ({
  selectedFacilityId
}) => {
  const [editingFacilityId, setEditingFacilityId] = useState<number | null>(
    selectedFacilityId || null
  );

  const { data: facilitiesResponse } = useQuery({
    queryKey: ['admin-facilities-list'],
    queryFn: () => FacilityService.getFacilities({ page: 1, limit: 100 }, {}, {}),
  });

  const { data: analyticsResponse, isLoading } = useQuery({
    queryKey: ['facility-analytics', editingFacilityId],
    queryFn: () => editingFacilityId ? FacilityAnalyticsService.getFacilityUsageStats(editingFacilityId) : null,
    enabled: !!editingFacilityId,
  });

  const facilities = facilitiesResponse?.success ? facilitiesResponse.data?.data || [] : [];
  const analytics = analyticsResponse?.success ? analyticsResponse.data : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <BarChart3 className="w-6 h-6 mr-2" />
          Facility Analytics
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Facility</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={editingFacilityId?.toString() || ""} 
            onValueChange={(value) => setEditingFacilityId(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a facility to view analytics" />
            </SelectTrigger>
            <SelectContent>
              {facilities.map((facility: any) => (
                <SelectItem key={facility.id} value={facility.id.toString()}>
                  {facility.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {editingFacilityId && (
        <>
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-4">Loading analytics...</div>
              </CardContent>
            </Card>
          ) : analytics ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalBookings}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalRevenue.toFixed(0)} kr</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(analytics.averageBookingDuration)} min</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.occupancyRate.toFixed(1)}%</div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  No analytics data available for this facility
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
