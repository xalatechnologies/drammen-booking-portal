
import React, { useState, useCallback } from "react";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zone } from "@/components/booking/types";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";
import { CalendarGrid } from "@/components/facility/tabs/CalendarGrid";

interface CalendarProps {
  zones: Zone[];
  selectedSlots: SelectedTimeSlot[];
  onSlotClick: (zoneId: string, date: Date, timeSlot: string, availability: string) => void;
  onBulkSlotSelection?: (slots: SelectedTimeSlot[]) => void;
  getAvailabilityStatus: (zoneId: string, date: Date, timeSlot: string) => { status: string; conflict: any };
  isSlotSelected: (zoneId: string, date: Date, timeSlot: string) => boolean;
  timeSlotDuration?: number;
  showZoneSelector?: boolean;
  compact?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({
  zones,
  selectedSlots,
  onSlotClick,
  onBulkSlotSelection,
  getAvailabilityStatus,
  isSlotSelected,
  timeSlotDuration = 1,
  showZoneSelector = true,
  compact = false
}) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedZoneId, setSelectedZoneId] = useState<string>(zones[0]?.id || '');

  // Generate time slots based on duration
  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = 8 + (i * timeSlotDuration);
    const nextHour = hour + timeSlotDuration;
    return `${hour.toString().padStart(2, '0')}:00-${nextHour.toString().padStart(2, '0')}:00`;
  });

  const handlePreviousWeek = useCallback(() => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  }, []);

  const selectedZone = zones.find(zone => zone.id === selectedZoneId) || zones[0];

  if (!selectedZone) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Ingen soner tilgjengelig</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${compact ? 'max-w-4xl' : 'w-full'}`}>
      {/* Calendar Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-4">
            <CalendarIcon className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-xl font-semibold">
              {format(currentWeekStart, "MMMM yyyy", { locale: nb })}
            </CardTitle>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
              Forrige uke
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextWeek}>
              Neste uke
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {showZoneSelector && zones.length > 1 && (
          <CardContent className="pt-0 pb-4">
            <div className="flex flex-wrap gap-2">
              {zones.map((zone) => (
                <Button
                  key={zone.id}
                  variant={selectedZoneId === zone.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedZoneId(zone.id)}
                  className="text-sm"
                >
                  {zone.name}
                </Button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Calendar Grid */}
      <CalendarGrid
        zone={selectedZone}
        currentWeekStart={currentWeekStart}
        timeSlots={timeSlots}
        selectedSlots={selectedSlots}
        getAvailabilityStatus={getAvailabilityStatus}
        isSlotSelected={isSlotSelected}
        onSlotClick={onSlotClick}
        onBulkSlotSelection={onBulkSlotSelection}
      />

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Ledig</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
              <span>Opptatt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-navy-600 rounded"></div>
              <span>Valgt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
              <span>Ikke tilgjengelig</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
