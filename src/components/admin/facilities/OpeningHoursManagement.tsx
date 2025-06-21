import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FacilityService } from "@/services/facilityService";
import { OpeningHoursService } from "@/services/OpeningHoursService";
import { Clock, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface OpeningHoursManagementProps {
  selectedFacilityId?: number;
}

export const OpeningHoursManagement: React.FC<OpeningHoursManagementProps> = ({
  selectedFacilityId
}) => {
  const [editingFacilityId, setEditingFacilityId] = useState<number | null>(
    selectedFacilityId || null
  );
  const queryClient = useQueryClient();

  const { data: facilitiesResponse } = useQuery({
    queryKey: ['admin-facilities-list'],
    queryFn: () => FacilityService.getFacilities({ page: 1, limit: 100 }, {}, {}),
  });

  const { data: openingHoursResponse, isLoading } = useQuery({
    queryKey: ['facility-opening-hours', editingFacilityId],
    queryFn: () => editingFacilityId ? OpeningHoursService.getFacilityOpeningHours(editingFacilityId) : null,
    enabled: !!editingFacilityId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => OpeningHoursService.updateOpeningHours(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-opening-hours'] });
      toast({
        title: "Success",
        description: "Opening hours updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update opening hours",
        variant: "destructive",
      });
    },
  });

  const facilities = facilitiesResponse?.success ? facilitiesResponse.data?.data || [] : [];
  const openingHours = openingHoursResponse?.success ? openingHoursResponse.data || [] : [];

  const dayNames = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const [hours, setHours] = useState(() => {
    const defaultHours: any = {};
    dayNames.forEach((_, index) => {
      const existing = openingHours.find(h => h.day_of_week === index + 1);
      defaultHours[index + 1] = {
        day_of_week: index + 1,
        open_time: existing?.open_time || '08:00',
        close_time: existing?.close_time || '22:00',
        is_open: existing?.is_open ?? true,
      };
    });
    return defaultHours;
  });

  React.useEffect(() => {
    const newHours: any = {};
    dayNames.forEach((_, index) => {
      const existing = openingHours.find(h => h.day_of_week === index + 1);
      newHours[index + 1] = {
        day_of_week: index + 1,
        open_time: existing?.open_time || '08:00',
        close_time: existing?.close_time || '22:00',
        is_open: existing?.is_open ?? true,
      };
    });
    setHours(newHours);
  }, [openingHours]);

  const handleSave = () => {
    if (!editingFacilityId) return;

    const hoursArray = Object.values(hours);
    updateMutation.mutate({
      facility_id: editingFacilityId,
      opening_hours: hoursArray,
    });
  };

  const updateHour = (dayOfWeek: number, field: string, value: any) => {
    setHours(prev => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        [field]: value,
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Clock className="w-6 h-6 mr-2" />
          Opening Hours Management
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
              <SelectValue placeholder="Select a facility to manage opening hours" />
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
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Weekly Schedule</CardTitle>
              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading opening hours...</div>
            ) : (
              <div className="space-y-4">
                {dayNames.map((day, index) => {
                  const dayOfWeek = index + 1;
                  const dayHours = hours[dayOfWeek];
                  
                  return (
                    <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-24 font-medium">{day}</div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={dayHours?.is_open}
                          onCheckedChange={(checked) => updateHour(dayOfWeek, 'is_open', checked)}
                        />
                        <Label>Open</Label>
                      </div>

                      {dayHours?.is_open && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Label>From:</Label>
                            <Input
                              type="time"
                              value={dayHours.open_time}
                              onChange={(e) => updateHour(dayOfWeek, 'open_time', e.target.value)}
                              className="w-32"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Label>To:</Label>
                            <Input
                              type="time"
                              value={dayHours.close_time}
                              onChange={(e) => updateHour(dayOfWeek, 'close_time', e.target.value)}
                              className="w-32"
                            />
                          </div>
                        </>
                      )}

                      {!dayHours?.is_open && (
                        <span className="text-muted-foreground">Closed</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
