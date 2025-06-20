
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
  timeSlotDuration?: number; // Now supports any number of hours
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
  const [customTimeSlotDuration, setCustomTimeSlotDuration] = useState(timeSlotDuration);

  const { getAvailabilityStatus, isSlotSelected } = useAvailabilityStatus(selectedSlots);

  const timeSlots = useMemo(() => {
    const duration = customTimeSlotDuration;
    const slots = [];
    
    // Generate slots from 08:00 to 22:00 based on duration
    for (let hour = 8; hour < 22; hour += duration) {
      const endHour = Math.min(hour + duration, 22);
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${endHour.toString().padStart(2, '0')}:00`;
      slots.push(`${startTime}-${endTime}`);
    }
    
    return slots;
  }, [customTimeSlotDuration]);

  const handlePreviousWeek = useCallback(() => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  }, []);

  const handleTimeSlotDurationChange = (value: number) => {
    if (value >= 1 && value <= 14) {
      setCustomTimeSlotDuration(value);
    }
  };

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
      {/* Zone Selection and Time Slot Duration */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-4">
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
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Tidsluke varighet:</label>
          <input
            type="number"
            min="1"
            max="14"
            value={customTimeSlotDuration}
            onChange={(e) => handleTimeSlotDurationChange(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1 border rounded text-center"
          />
          <span className="text-sm text-gray-600">timer</span>
        </div>
      </div>

      {/* Helper Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Klikk på kalenderen for å velge tidspunkt, eller dra for å velge flere tidsluke på en gang. Du kan også justere tidsluke varighet ovenfor.
        </p>
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
