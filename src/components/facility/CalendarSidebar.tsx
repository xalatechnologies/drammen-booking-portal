
import React from 'react';
import { BookingStepsAccordion } from './sidebar/BookingStepsAccordion';
import { SelectedTimeSlot, RecurrencePattern } from '@/utils/recurrenceEngine';
import { Zone } from '@/components/booking/types';

interface CalendarSidebarProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones: Zone[];
  onRemoveSlot: (zoneId: string, date: Date, timeSlot: string) => void;
  onClearAll?: () => void;
  onClearSlots?: () => void;
  currentPattern?: RecurrencePattern;
  onPatternChange?: (pattern: RecurrencePattern) => void;
  onPatternApply?: (pattern: RecurrencePattern) => void;
}

export function CalendarSidebar({
  selectedSlots,
  facilityId,
  facilityName,
  zones,
  onRemoveSlot,
  onClearAll,
  onClearSlots,
  currentPattern,
  onPatternChange,
  onPatternApply
}: CalendarSidebarProps) {
  // Use either onClearAll or onClearSlots
  const handleClear = onClearAll || onClearSlots || (() => {});

  return (
    <div className="w-80 p-4 bg-white border-l border-gray-200">
      <BookingStepsAccordion
        selectedSlots={selectedSlots}
        facilityId={facilityId}
        facilityName={facilityName}
        zones={zones}
        onRemoveSlot={onRemoveSlot}
        onClearAll={handleClear}
      />
    </div>
  );
}
