
import React, { useMemo, useCallback } from 'react';
import { format, addDays, isToday, isPast } from 'date-fns';
import { nb } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { useAvailabilityCache } from '@/hooks/useAvailabilityCache';

interface EnhancedCalendarGridProps {
  zone: Zone;
  currentWeekStart: Date;
  timeSlots: string[];
  selectedSlots: SelectedTimeSlot[];
  onSlotClick: (zoneId: string, date: Date, timeSlot: string, availability: string) => void;
  onBulkSlotSelection?: (slots: SelectedTimeSlot[]) => void;
  getAvailabilityStatus: (zoneId: string, date: Date, timeSlot: string) => { status: string; conflict: any };
  isSlotSelected: (zoneId: string, date: Date, timeSlot: string) => boolean;
  enableBulkSelection?: boolean;
}

export function EnhancedCalendarGrid({
  zone,
  currentWeekStart,
  timeSlots,
  selectedSlots,
  onSlotClick,
  onBulkSlotSelection,
  getAvailabilityStatus,
  isSlotSelected,
  enableBulkSelection = false
}: EnhancedCalendarGridProps) {
  const { getAvailabilityStatus: cachedGetAvailabilityStatus, invalidateSlot } = useAvailabilityCache();

  // Generate week days
  const weekDays = useMemo(() => 
    Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)),
    [currentWeekStart]
  );

  // Enhanced availability checking with caching
  const getCachedAvailabilityStatus = useCallback((zoneId: string, date: Date, timeSlot: string) => {
    return cachedGetAvailabilityStatus(zoneId, date, timeSlot, getAvailabilityStatus);
  }, [cachedGetAvailabilityStatus, getAvailabilityStatus]);

  // Bulk selection handlers
  const handleBulkSelectDay = useCallback((day: Date) => {
    if (!enableBulkSelection || !onBulkSlotSelection) return;

    const daySlots = timeSlots
      .filter(timeSlot => {
        const availability = getCachedAvailabilityStatus(zone.id, day, timeSlot);
        return availability.status === 'available';
      })
      .map(timeSlot => ({
        zoneId: zone.id,
        date: day,
        timeSlot,
        duration: 1
      }));

    onBulkSlotSelection(daySlots);
  }, [enableBulkSelection, onBulkSlotSelection, timeSlots, zone.id, getCachedAvailabilityStatus]);

  const handleBulkSelectTimeSlot = useCallback((timeSlot: string) => {
    if (!enableBulkSelection || !onBulkSlotSelection) return;

    const timeSlotSlots = weekDays
      .filter(day => {
        const availability = getCachedAvailabilityStatus(zone.id, day, timeSlot);
        return availability.status === 'available';
      })
      .map(day => ({
        zoneId: zone.id,
        date: day,
        timeSlot,
        duration: 1
      }));

    onBulkSlotSelection(timeSlotSlots);
  }, [enableBulkSelection, onBulkSlotSelection, weekDays, zone.id, getCachedAvailabilityStatus]);

  // Render slot cell with optimized styling
  const renderSlotCell = useCallback((day: Date, timeSlot: string) => {
    const availability = getCachedAvailabilityStatus(zone.id, day, timeSlot);
    const isSelected = isSlotSelected(zone.id, day, timeSlot);
    const isPastSlot = isPast(new Date(day.getFullYear(), day.getMonth(), day.getDate(), parseInt(timeSlot.split(':')[0])));

    const cellClasses = cn(
      "h-12 border border-gray-200 cursor-pointer transition-all duration-200 text-sm font-medium",
      {
        // Past slots
        "bg-gray-100 cursor-not-allowed opacity-50": isPastSlot,
        // Available slots
        "bg-green-50 hover:bg-green-100 border-green-200": availability.status === 'available' && !isPastSlot && !isSelected,
        // Busy/unavailable slots
        "bg-red-50 border-red-200 cursor-not-allowed": availability.status === 'busy' || (availability.status === 'unavailable' && !isPastSlot),
        // Selected slots
        "bg-blue-500 text-white border-blue-600": isSelected,
        // Today highlight
        "ring-2 ring-blue-300": isToday(day) && !isSelected
      }
    );

    const handleClick = () => {
      if (isPastSlot || availability.status === 'unavailable') return;
      onSlotClick(zone.id, day, timeSlot, availability.status);
      // Invalidate cache for this slot after selection
      invalidateSlot(zone.id, day, timeSlot);
    };

    return (
      <div
        key={`${format(day, 'yyyy-MM-dd')}-${timeSlot}`}
        className={cellClasses}
        onClick={handleClick}
        title={
          isPastSlot 
            ? 'Tidligere tidspunkt' 
            : availability.conflict 
              ? availability.conflict.details 
              : availability.status === 'available' 
                ? 'Ledig - klikk for å velge' 
                : 'Opptatt'
        }
      >
        <div className="flex items-center justify-center h-full">
          {isSelected && (
            <span className="text-xs">✓</span>
          )}
        </div>
      </div>
    );
  }, [zone.id, getCachedAvailabilityStatus, isSlotSelected, onSlotClick, invalidateSlot]);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Header row with days */}
      <div className="grid grid-cols-8 bg-gray-50">
        <div className="p-3 text-sm font-medium text-gray-700 border-r border-gray-200">
          Tid
        </div>
        {weekDays.map((day, index) => (
          <div 
            key={index} 
            className={cn(
              "p-3 text-center border-r border-gray-200 last:border-r-0",
              {
                "bg-blue-50 text-blue-900 font-semibold": isToday(day)
              }
            )}
          >
            <div className="text-xs font-medium">
              {format(day, 'EEE', { locale: nb })}
            </div>
            <div 
              className={cn(
                "text-sm cursor-pointer hover:text-blue-600",
                { "font-bold": isToday(day) }
              )}
              onClick={() => handleBulkSelectDay(day)}
              title={enableBulkSelection ? "Klikk for å velge hele dagen" : undefined}
            >
              {format(day, 'dd.MM')}
            </div>
          </div>
        ))}
      </div>

      {/* Time slot rows */}
      <div className="divide-y divide-gray-200">
        {timeSlots.map((timeSlot) => (
          <div key={timeSlot} className="grid grid-cols-8">
            <div 
              className="p-3 bg-gray-50 text-sm font-medium text-gray-700 border-r border-gray-200 cursor-pointer hover:text-blue-600"
              onClick={() => handleBulkSelectTimeSlot(timeSlot)}
              title={enableBulkSelection ? "Klikk for å velge hele tidsperioden" : undefined}
            >
              {timeSlot.split('-')[0]}
            </div>
            {weekDays.map((day) => renderSlotCell(day, timeSlot))}
          </div>
        ))}
      </div>
    </div>
  );
}
