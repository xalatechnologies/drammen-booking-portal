
import React from 'react';
import { AvailabilityTab } from '@/components/facility/tabs/AvailabilityTab';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';

interface FacilityDetailCalendarProps {
  zones: Zone[];
  selectedSlots: SelectedTimeSlot[];
  onSlotClick: (zoneId: string, date: Date, timeSlot: string, availability: string) => void;
  onBulkSlotSelection: (slots: SelectedTimeSlot[]) => void;
  onClearSlots: () => void;
  onRemoveSlot: (zoneId: string, date: Date, timeSlot: string) => void;
  facilityId: string;
  facilityName: string;
  currentPattern: any;
  onPatternChange: (pattern: any) => void;
  onPatternApply: (pattern: any) => void;
  timeSlotDuration: number;
}

export function FacilityDetailCalendar({
  zones,
  selectedSlots,
  onSlotClick,
  onBulkSlotSelection,
  onClearSlots,
  onRemoveSlot,
  facilityId,
  facilityName,
  currentPattern,
  onPatternChange,
  onPatternApply,
  timeSlotDuration
}: FacilityDetailCalendarProps) {
  console.log('FacilityDetailCalendar: Rendering with selectedSlots:', selectedSlots);
  console.log('FacilityDetailCalendar: facilityId:', facilityId, 'facilityName:', facilityName);

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <div className="w-full mb-12">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Tilgjengelighet og booking</h2>
          <AvailabilityTab 
            zones={zones} 
            selectedSlots={selectedSlots}
            onSlotClick={onSlotClick}
            onBulkSlotSelection={onBulkSlotSelection}
            onClearSlots={onClearSlots}
            onRemoveSlot={onRemoveSlot}
            facilityId={facilityId} 
            facilityName={facilityName}
            currentPattern={currentPattern}
            onPatternChange={onPatternChange}
            onPatternApply={onPatternApply}
            timeSlotDuration={timeSlotDuration}
          />
        </div>
      </div>
    </div>
  );
}
