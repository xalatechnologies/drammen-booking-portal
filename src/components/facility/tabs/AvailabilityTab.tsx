
import React, { useState, useCallback, useMemo } from 'react';
import { addDays, startOfWeek } from 'date-fns';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { CalendarGrid } from './CalendarGrid';
import { ResponsiveCalendarGrid } from './ResponsiveCalendarGrid';
import { CalendarSidebar } from '../CalendarSidebar';
import { WeekNavigation } from './WeekNavigation';
import { useAvailabilityStatus } from './useAvailabilityStatus';

interface AvailabilityTabProps {
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
  timeSlotDuration?: 1 | 2; // New prop for time slot duration
}

export function AvailabilityTab({
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
  timeSlotDuration = 1 // Default to 1-hour slots
}: AvailabilityTabProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { getAvailabilityStatus, isSlotSelected } = useAvailabilityStatus(selectedSlots);

  const timeSlots = useMemo(() => {
    if (timeSlotDuration === 2) {
      // 2-hour slots
      return [
        "08:00-10:00",
        "10:00-12:00", 
        "12:00-14:00",
        "14:00-16:00",
        "16:00-18:00",
        "18:00-20:00",
        "20:00-22:00"
      ];
    } else {
      // 1-hour slots (default)
      return [
        "08:00-09:00",
        "09:00-10:00",
        "10:00-11:00",
        "11:00-12:00",
        "12:00-13:00",
        "13:00-14:00",
        "14:00-15:00",
        "15:00-16:00",
        "16:00-17:00",
        "17:00-18:00",
        "18:00-19:00",
        "19:00-20:00",
        "20:00-21:00",
        "21:00-22:00"
      ];
    }
  }, [timeSlotDuration]);

  const handlePreviousWeek = useCallback(() => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calendarComponent = isMobile ? (
    <ResponsiveCalendarGrid
      zone={selectedZone}
      currentWeekStart={currentWeekStart}
      timeSlots={timeSlots}
      selectedSlots={selectedSlots}
      getAvailabilityStatus={getAvailabilityStatus}
      isSlotSelected={isSlotSelected}
      onSlotClick={onSlotClick}
      onBulkSlotSelection={onBulkSlotSelection}
    />
  ) : (
    <CalendarGrid
      zone={selectedZone}
      currentWeekStart={currentWeekStart}
      timeSlots={timeSlots}
      selectedSlots={selectedSlots}
      getAvailabilityStatus={getAvailabilityStatus}
      isSlotSelected={isSlotSelected}
      onSlotClick={onSlotClick}
      onBulkSlotSelection={onBulkSlotSelection}
    />
  );

  return (
    <div className="space-y-4">
      {/* Zone Selection */}
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium">Velg sone:</label>
        <select 
          value={selectedZone.id} 
          onChange={(e) => {
            const zone = zones.find(z => z.id === e.target.value);
            if (zone) setSelectedZone(zone);
          }}
          className="px-3 py-2 border rounded-md"
        >
          {zones.map(zone => (
            <option key={zone.id} value={zone.id}>
              {zone.name}
            </option>
          ))}
        </select>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Calendar Column - 70% */}
        <div className="lg:col-span-7">
          <div className="space-y-4">
            <WeekNavigation
              currentWeekStart={currentWeekStart}
              onWeekChange={setCurrentWeekStart}
              canGoPrevious={true}
            />
            {calendarComponent}
          </div>
        </div>

        {/* Sidebar Column - 30% */}
        <div className="lg:col-span-3">
          <CalendarSidebar
            selectedSlots={selectedSlots}
            onClearSlots={onClearSlots}
            onRemoveSlot={onRemoveSlot}
            facilityId={facilityId}
            facilityName={facilityName}
            zones={zones}
            currentPattern={currentPattern}
            onPatternChange={onPatternChange}
            onPatternApply={onPatternApply}
          />
        </div>
      </div>
    </div>
  );
}
