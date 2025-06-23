
import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useOpeningHoursStore } from "@/stores/useOpeningHoursStore";
import { Clock, Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FacilityOpeningHoursSectionProps {
  facilityId?: number;
}

interface FacilityOpeningHoursSectionRef {
  saveData: () => Promise<boolean>;
}

export const FacilityOpeningHoursSection = forwardRef<FacilityOpeningHoursSectionRef, FacilityOpeningHoursSectionProps>(({ facilityId }, ref) => {
  const { tSync } = useTranslation();
  const {
    openingHours,
    isLoading,
    error,
    setOpeningHours,
    updateOpeningHour,
    fetchOpeningHours,
    saveOpeningHours,
    reset
  } = useOpeningHoursStore();

  // Initialize default opening hours if none exist
  useEffect(() => {
    if (facilityId) {
      fetchOpeningHours(facilityId);
    } else {
      // Set default opening hours for new facilities
      const defaultHours = [
        { day_of_week: 1, is_open: true, open_time: "08:00", close_time: "22:00", facility_id: 0 },
        { day_of_week: 2, is_open: true, open_time: "08:00", close_time: "22:00", facility_id: 0 },
        { day_of_week: 3, is_open: true, open_time: "08:00", close_time: "22:00", facility_id: 0 },
        { day_of_week: 4, is_open: true, open_time: "08:00", close_time: "22:00", facility_id: 0 },
        { day_of_week: 5, is_open: true, open_time: "08:00", close_time: "22:00", facility_id: 0 },
        { day_of_week: 6, is_open: true, open_time: "09:00", close_time: "20:00", facility_id: 0 },
        { day_of_week: 0, is_open: false, open_time: "10:00", close_time: "18:00", facility_id: 0 },
      ];
      setOpeningHours(defaultHours);
    }

    return () => {
      reset();
    };
  }, [facilityId, fetchOpeningHours, setOpeningHours, reset]);

  // Expose save function to parent via ref
  useImperativeHandle(ref, () => ({
    saveData: async () => {
      console.log('Saving opening hours for facility:', facilityId);
      
      if (!facilityId) {
        console.log('No facility ID, skipping opening hours save');
        return true;
      }

      try {
        const success = await saveOpeningHours(facilityId);
        if (success) {
          toast({
            title: "Success",
            description: "Opening hours saved successfully",
          });
        } else {
          toast({
            title: "Error",
            description: error || "Failed to save opening hours",
            variant: "destructive",
          });
        }
        return success;
      } catch (error: any) {
        console.error('Failed to save opening hours:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to save opening hours",
          variant: "destructive",
        });
        return false;
      }
    }
  }), [facilityId, saveOpeningHours, error]);

  const getDayName = (dayOfWeek: number) => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return dayNames[dayOfWeek];
  };

  const copyToAllDays = (sourceDayOfWeek: number) => {
    const sourceDay = openingHours.find(d => d.day_of_week === sourceDayOfWeek);
    if (sourceDay) {
      openingHours.forEach(day => {
        if (day.day_of_week !== sourceDayOfWeek) {
          updateOpeningHour(day.day_of_week, {
            is_open: sourceDay.is_open,
            open_time: sourceDay.open_time,
            close_time: sourceDay.close_time
          });
        }
      });
      toast({
        title: "Success",
        description: `Copied ${getDayName(sourceDayOfWeek)} hours to all days`,
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading opening hours...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {tSync("admin.facilities.form.hours.title", "Opening Hours")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-red-600 text-sm p-3 bg-red-50 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-3">
          {openingHours.map((day) => (
            <div key={day.day_of_week} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="w-20 font-medium">
                {tSync(`admin.facilities.form.hours.${getDayName(day.day_of_week).toLowerCase()}`, getDayName(day.day_of_week))}
              </div>
              
              <Switch
                checked={day.is_open}
                onCheckedChange={(checked) => updateOpeningHour(day.day_of_week, { is_open: checked })}
              />
              
              {day.is_open ? (
                <>
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-sm">From:</FormLabel>
                    <Input
                      type="time"
                      value={day.open_time}
                      onChange={(e) => updateOpeningHour(day.day_of_week, { open_time: e.target.value })}
                      className="w-24"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-sm">To:</FormLabel>
                    <Input
                      type="time"
                      value={day.close_time}
                      onChange={(e) => updateOpeningHour(day.day_of_week, { close_time: e.target.value })}
                      className="w-24"
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyToAllDays(day.day_of_week)}
                    className="ml-auto"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {tSync("admin.facilities.form.hours.copyToAll", "Copy to all")}
                  </Button>
                </>
              ) : (
                <span className="text-gray-500 ml-auto">
                  {tSync("admin.facilities.form.hours.closed", "Closed")}
                </span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

FacilityOpeningHoursSection.displayName = "FacilityOpeningHoursSection";
