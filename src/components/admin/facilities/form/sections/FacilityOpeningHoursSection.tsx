
import React, { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Clock, Copy } from "lucide-react";

interface OpeningHour {
  dayOfWeek: number;
  dayName: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface FacilityOpeningHoursSectionProps {
  facilityId?: number;
}

export const FacilityOpeningHoursSection: React.FC<FacilityOpeningHoursSectionProps> = ({ facilityId }) => {
  const { tSync } = useTranslation();
  
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([
    { dayOfWeek: 1, dayName: "Monday", isOpen: true, openTime: "08:00", closeTime: "22:00" },
    { dayOfWeek: 2, dayName: "Tuesday", isOpen: true, openTime: "08:00", closeTime: "22:00" },
    { dayOfWeek: 3, dayName: "Wednesday", isOpen: true, openTime: "08:00", closeTime: "22:00" },
    { dayOfWeek: 4, dayName: "Thursday", isOpen: true, openTime: "08:00", closeTime: "22:00" },
    { dayOfWeek: 5, dayName: "Friday", isOpen: true, openTime: "08:00", closeTime: "22:00" },
    { dayOfWeek: 6, dayName: "Saturday", isOpen: true, openTime: "09:00", closeTime: "20:00" },
    { dayOfWeek: 0, dayName: "Sunday", isOpen: false, openTime: "10:00", closeTime: "18:00" },
  ]);

  const updateDay = (dayOfWeek: number, field: keyof OpeningHour, value: any) => {
    setOpeningHours(prev => prev.map(day => 
      day.dayOfWeek === dayOfWeek 
        ? { ...day, [field]: value }
        : day
    ));
  };

  const copyToAllDays = (dayOfWeek: number) => {
    const sourceDay = openingHours.find(d => d.dayOfWeek === dayOfWeek);
    if (sourceDay) {
      setOpeningHours(prev => prev.map(day => ({
        ...day,
        isOpen: sourceDay.isOpen,
        openTime: sourceDay.openTime,
        closeTime: sourceDay.closeTime
      })));
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5" />
          {tSync("admin.facilities.form.hours.title", "Opening Hours")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {openingHours.map((day) => (
            <div key={day.dayOfWeek} className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="w-20 font-medium">
                {tSync(`admin.facilities.form.hours.${day.dayName.toLowerCase()}`, day.dayName)}
              </div>
              
              <Switch
                checked={day.isOpen}
                onCheckedChange={(checked) => updateDay(day.dayOfWeek, 'isOpen', checked)}
              />
              
              {day.isOpen ? (
                <>
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-sm">From:</FormLabel>
                    <Input
                      type="time"
                      value={day.openTime}
                      onChange={(e) => updateDay(day.dayOfWeek, 'openTime', e.target.value)}
                      className="w-24"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-sm">To:</FormLabel>
                    <Input
                      type="time"
                      value={day.closeTime}
                      onChange={(e) => updateDay(day.dayOfWeek, 'closeTime', e.target.value)}
                      className="w-24"
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyToAllDays(day.dayOfWeek)}
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
};
