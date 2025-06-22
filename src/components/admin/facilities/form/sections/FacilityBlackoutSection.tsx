
import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { useBlackoutStore } from "@/stores/useBlackoutStore";
import { FacilityFormData } from "../FacilityFormSchema";
import { toast } from "@/hooks/use-toast";

interface FacilityBlackoutSectionProps {
  facilityId?: number;
  form: UseFormReturn<FacilityFormData>;
}

export interface FacilityBlackoutSectionRef {
  saveData: () => Promise<boolean>;
}

export const FacilityBlackoutSection = forwardRef<FacilityBlackoutSectionRef, FacilityBlackoutSectionProps>(({
  facilityId,
  form
}, ref) => {
  const {
    blackoutPeriods,
    isLoading,
    error,
    fetchBlackoutPeriods,
    saveBlackoutPeriods,
    addBlackoutPeriod,
    updateBlackoutPeriod,
    removeBlackoutPeriod
  } = useBlackoutStore();

  useEffect(() => {
    if (facilityId) {
      fetchBlackoutPeriods(facilityId);
    }
  }, [facilityId, fetchBlackoutPeriods]);

  useImperativeHandle(ref, () => ({
    saveData: async () => {
      if (!facilityId) {
        console.log('No facility ID available for saving blackout periods');
        return true;
      }

      try {
        const success = await saveBlackoutPeriods(facilityId);
        if (success) {
          toast({
            title: "Success",
            description: "Blackout periods saved successfully",
          });
        } else {
          toast({
            title: "Error", 
            description: "Failed to save blackout periods",
            variant: "destructive",
          });
        }
        return success;
      } catch (error) {
        console.error('Error saving blackout periods:', error);
        toast({
          title: "Error",
          description: "An error occurred while saving blackout periods",
          variant: "destructive",
        });
        return false;
      }
    }
  }));

  const handleAddBlackoutPeriod = () => {
    if (!facilityId) return;
    
    addBlackoutPeriod({
      facility_id: facilityId,
      type: 'maintenance',
      reason: '',
      start_date: '',
      end_date: ''
    });
  };

  const handleUpdateBlackoutPeriod = (index: number, field: string, value: string) => {
    updateBlackoutPeriod(index, { [field]: value });
  };

  const handleRemoveBlackoutPeriod = (index: number) => {
    removeBlackoutPeriod(index);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Error loading blackout periods: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Blackout Periods
          </CardTitle>
          <Button type="button" onClick={handleAddBlackoutPeriod} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Period
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading blackout periods...</div>
        ) : blackoutPeriods.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No blackout periods configured</p>
            <p className="text-sm">Add periods when the facility is unavailable for booking</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blackoutPeriods.map((period, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={period.type}
                        onValueChange={(value) => handleUpdateBlackoutPeriod(index, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="renovation">Renovation</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="weather">Weather</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Reason</Label>
                      <Input
                        value={period.reason}
                        onChange={(e) => handleUpdateBlackoutPeriod(index, 'reason', e.target.value)}
                        placeholder="Reason for blackout"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="datetime-local"
                        value={period.start_date}
                        onChange={(e) => handleUpdateBlackoutPeriod(index, 'start_date', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="datetime-local"
                        value={period.end_date}
                        onChange={(e) => handleUpdateBlackoutPeriod(index, 'end_date', e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveBlackoutPeriod(index)}
                    className="ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

FacilityBlackoutSection.displayName = "FacilityBlackoutSection";
