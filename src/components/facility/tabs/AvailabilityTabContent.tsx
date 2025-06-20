import React from "react";
import { Zone } from "@/components/booking/types";
import { SelectedTimeSlot, RecurrencePattern } from "@/utils/recurrenceEngine";
import { EnhancedZoneConflictManager } from "@/utils/enhancedZoneConflictManager";
import { TwoColumnAvailabilityLayout } from "./TwoColumnAvailabilityLayout";
import { BookingDrawer } from "../BookingDrawer";

interface AvailabilityTabContentProps {
  zone: Zone;
  zones: Zone[];
  currentWeekStart: Date;
  setCurrentWeekStart: (date: Date) => void;
  canGoPrevious: boolean;
  selectedSlots: SelectedTimeSlot[];
  setSelectedSlots: (slots: SelectedTimeSlot[]) => void;
  conflictManager: EnhancedZoneConflictManager;
  showLegend?: boolean;
  onPatternBuilderOpen: () => void;
  onBookingDrawerOpen: () => void;
  setShowConflictWizard: (show: boolean) => void;
  setConflictResolutionData: (data: any) => void;
  currentPattern: RecurrencePattern;
  setCurrentPattern: (pattern: RecurrencePattern) => void;
  facilityId: string;
  facilityName: string;
  openingHours: string;
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
  showLegend = true,
  onPatternBuilderOpen,
  onBookingDrawerOpen,
  setShowConflictWizard,
  setConflictResolutionData,
  currentPattern,
  setCurrentPattern,
  facilityId,
  facilityName,
  openingHours
}: AvailabilityTabContentProps) {

  const handlePatternApply = (pattern: RecurrencePattern) => {
    // Implementation will be handled by parent component
    console.log('Applying pattern:', pattern);
  };

  return (
    <div className="space-y-6">
      {/* Two Column Layout - Legend is now included within the layout */}
      <TwoColumnAvailabilityLayout
        zone={zone}
        zones={zones}
        currentWeekStart={currentWeekStart}
        setCurrentWeekStart={setCurrentWeekStart}
        canGoPrevious={canGoPrevious}
        selectedSlots={selectedSlots}
        setSelectedSlots={setSelectedSlots}
        conflictManager={conflictManager}
        facilityId={facilityId}
        facilityName={facilityName}
        openingHours={openingHours}
        currentPattern={currentPattern}
        setCurrentPattern={setCurrentPattern}
        onPatternApply={handlePatternApply}
      />

      {/* Keep existing BookingDrawer for fallback - this will be hidden by default but available if needed */}
      <BookingDrawer
        isOpen={false}
        onClose={() => {}}
        selectedSlots={selectedSlots}
        facilityId={facilityId}
        facilityName={facilityName}
        zones={zones}
      />
    </div>
  );
}
