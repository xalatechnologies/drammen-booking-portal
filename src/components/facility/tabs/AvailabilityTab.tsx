
import React, { useState } from "react";
import { format, addDays, startOfWeek, isBefore, startOfDay } from "date-fns";
import { Users, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zone } from "@/components/booking/types";
import { isDateUnavailable } from "@/utils/holidaysAndAvailability";
import { ExistingBooking } from "@/utils/zoneConflictManager";
import { EnhancedZoneConflictManager } from "@/utils/enhancedZoneConflictManager";
import { RecurrencePatternBuilder } from "@/components/facility/RecurrencePatternBuilder";
import { BookingDrawer } from "@/components/facility/BookingDrawer";
import { ConflictResolutionWizard } from "@/components/facility/ConflictResolutionWizard";
import { RecurrencePattern, SelectedTimeSlot, recurrenceEngine } from "@/utils/recurrenceEngine";
import { WeekNavigation } from "./WeekNavigation";
import { ZoneInfoHeader } from "./ZoneInfoHeader";
import { CalendarGrid } from "./CalendarGrid";
import { SelectedSlotsDisplay } from "./SelectedSlotsDisplay";
import { LegendDisplay } from "./LegendDisplay";
import { isSlotSelected, addSlotToSelection, removeSlotFromSelection } from "./AvailabilityTabUtils";

interface AvailabilityTabProps {
  zones: Zone[];
  startDate: Date;
  showLegend?: boolean;
  facilityId?: string;
  facilityName?: string;
}

export function AvailabilityTab({ 
  zones, 
  startDate, 
  showLegend = true,
  facilityId = "",
  facilityName = ""
}: AvailabilityTabProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(startDate, { weekStartsOn: 1 }));
  const [selectedSlots, setSelectedSlots] = useState<SelectedTimeSlot[]>([]);
  const [showPatternBuilder, setShowPatternBuilder] = useState(false);
  const [showBookingDrawer, setShowBookingDrawer] = useState(false);
  const [showConflictWizard, setShowConflictWizard] = useState(false);
  const [conflictResolutionData, setConflictResolutionData] = useState<any>(null);
  const [currentPattern, setCurrentPattern] = useState<RecurrencePattern>({
    type: 'single',
    weekdays: [],
    timeSlots: [],
    interval: 1
  });
  
  // Mock existing bookings for demo
  const existingBookings: ExistingBooking[] = [
    {
      id: "1",
      zoneId: "whole-facility",
      date: new Date(2025, 5, 19),
      timeSlot: "14:00",
      bookedBy: "Drammen Fotballklubb"
    },
    {
      id: "2", 
      zoneId: "zone-1",
      date: new Date(2025, 5, 20),
      timeSlot: "10:00",
      bookedBy: "Lokale Basketlag"
    }
  ];

  const conflictManager = new EnhancedZoneConflictManager(zones, existingBookings);
  const timeSlots = ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"];

  const today = startOfDay(new Date());
  const currentWeekStartDay = startOfDay(currentWeekStart);
  const canGoPrevious = !isBefore(addDays(currentWeekStartDay, -7), today);

  const getAvailabilityStatus = (zoneId: string, date: Date, timeSlot: string) => {
    const unavailableCheck = isDateUnavailable(date);
    if (unavailableCheck.isUnavailable) {
      return { status: 'unavailable', conflict: null };
    }

    const conflict = conflictManager.checkZoneConflict(zoneId, date, timeSlot);
    if (conflict) {
      return { status: 'busy', conflict };
    }

    return { status: 'available', conflict: null };
  };

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    if (availability !== 'available') return;

    const isSelected = isSlotSelected(selectedSlots, zoneId, date, timeSlot);

    if (isSelected) {
      setSelectedSlots(prev => removeSlotFromSelection(prev, zoneId, date, timeSlot));
    } else {
      setSelectedSlots(prev => addSlotToSelection(prev, zoneId, date, timeSlot));
    }
  };

  const clearSelection = () => {
    setSelectedSlots([]);
  };

  const handlePatternApply = (pattern: RecurrencePattern) => {
    if (pattern.weekdays.length === 0 || pattern.timeSlots.length === 0) return;

    const startDateForPattern = currentWeekStart;
    const zoneId = zones[0]?.id || 'whole-facility';
    
    const occurrences = recurrenceEngine.generateOccurrences(
      pattern,
      startDateForPattern,
      zoneId,
      12
    );

    // Check for conflicts in recurring pattern
    const conflictedDates: Date[] = [];
    const availableDates: Date[] = [];
    
    occurrences.forEach(occurrence => {
      const { status } = getAvailabilityStatus(occurrence.zoneId, occurrence.date, occurrence.timeSlot);
      if (status === 'available') {
        availableDates.push(occurrence.date);
      } else {
        conflictedDates.push(occurrence.date);
      }
    });

    // If there are conflicts, show resolution wizard
    if (conflictedDates.length > 0) {
      const zone = zones.find(z => z.id === zoneId);
      if (zone) {
        const resolution = conflictManager.resolveRecurringConflicts(
          zoneId,
          occurrences.map(o => o.date),
          pattern.timeSlots[0],
          {
            skipConflictedDates: true,
            suggestAlternativeTimes: true,
            suggestAlternativeZones: true,
            allowPartialBooking: true
          }
        );

        setConflictResolutionData({
          conflictedDates: resolution.conflictedDates,
          availableDates: resolution.availableDates,
          alternativeTimeSlots: resolution.alternativeTimeSlots,
          suggestedZones: resolution.suggestedZones,
          originalZone: zone,
          originalTimeSlot: pattern.timeSlots[0],
          occurrences
        });
        setShowConflictWizard(true);
      }
    } else {
      // No conflicts, proceed with booking
      setSelectedSlots(occurrences);
    }
    
    setShowPatternBuilder(false);
  };

  const handleConflictResolution = (resolution: any) => {
    // Apply the selected resolution
    switch (resolution.type) {
      case 'skip-conflicts':
        if (conflictResolutionData) {
          const availableOccurrences = conflictResolutionData.occurrences.filter((occ: SelectedTimeSlot) =>
            resolution.selectedDates?.some(date => 
              format(date, 'yyyy-MM-dd') === format(occ.date, 'yyyy-MM-dd')
            )
          );
          setSelectedSlots(availableOccurrences);
        }
        break;
      case 'use-alternatives':
        // Implementation for alternative time slots
        break;
      case 'change-zone':
        if (resolution.selectedZone && conflictResolutionData) {
          const newOccurrences = conflictResolutionData.occurrences.map((occ: SelectedTimeSlot) => ({
            ...occ,
            zoneId: resolution.selectedZone.id
          }));
          setSelectedSlots(newOccurrences);
        }
        break;
    }
    setShowConflictWizard(false);
  };

  const renderZoneCalendar = (zone: Zone) => (
    <div className="space-y-4">
      <ZoneInfoHeader
        zone={zone}
        selectedSlots={selectedSlots}
        onPatternBuilderOpen={() => setShowPatternBuilder(true)}
        onClearSelection={clearSelection}
        onBookingDrawerOpen={() => setShowBookingDrawer(true)}
      />

      <WeekNavigation
        currentWeekStart={currentWeekStart}
        onWeekChange={setCurrentWeekStart}
        canGoPrevious={canGoPrevious}
      />

      <CalendarGrid
        zone={zone}
        currentWeekStart={currentWeekStart}
        timeSlots={timeSlots}
        selectedSlots={selectedSlots}
        getAvailabilityStatus={getAvailabilityStatus}
        isSlotSelected={(zoneId, date, timeSlot) => isSlotSelected(selectedSlots, zoneId, date, timeSlot)}
        onSlotClick={handleSlotClick}
      />

      <SelectedSlotsDisplay selectedSlots={selectedSlots} />

      <LegendDisplay showLegend={showLegend} />
    </div>
  );

  return (
    <div className="space-y-6 font-inter">
      {/* Enhanced Zone Tabs */}
      <Tabs defaultValue={zones[0]?.id} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 h-auto p-1 bg-gray-100 rounded-lg">
          {zones.map((zone) => (
            <TabsTrigger 
              key={zone.id} 
              value={zone.id}
              className="flex flex-col items-center p-3 h-auto data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white hover:bg-[#1e40af] hover:text-white transition-colors rounded-md font-inter"
            >
              <span className="font-medium text-base">{zone.name}</span>
              <div className="flex items-center gap-4 mt-2 text-sm opacity-75">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{zone.capacity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{zone.pricePerHour}kr</span>
                </div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {zones.map((zone) => (
          <TabsContent key={zone.id} value={zone.id} className="mt-6">
            {renderZoneCalendar(zone)}
          </TabsContent>
        ))}
      </Tabs>

      {/* Pattern Builder Modal */}
      {showPatternBuilder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <RecurrencePatternBuilder
            pattern={currentPattern}
            onPatternChange={setCurrentPattern}
            onClose={() => {
              handlePatternApply(currentPattern);
              setShowPatternBuilder(false);
            }}
          />
        </div>
      )}

      {/* Conflict Resolution Wizard */}
      {showConflictWizard && conflictResolutionData && (
        <ConflictResolutionWizard
          isOpen={showConflictWizard}
          onClose={() => setShowConflictWizard(false)}
          conflictedDates={conflictResolutionData.conflictedDates}
          availableDates={conflictResolutionData.availableDates}
          alternativeTimeSlots={conflictResolutionData.alternativeTimeSlots}
          suggestedZones={conflictResolutionData.suggestedZones}
          originalZone={conflictResolutionData.originalZone}
          originalTimeSlot={conflictResolutionData.originalTimeSlot}
          onResolutionSelect={handleConflictResolution}
        />
      )}

      {/* Booking Drawer */}
      <BookingDrawer
        isOpen={showBookingDrawer}
        onClose={() => setShowBookingDrawer(false)}
        selectedSlots={selectedSlots}
        facilityId={facilityId}
        facilityName={facilityName}
      />
    </div>
  );
}
