
import React from 'react';
import { addDays } from 'date-fns';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot, RecurrencePattern } from '@/utils/recurrenceEngine';
import { EnhancedZoneConflictManager } from '@/utils/enhancedZoneConflictManager';
import { useTranslation } from '@/i18n';
import { WeekNavigation } from './WeekNavigation';
import { ZoneInfoHeader } from './ZoneInfoHeader';
import { ResponsiveCalendarGrid } from './ResponsiveCalendarGrid';
import { SelectedSlotsDisplay } from './SelectedSlotsDisplay';
import { LegendDisplay } from './LegendDisplay';
import { StrotimeDisplay } from './StrotimeDisplay';
import { AvailabilityStatusManager } from './AvailabilityStatusManager';
import { useStrotimer } from '@/hooks/useStrotimer';
import { useSlotSelection } from '@/hooks/useSlotSelection';
import { parseOpeningHours } from '@/utils/openingHoursParser';
import { isSlotSelected } from './AvailabilityTabUtils';

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
  facilityId?: string;
  facilityName?: string;
  openingHours?: string;
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
  facilityId = "",
  facilityName = "",
  openingHours = "08:00-22:00"
}: AvailabilityTabContentProps) {
  const timeSlots = parseOpeningHours(openingHours);
  const { t } = useTranslation();

  // Use custom hooks for separated concerns
  const { strøtimer, handleStrøtimeBookingComplete } = useStrotimer({
    facilityId,
    currentWeekStart
  });

  const { handleSlotClick: internalHandleSlotClick, clearSelection } = useSlotSelection();

  // Create availability status manager
  const availabilityStatusManager = new AvailabilityStatusManager(conflictManager);

  const weekDays = Array(7).fill(0).map((_, i) => addDays(currentWeekStart, i));

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    if (availability !== 'available') return;

    const isSelected = isSlotSelected(selectedSlots, zoneId, date, timeSlot);

    if (isSelected) {
      setSelectedSlots(prev => prev.filter(slot => 
        !(slot.zoneId === zoneId && 
          slot.date.toDateString() === date.toDateString() && 
          slot.timeSlot === timeSlot)
      ));
    } else {
      setSelectedSlots(prev => [...prev, {
        zoneId,
        date: new Date(date),
        timeSlot,
        duration: 2 // Default 2 hours
      }]);
    }
  };

  const clearSelectionHandler = () => {
    setSelectedSlots([]);
  };

  return (
    <div className="space-y-4">
      <WeekNavigation
        currentWeekStart={currentWeekStart}
        onWeekChange={setCurrentWeekStart}
        canGoPrevious={canGoPrevious}
      />

      {/* Show strøtimer for each day of the week */}
      {weekDays.map(day => (
        <StrotimeDisplay
          key={day.toISOString()}
          strøtimer={strøtimer}
          date={day}
          onBookingComplete={handleStrøtimeBookingComplete}
        />
      ))}

      <ResponsiveCalendarGrid
        zone={zone}
        currentWeekStart={currentWeekStart}
        timeSlots={timeSlots}
        selectedSlots={selectedSlots}
        getAvailabilityStatus={(zoneId, date, timeSlot) => 
          availabilityStatusManager.getAvailabilityStatus(zoneId, date, timeSlot)
        }
        isSlotSelected={(zoneId, date, timeSlot) => isSlotSelected(selectedSlots, zoneId, date, timeSlot)}
        onSlotClick={handleSlotClick}
      />

      <LegendDisplay showLegend={showLegend} />

      <ZoneInfoHeader
        zone={zone}
        selectedSlots={selectedSlots}
        onPatternBuilderOpen={onPatternBuilderOpen}
        onClearSelection={clearSelectionHandler}
        onBookingDrawerOpen={onBookingDrawerOpen}
        zones={zones}
      />

      <SelectedSlotsDisplay selectedSlots={selectedSlots} />
    </div>
  );
}
