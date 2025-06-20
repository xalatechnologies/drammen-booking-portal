
import React from 'react';
import { format, addDays } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { isNorwegianHoliday } from '@/utils/holidaysAndAvailability';
import { ConflictTooltip } from '@/components/facility/ConflictTooltip';
import { useDragSelection } from '@/hooks/useDragSelection';

interface CalendarGridProps {
  zone: Zone;
  currentWeekStart: Date;
  timeSlots: string[];
  selectedSlots: SelectedTimeSlot[];
  getAvailabilityStatus: (zoneId: string, date: Date, timeSlot: string) => { status: string; conflict: any };
  isSlotSelected: (zoneId: string, date: Date, timeSlot: string) => boolean;
  onSlotClick: (zoneId: string, date: Date, timeSlot: string, availability: string) => void;
  onBulkSlotSelection?: (slots: SelectedTimeSlot[]) => void;
}

export function CalendarGrid({ 
  zone, 
  currentWeekStart, 
  timeSlots, 
  selectedSlots, 
  getAvailabilityStatus, 
  isSlotSelected, 
  onSlotClick,
  onBulkSlotSelection 
}: CalendarGridProps) {
  const weekDays = Array(7).fill(0).map((_, i) => addDays(currentWeekStart, i));
  const { dragState, startDrag, updateDrag, endDrag, cancelDrag, isSlotInPreview } = useDragSelection();

  const getStatusStyle = (status: string, isSelected: boolean, isInPreview: boolean) => {
    if (isSelected) {
      return 'bg-blue-500 hover:bg-blue-600 text-white font-semibold border border-blue-600';
    }
    
    if (isInPreview) {
      return 'bg-blue-200 hover:bg-blue-300 border border-blue-400 text-blue-800 font-medium cursor-pointer';
    }
    
    switch (status) {
      case 'available':
        return 'bg-green-100 hover:bg-green-200 border border-green-300 text-gray-800 hover:shadow-sm cursor-pointer';
      case 'busy':
        return 'bg-red-50 border border-red-200 text-gray-500 line-through cursor-not-allowed';
      case 'unavailable':
      default:
        return 'bg-gray-100 border border-gray-200 text-gray-400 line-through cursor-not-allowed';
    }
  };

  const handleMouseDown = (day: Date, timeSlot: string, event: React.MouseEvent) => {
    const { status } = getAvailabilityStatus(zone.id, day, timeSlot);
    if (status === 'available') {
      startDrag(zone.id, day, timeSlot, event);
    }
  };

  const handleMouseEnter = (day: Date, timeSlot: string) => {
    if (dragState.isDragging) {
      updateDrag(zone.id, day, timeSlot, timeSlots, weekDays, getAvailabilityStatus);
    }
  };

  const handleMouseUp = () => {
    if (dragState.isDragging) {
      const previewSlots = endDrag();
      
      // Use bulk selection if available, otherwise fall back to individual selection
      if (onBulkSlotSelection && previewSlots.length > 0) {
        // Filter out already selected slots
        const newSlots = previewSlots.filter(slot => 
          !isSlotSelected(slot.zoneId, slot.date, slot.timeSlot)
        );
        if (newSlots.length > 0) {
          onBulkSlotSelection(newSlots);
        }
      } else {
        // Fallback to individual selection
        previewSlots.forEach(slot => {
          if (!isSlotSelected(slot.zoneId, slot.date, slot.timeSlot)) {
            onSlotClick(slot.zoneId, slot.date, slot.timeSlot, 'available');
          }
        });
      }
    }
  };

  const handleClick = (day: Date, timeSlot: string, status: string, event: React.MouseEvent) => {
    // Only handle click if we're not in the middle of a drag operation
    if (!dragState.isDragging) {
      onSlotClick(zone.id, day, timeSlot, status);
    }
  };

  const renderTimeSlotCell = (day: Date, timeSlot: string, dayIndex: number) => {
    const { status, conflict } = getAvailabilityStatus(zone.id, day, timeSlot);
    const isSelected = isSlotSelected(zone.id, day, timeSlot);
    const isInPreview = isSlotInPreview(zone.id, day, timeSlot);
    const statusStyle = getStatusStyle(status, isSelected, isInPreview);
    
    // Extract just the start time from timeSlot (e.g., "08:00" from "08:00-09:00")
    const startTime = timeSlot.split('-')[0];
    
    const cell = (
      <button
        className={`w-full h-8 rounded border transition-all duration-200 text-sm select-none ${statusStyle} ${
          status === 'available' ? 'transform hover:scale-105' : ''
        }`}
        disabled={status !== 'available'}
        onMouseDown={(e) => handleMouseDown(day, timeSlot, e)}
        onMouseEnter={() => handleMouseEnter(day, timeSlot)}
        onMouseUp={handleMouseUp}
        onClick={(e) => handleClick(day, timeSlot, status, e)}
        title={status === 'available' ? `Book ${timeSlot}` : 
               status === 'busy' ? 'Opptatt' : 'Ikke tilgjengelig'}
        style={{ userSelect: 'none' }}
      >
        <div className="flex items-center justify-center h-full">
          <span className={`text-sm font-medium ${isSelected ? 'text-white' : isInPreview ? 'text-blue-800' : 'text-gray-700'}`}>
            {startTime}
          </span>
          {isSelected && (
            <span className="text-sm text-white ml-1">✓</span>
          )}
          {isInPreview && !isSelected && (
            <span className="text-sm text-blue-800 ml-1">◯</span>
          )}
        </div>
      </button>
    );

    if (conflict) {
      return (
        <ConflictTooltip key={dayIndex} conflict={conflict}>
          {cell}
        </ConflictTooltip>
      );
    }

    return cell;
  };

  return (
    <div 
      onMouseLeave={cancelDrag}
      onMouseUp={handleMouseUp}
      style={{ userSelect: 'none' }}
    >
      <Card>
        <CardContent className="p-4">
          {/* Compact Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day, i) => {
              const holidayCheck = isNorwegianHoliday(day);
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              
              return (
                <div key={i} className={`p-2 text-center rounded-lg border ${
                  isToday 
                    ? 'bg-blue-500 border-blue-600 text-white' 
                    : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}>
                  <div className="text-xs font-medium uppercase tracking-wide">
                    {format(day, "EEE", { locale: nb })}
                  </div>
                  <div className="text-lg font-bold mt-1">
                    {format(day, "dd", { locale: nb })}
                  </div>
                  {holidayCheck.isHoliday && (
                    <div className="text-xs text-red-600 truncate mt-1" title={holidayCheck.name}>
                      {holidayCheck.name?.substring(0, 4)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Time Slots Grid */}
          <div className="space-y-1">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="grid grid-cols-7 gap-2">
                {weekDays.map((day, dayIndex) => (
                  <div key={dayIndex} className="relative">
                    {renderTimeSlotCell(day, timeSlot, dayIndex)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
