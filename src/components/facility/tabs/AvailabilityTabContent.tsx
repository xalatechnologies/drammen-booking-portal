
import React from 'react';
import { format } from 'date-fns';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot, RecurrencePattern, recurrenceEngine } from '@/utils/recurrenceEngine';
import { EnhancedZoneConflictManager } from '@/utils/enhancedZoneConflictManager';
import { isDateUnavailable } from '@/utils/holidaysAndAvailability';
import { WeekNavigation } from './WeekNavigation';
import { ZoneInfoHeader } from './ZoneInfoHeader';
import { CalendarGrid } from './CalendarGrid';
import { SelectedSlotsDisplay } from './SelectedSlotsDisplay';
import { LegendDisplay } from './LegendDisplay';
import { isSlotSelected, addSlotToSelection, removeSlotFromSelection } from './AvailabilityTabUtils';

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
  setCurrentPattern
}: AvailabilityTabContentProps) {
  const timeSlots = ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"];

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
    const zoneId = zone.id;
    
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
    } else {
      // No conflicts, proceed with booking
      setSelectedSlots(occurrences);
    }
  };

  return (
    <div className="space-y-4">
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

      <LegendDisplay showLegend={showLegend} />

      <ZoneInfoHeader
        zone={zone}
        selectedSlots={selectedSlots}
        onPatternBuilderOpen={onPatternBuilderOpen}
        onClearSelection={clearSelection}
        onBookingDrawerOpen={onBookingDrawerOpen}
        zones={zones}
      />

      <SelectedSlotsDisplay selectedSlots={selectedSlots} />
    </div>
  );
}
