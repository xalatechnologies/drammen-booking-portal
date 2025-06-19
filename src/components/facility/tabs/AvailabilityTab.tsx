import React, { useState } from "react";
import { startOfWeek, isBefore, startOfDay, addDays } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zone } from "@/components/booking/types";
import { ExistingBooking } from "@/utils/zoneConflictManager";
import { EnhancedZoneConflictManager } from "@/utils/enhancedZoneConflictManager";
import { RecurrencePatternBuilder } from "@/components/facility/RecurrencePatternBuilder";
import { BookingDrawer } from "@/components/facility/BookingDrawer";
import { ConflictResolutionWizard } from "@/components/facility/ConflictResolutionWizard";
import { RecurrencePattern, SelectedTimeSlot, recurrenceEngine } from "@/utils/recurrenceEngine";
import { AvailabilityTabContent } from "./AvailabilityTabContent";

interface AvailabilityTabProps {
  zones: Zone[];
  startDate: Date;
  showLegend?: boolean;
  facilityId?: string;
  facilityName?: string;
  openingHours?: string;
}

export function AvailabilityTab({ 
  zones, 
  startDate, 
  showLegend = true,
  facilityId = "",
  facilityName = "",
  openingHours = "08:00-22:00"
}: AvailabilityTabProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(startDate, { weekStartsOn: 1 }));
  const [selectedSlots, setSelectedSlots] = useState<SelectedTimeSlot[]>([]);
  const [showPatternBuilder, setShowPatternBuilder] = useState(false);
  const [showBookingDrawer, setShowBookingDrawer] = useState(false);
  const [showConflictWizard, setShowConflictWizard] = useState(false);
  const [conflictResolutionData, setConflictResolutionData] = useState<any>(null);
  const [currentPattern, setCurrentPattern] = useState<RecurrencePattern>({
    type: 'weekly',
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
  const today = startOfDay(new Date());
  const currentWeekStartDay = startOfDay(currentWeekStart);
  const canGoPrevious = !isBefore(addDays(currentWeekStartDay, -7), today);

  const shouldShowTabs = zones.length > 1;

  // Handler for pattern application - simplified
  const handlePatternApply = (pattern: RecurrencePattern) => {
    if (pattern.timeSlots.length === 0 || pattern.weekdays.length === 0) return;

    const zoneId = zones[0]?.id;
    if (!zoneId) return;
    
    const occurrences = recurrenceEngine.generateOccurrences(
      pattern,
      currentWeekStart,
      zoneId,
      12
    );

    // Check for conflicts
    const conflictedDates: Date[] = [];
    const availableOccurrences: SelectedTimeSlot[] = [];
    
    occurrences.forEach(occurrence => {
      const { status } = conflictManager.checkZoneConflict(occurrence.zoneId, occurrence.date, occurrence.timeSlot) 
        ? { status: 'busy' } : { status: 'available' };
      
      if (status === 'available') {
        availableOccurrences.push(occurrence);
      } else {
        conflictedDates.push(occurrence.date);
      }
    });

    if (conflictedDates.length > 0) {
      // Show conflict resolution
      setConflictResolutionData({
        conflictedDates,
        availableDates: availableOccurrences.map(o => o.date),
        alternativeTimeSlots: [],
        suggestedZones: [],
        originalZone: zones[0],
        originalTimeSlot: pattern.timeSlots[0],
        occurrences: availableOccurrences
      });
      setShowConflictWizard(true);
    } else {
      // No conflicts, add all occurrences
      setSelectedSlots(availableOccurrences);
    }
  };

  return (
    <div className="space-y-6 font-inter">
      {shouldShowTabs ? (
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
                    <span>{zone.capacity} plasser</span>
                  </div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {zones.map((zone) => (
            <TabsContent key={zone.id} value={zone.id} className="mt-6">
              <AvailabilityTabContent
                zone={zone}
                zones={zones}
                currentWeekStart={currentWeekStart}
                setCurrentWeekStart={setCurrentWeekStart}
                canGoPrevious={canGoPrevious}
                selectedSlots={selectedSlots}
                setSelectedSlots={setSelectedSlots}
                conflictManager={conflictManager}
                showLegend={showLegend}
                onPatternBuilderOpen={() => setShowPatternBuilder(true)}
                onBookingDrawerOpen={() => setShowBookingDrawer(true)}
                setShowConflictWizard={setShowConflictWizard}
                setConflictResolutionData={setConflictResolutionData}
                currentPattern={currentPattern}
                setCurrentPattern={setCurrentPattern}
                facilityId={facilityId}
                facilityName={facilityName}
                openingHours={openingHours}
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        zones.length > 0 && (
          <AvailabilityTabContent
            zone={zones[0]}
            zones={zones}
            currentWeekStart={currentWeekStart}
            setCurrentWeekStart={setCurrentWeekStart}
            canGoPrevious={canGoPrevious}
            selectedSlots={selectedSlots}
            setSelectedSlots={setSelectedSlots}
            conflictManager={conflictManager}
            showLegend={showLegend}
            onPatternBuilderOpen={() => setShowPatternBuilder(true)}
            onBookingDrawerOpen={() => setShowBookingDrawer(true)}
            setShowConflictWizard={setShowConflictWizard}
            setConflictResolutionData={setConflictResolutionData}
            currentPattern={currentPattern}
            setCurrentPattern={setCurrentPattern}
            facilityId={facilityId}
            facilityName={facilityName}
            openingHours={openingHours}
          />
        )
      )}

      {/* Simplified Pattern Builder Modal */}
      {showPatternBuilder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <RecurrencePatternBuilder
            pattern={currentPattern}
            onPatternChange={setCurrentPattern}
            onClose={() => setShowPatternBuilder(false)}
            onApplyPattern={handlePatternApply}
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
          onResolutionSelect={() => setShowConflictWizard(false)}
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
