
import React, { useState } from 'react';
import { Zone } from '@/components/booking/types';
import { useSlotSelection } from '@/hooks/useSlotSelection';
import { AvailabilityTab } from '@/components/facility/tabs/AvailabilityTab';
import { RecurrencePattern } from '@/utils/recurrenceEngine';

interface FacilityDetailCalendarProps {
  zones: Zone[];
  facilityId: string;
  facilityName: string;
  timeSlotDuration?: number;
  currentPattern?: RecurrencePattern;
  onPatternChange?: (pattern: RecurrencePattern) => void;
  onPatternApply?: (pattern: RecurrencePattern) => void;
}

export function FacilityDetailCalendar({
  zones,
  facilityId,
  facilityName,
  timeSlotDuration = 1,
  currentPattern,
  onPatternChange,
  onPatternApply
}: FacilityDetailCalendarProps) {
  const {
    selectedSlots,
    handleSlotClick,
    handleBulkSlotSelection,
    clearSelection
  } = useSlotSelection();

  const [localPattern, setLocalPattern] = useState<RecurrencePattern>(
    currentPattern || {
      type: 'weekly',
      weekdays: [],
      timeSlots: [],
      interval: 1
    }
  );

  const handleRemoveSlot = (zoneId: string, date: Date, timeSlot: string) => {
    handleSlotClick(zoneId, date, timeSlot, 'available');
  };

  const handlePatternChange = (pattern: RecurrencePattern) => {
    setLocalPattern(pattern);
    if (onPatternChange) {
      onPatternChange(pattern);
    }
  };

  const handlePatternApply = (pattern: RecurrencePattern) => {
    setLocalPattern(pattern);
    if (onPatternApply) {
      onPatternApply(pattern);
    }
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              Velg tidspunkt
            </h2>
            <p className="text-gray-600 mt-1">
              Velg ønskede tidspunkt for å starte booking prosessen
            </p>
          </div>
          
          <div className="p-6">
            <AvailabilityTab
              zones={zones}
              selectedSlots={selectedSlots}
              onSlotClick={handleSlotClick}
              onBulkSlotSelection={handleBulkSlotSelection}
              onClearSlots={clearSelection}
              onRemoveSlot={handleRemoveSlot}
              facilityId={facilityId}
              facilityName={facilityName}
              currentPattern={localPattern}
              onPatternChange={handlePatternChange}
              onPatternApply={handlePatternApply}
              timeSlotDuration={timeSlotDuration}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
