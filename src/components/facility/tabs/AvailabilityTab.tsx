
import React, { useState } from "react";
import { startOfWeek, isBefore, startOfDay, addDays } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zone } from "@/components/booking/types";
import { ExistingBooking } from "@/utils/zoneConflictManager";
import { EnhancedZoneConflictManager } from "@/utils/enhancedZoneConflictManager";
import { RecurrencePatternBuilder } from "@/components/facility/RecurrencePatternBuilder";
import { BookingDrawer } from "@/components/facility/BookingDrawer";
import { ConflictResolutionWizard } from "@/components/facility/ConflictResolutionWizard";
import { RecurrencePattern, SelectedTimeSlot } from "@/utils/recurrenceEngine";
import { AvailabilityTabContent } from "./AvailabilityTabContent";

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
  const today = startOfDay(new Date());
  const currentWeekStartDay = startOfDay(currentWeekStart);
  const canGoPrevious = !isBefore(addDays(currentWeekStartDay, -7), today);

  // Check if we should show tabs or just render a single zone
  const shouldShowTabs = zones.length > 1;

  return (
    <div className="space-y-6 font-inter">
      {shouldShowTabs ? (
        /* Enhanced Zone Tabs for multiple zones */
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
              />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        /* Single zone - no tabs needed */
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
          />
        )
      )}

      {/* Pattern Builder Modal */}
      {showPatternBuilder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <RecurrencePatternBuilder
            pattern={currentPattern}
            onPatternChange={setCurrentPattern}
            onClose={() => setShowPatternBuilder(false)}
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
