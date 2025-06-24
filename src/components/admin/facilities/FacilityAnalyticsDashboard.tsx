
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFacilities } from "@/hooks/useFacilities";
import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react";

interface FacilityAnalyticsDashboardProps {
  selectedFacilityId?: string;
}

export const FacilityAnalyticsDashboard: React.FC<FacilityAnalyticsDashboardProps> = ({
  selectedFacilityId
}) => {
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(
    selectedFacilityId || null
  );

  const { data: facilities = [] } = useFacilities();

  // Mock analytics data
  const mockAnalytics = {
    totalBookings: 156,
    totalRevenue: 23400,
    averageBookingDuration: 120,
    occupancyRate: 68.5
  };

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
            value={editingFacilityId || ""} 
            onValueChange={(value) => setEditingFacilityId(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a facility to view analytics" />
            </SelectTrigger>
            <SelectContent>
              {facilities.map((facility: any) => (
                <SelectItem key={facility.id} value={facility.id}>
                  {facility.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {editingFacilityId && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.totalBookings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.totalRevenue.toFixed(0)} kr</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(mockAnalytics.averageBookingDuration)} min</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalytics.occupancyRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
