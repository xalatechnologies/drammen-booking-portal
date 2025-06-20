
import React from 'react';
import { format, addDays } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { isNorwegianHoliday } from '@/utils/holidaysAndAvailability';
import { ConflictTooltip } from '@/components/facility/ConflictTooltip';

interface CalendarGridProps {
  zone: Zone;
  currentWeekStart: Date;
  timeSlots: string[];
  selectedSlots: SelectedTimeSlot[];
  getAvailabilityStatus: (zoneId: string, date: Date, timeSlot: string) => { status: string; conflict: any };
  isSlotSelected: (zoneId: string, date: Date, timeSlot: string) => boolean;
  onSlotClick: (zoneId: string, date: Date, timeSlot: string, availability: string) => void;
}

export function CalendarGrid({ 
  zone, 
  currentWeekStart, 
  timeSlots, 
  selectedSlots, 
  getAvailabilityStatus, 
  isSlotSelected, 
  onSlotClick 
}: CalendarGridProps) {
  const weekDays = Array(7).fill(0).map((_, i) => addDays(currentWeekStart, i));

  const getStatusStyle = (status: string, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-blue-500 hover:bg-blue-600 text-white font-semibold border-2 border-blue-600';
    }
    
    switch (status) {
      case 'available':
        return 'bg-green-100 hover:bg-green-200 border border-green-300 text-gray-800 hover:shadow-md cursor-pointer';
      case 'busy':
        return 'bg-red-50 border border-red-200 text-gray-500 line-through cursor-not-allowed';
      case 'unavailable':
      default:
        return 'bg-gray-100 border border-gray-200 text-gray-400 line-through cursor-not-allowed';
    }
  };

  const renderTimeSlotCell = (day: Date, timeSlot: string, dayIndex: number) => {
    const { status, conflict } = getAvailabilityStatus(zone.id, day, timeSlot);
    const isSelected = isSlotSelected(zone.id, day, timeSlot);
    const statusStyle = getStatusStyle(status, isSelected);
    
    // Extract just the start time from timeSlot (e.g., "08:00" from "08:00-10:00")
    const startTime = timeSlot.split('-')[0];
    
    const cell = (
      <button
        className={`w-full h-14 rounded-lg transition-all duration-200 text-base font-medium ${statusStyle} ${
          status === 'available' ? 'transform hover:scale-105' : ''
        }`}
        disabled={status !== 'available'}
        onClick={() => status === 'available' && onSlotClick(zone.id, day, timeSlot, status)}
        title={status === 'available' ? `Book ${timeSlot}` : 
               status === 'busy' ? 'Opptatt' : 'Ikke tilgjengelig'}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
            {startTime}
          </span>
          {isSelected && (
            <span className="text-sm text-white mt-1">✓</span>
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
    <Card>
      <CardContent className="p-4">
        {/* Week Header */}
        <div className="mb-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {format(currentWeekStart, 'dd. MMMM', { locale: nb })} - {format(addDays(currentWeekStart, 6), 'dd. MMMM yyyy', { locale: nb })}
          </h3>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day, i) => {
            const holidayCheck = isNorwegianHoliday(day);
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            
            return (
              <div key={i} className={`p-4 text-center rounded-lg font-inter ${
                isToday ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className={`text-base font-medium ${isToday ? 'text-blue-800' : 'text-gray-700'}`}>
                  {format(day, "EEE", { locale: nb })}
                </div>
                <div className={`text-xl font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                  {format(day, "dd.MM", { locale: nb })}
                </div>
                {holidayCheck.isHoliday && (
                  <div className="text-xs text-red-600 truncate font-inter mt-1" title={holidayCheck.name}>
                    {holidayCheck.name?.substring(0, 8)}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Time Slots Grid */}
        <div className="space-y-2">
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
  );
}
