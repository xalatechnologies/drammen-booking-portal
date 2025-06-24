
import React from 'react';
import { BookingStepsAccordion } from './sidebar/BookingStepsAccordion';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from '@/components/booking/types';

interface CalendarSidebarProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones: Zone[];
  onRemoveSlot: (zoneId: string, date: Date, timeSlot: string) => void;
  onClearAll: () => void;
}

export function CalendarSidebar({
  selectedSlots,
  facilityId,
  facilityName,
  zones,
  onRemoveSlot,
  onClearAll
}: CalendarSidebarProps) {
  return (
    <div className="w-80 p-4 bg-white border-l border-gray-200">
      <BookingStepsAccordion
        selectedSlots={selectedSlots}
        facilityId={facilityId}
        facilityName={facilityName}
        zones={zones}
        onRemoveSlot={onRemoveSlot}
        onClearAll={onClearAll}
      />
    </div>
  );
}
