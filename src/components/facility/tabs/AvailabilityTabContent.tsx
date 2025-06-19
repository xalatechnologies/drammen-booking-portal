
import React from "react";
import { startOfWeek, addDays, format, isSameDay } from "date-fns";
import { nb } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Plus, Repeat, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Zone } from "@/components/booking/types";
import { EnhancedZoneConflictManager } from "@/utils/enhancedZoneConflictManager";
import { RecurrencePattern, SelectedTimeSlot } from "@/utils/recurrenceEngine";
import { WeekNavigation } from "./WeekNavigation";
import { ResponsiveCalendarGrid } from "./ResponsiveCalendarGrid";
import { LegendDisplay } from "./LegendDisplay";
import { SelectedSlotsDisplay } from "./SelectedSlotsDisplay";
import { isSlotSelected } from "./AvailabilityTabUtils";

interface AvailabilityTabContentProps {
  zone: Zone;
  zones: Zone[];
  currentWeekStart: Date;
  setCurrentWeekStart: (date: Date) => void;
  canGoPrevious: boolean;
  selectedSlots: SelectedTimeSlot[];
  setSelectedSlots: React.Dispatch<React.SetStateAction<SelectedTimeSlot[]>>;
  conflictManager: EnhancedZoneConflictManager;
  showLegend: boolean;
  onPatternBuilderOpen: () => void;
  onBookingDrawerOpen: () => void;
  setShowConflictWizard: (show: boolean) => void;
  setConflictResolutionData: (data: any) => void;
  currentPattern: RecurrencePattern;
  setCurrentPattern: (pattern: RecurrencePattern) => void;
  facilityId: string;
  facilityName: string;
  openingHours: string;
  onSlotClick?: (zoneId: string, date: Date, timeSlot: string, availability: string) => void;
}

export function AvailabilityTabContent({
  zone,
  zones,
  currentWeekStart,
  setCurrentWeekStart,
  canGoPrevious,
  selectedSlots,
  setSelectedSlots,
  conflictManager,
  showLegend,
  onPatternBuilderOpen,
  onBookingDrawerOpen,
  setShowConflictWizard,
  setConflictResolutionData,
  currentPattern,
  setCurrentPattern,
  facilityId,
  facilityName,
  openingHours,
  onSlotClick
}: AvailabilityTabContentProps) {

  // Generate week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  // Generate time slots based on opening hours
  const timeSlots = [
    "08:00-10:00", "10:00-12:00", "12:00-14:00", 
    "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"
  ];

  const handleSlotClick = (date: Date, timeSlot: string) => {
    if (onSlotClick) {
      const availability = Math.random() > 0.3 ? 'available' : 'booked'; // Mock availability
      onSlotClick(zone.id, date, timeSlot, availability);
    }
  };

  return (
    <div className="space-y-6">
      {/* Zone Info Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{zone.name}</h3>
              <p className="text-sm text-gray-600 font-normal">{zone.description}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white">
                {zone.capacity} plasser
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white">
                {zone.area}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{openingHours}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Navigation */}
      <WeekNavigation
        currentWeekStart={currentWeekStart}
        setCurrentWeekStart={setCurrentWeekStart}
        canGoPrevious={canGoPrevious}
      />

      {/* Calendar Grid */}
      <ResponsiveCalendarGrid
        weekDates={weekDates}
        timeSlots={timeSlots}
        selectedSlots={selectedSlots}
        zone={zone}
        conflictManager={conflictManager}
        onSlotClick={handleSlotClick}
      />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 pt-4">
        <Button
          onClick={onPatternBuilderOpen}
          variant="outline"
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
        >
          <Repeat className="h-4 w-4" />
          Opprett gjentakende mønster
        </Button>
        
        <Button
          onClick={() => {}}
          variant="outline" 
          className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300"
        >
          <Plus className="h-4 w-4" />
          Legg til flere tidspunkt
        </Button>
      </div>

      {/* Legend */}
      {showLegend && <LegendDisplay />}

      {/* Selected Slots Display - Only show if there are selections */}
      <SelectedSlotsDisplay selectedSlots={selectedSlots} />
    </div>
  );
}
