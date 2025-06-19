
import React from 'react';
import { format, addDays } from 'date-fns';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot, RecurrencePattern, recurrenceEngine } from '@/utils/recurrenceEngine';
import { EnhancedZoneConflictManager } from '@/utils/enhancedZoneConflictManager';
import { isDateUnavailable } from '@/utils/holidaysAndAvailability';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from '@/i18n';
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
  facilityId?: string;
  facilityName?: string;
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
  facilityName = ""
}: AvailabilityTabContentProps) {
  const timeSlots = ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"];
  const { addToCart } = useCart();
  const { t } = useTranslation();

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
      // Add to both local selection and global cart
      const newSlot = { zoneId, date, timeSlot };
      setSelectedSlots(prev => addSlotToSelection(prev, zoneId, date, timeSlot));
      
      // Add to global cart
      addToCart({
        facilityId,
        facilityName,
        zoneId,
        date,
        timeSlot,
        pricePerHour: zone.pricePerHour
      });
    }
  };

  const clearSelection = () => {
    setSelectedSlots([]);
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
