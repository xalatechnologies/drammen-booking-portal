
import React, { useState } from "react";
import { startOfWeek, isBefore, startOfDay, addDays } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zone } from "@/components/booking/types";
import { ExistingBooking } from "@/utils/zoneConflictManager";
import { EnhancedZoneConflictManager } from "@/utils/enhancedZoneConflictManager";
import { RecurrencePattern, SelectedTimeSlot } from "@/utils/recurrenceEngine";
import { AvailabilityTabContent } from "./AvailabilityTabContent";
import { AvailabilityModals } from "./AvailabilityModals";
import { usePatternHandler } from "./PatternHandler";

interface AvailabilityTabProps {
  zones: Zone[];
  startDate: Date;
  showLegend?: boolean;
  facilityId?: string;
  facilityName?: string;
  openingHours?: string;
  selectedSlots?: SelectedTimeSlot[];
  onSlotClick?: (zoneId: string, date: Date, timeSlot: string, availability: string) => void;
}

export function AvailabilityTab({ 
  zones, 
  startDate, 
  showLegend = true,
  facilityId = "",
  facilityName = "",
  openingHours = "08:00-22:00",
  selectedSlots = [],
  onSlotClick
}: AvailabilityTabProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(startDate, { weekStartsOn: 1 }));
  const [showPatternBuilder, setShowPatternBuilder] = useState(false);
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

  const { handlePatternApply } = usePatternHandler({
    pattern: currentPattern,
    zones,
    currentWeekStart,
    conflictManager,
    onConflictDetected: (data) => {
      setConflictResolutionData(data);
      setShowConflictWizard(true);
    },
    onPatternApplied: () => {}, // Not used anymore since we use external state
  });

  const shouldShowTabs = zones.length > 1;

  const renderZoneTab = (zone: Zone) => (
    <AvailabilityTabContent
      key={zone.id}
      zone={zone}
      zones={zones}
      currentWeekStart={currentWeekStart}
      setCurrentWeekStart={setCurrentWeekStart}
      canGoPrevious={canGoPrevious}
      selectedSlots={selectedSlots}
      setSelectedSlots={() => {}} // Not used anymore
      conflictManager={conflictManager}
      showLegend={showLegend}
      onPatternBuilderOpen={() => setShowPatternBuilder(true)}
      onBookingDrawerOpen={() => {}} // Not used anymore since we use sidebar
      setShowConflictWizard={setShowConflictWizard}
      setConflictResolutionData={setConflictResolutionData}
      currentPattern={currentPattern}
      setCurrentPattern={setCurrentPattern}
      facilityId={facilityId}
      facilityName={facilityName}
      openingHours={openingHours}
      onSlotClick={onSlotClick}
    />
  );

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
              {renderZoneTab(zone)}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        zones.length > 0 && renderZoneTab(zones[0])
      )}

      <AvailabilityModals
        showPatternBuilder={showPatternBuilder}
        showConflictWizard={showConflictWizard}
        showBookingDrawer={false}
        currentPattern={currentPattern}
        conflictResolutionData={conflictResolutionData}
        selectedSlots={selectedSlots}
        facilityId={facilityId}
        facilityName={facilityName}
        onPatternBuilderClose={() => setShowPatternBuilder(false)}
        onConflictWizardClose={() => setShowConflictWizard(false)}
        onBookingDrawerClose={() => {}}
        onPatternChange={setCurrentPattern}
        onPatternApply={handlePatternApply}
      />
    </div>
  );
}
