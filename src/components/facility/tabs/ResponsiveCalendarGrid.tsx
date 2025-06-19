import React from 'react';
import { format, addDays } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { isNorwegianHoliday } from '@/utils/holidaysAndAvailability';
import { ConflictTooltip } from '@/components/facility/ConflictTooltip';
import { AlertTriangle } from 'lucide-react';

interface ResponsiveCalendarGridProps {
  zone: Zone;
  currentWeekStart: Date;
  timeSlots: string[];
  selectedSlots: SelectedTimeSlot[];
  getAvailabilityStatus: (zoneId: string, date: Date, timeSlot: string) => { status: string; conflict: any };
  isSlotSelected: (zoneId: string, date: Date, timeSlot: string) => boolean;
  onSlotClick: (zoneId: string, date: Date, timeSlot: string, availability: string) => void;
}

export function ResponsiveCalendarGrid({ 
  zone, 
  currentWeekStart, 
  timeSlots, 
  selectedSlots, 
  getAvailabilityStatus, 
  isSlotSelected, 
  onSlotClick 
}: ResponsiveCalendarGridProps) {
  const weekDays = Array(7).fill(0).map((_, i) => addDays(currentWeekStart, i));

  const getStatusColor = (status: string, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-blue-500 hover:bg-blue-600 border-blue-600 ring-2 ring-blue-300 text-white';
    }
    
    switch (status) {
      case 'available':
        return 'bg-green-100 hover:bg-green-200 border-green-400 hover:border-green-500';
      case 'busy':
        return 'bg-red-100 border-red-400 cursor-not-allowed';
      case 'unavailable':
      default:
        return 'bg-gray-100 border-gray-400 cursor-not-allowed';
    }
  };

  const renderSlotButton = (day: Date, timeSlot: string, dayIndex: number) => {
    const { status, conflict } = getAvailabilityStatus(zone.id, day, timeSlot);
    const isSelected = isSlotSelected(zone.id, day, timeSlot);
    const statusColor = getStatusColor(status, isSelected);
    
    const button = (
      <button
        className={`w-full h-7 md:h-8 rounded border transition-all duration-200 font-inter text-xs ${statusColor} ${
          status === 'available' 
            ? 'cursor-pointer shadow-sm hover:shadow-md transform active:scale-95 md:hover:scale-105' 
            : 'cursor-not-allowed opacity-75'
        }`}
        disabled={status !== 'available'}
        onClick={() => onSlotClick(zone.id, day, timeSlot, status)}
      >
        {isSelected && (
          <div className="text-xs font-medium">✓</div>
        )}
        {status === 'busy' && (
          <AlertTriangle className="h-2.5 w-2.5 mx-auto text-red-500" />
        )}
      </button>
    );

    if (conflict) {
      return (
        <ConflictTooltip key={dayIndex} conflict={conflict}>
          {button}
        </ConflictTooltip>
      );
    }

    return button;
  };

  return (
    <Card>
      <CardContent className="p-2 md:p-3">
        {/* Desktop Grid Layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-8 gap-1 mb-3">
            <div className="p-1.5 text-sm font-medium text-gray-500 font-inter text-center">Tid</div>
            {weekDays.map((day, i) => {
              const holidayCheck = isNorwegianHoliday(day);
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              return (
                <div key={i} className={`p-1.5 text-center rounded font-inter ${isToday ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'}`}>
                  <div className={`text-sm font-medium ${isToday ? 'text-blue-800' : 'text-gray-700'}`}>
                    {format(day, "EEE", { locale: nb })}
                  </div>
                  <div className={`text-sm font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                    {format(day, "dd.MM", { locale: nb })}
                  </div>
                  {holidayCheck.isHoliday && (
                    <div className="text-xs text-red-600 truncate font-inter" title={holidayCheck.name}>
                      {holidayCheck.name?.substring(0, 6)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-1">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="grid grid-cols-8 gap-1">
                <div className="p-1.5 text-sm font-medium text-gray-700 flex items-center justify-center bg-gray-50 rounded font-inter">
                  {timeSlot}
                </div>
                {weekDays.map((day, dayIndex) => (
                  <div key={dayIndex} className="relative">
                    {renderSlotButton(day, timeSlot, dayIndex)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Scrollable Layout */}
        <div className="md:hidden">
          <div className="flex gap-1 overflow-x-auto pb-3 mb-3">
            {weekDays.map((day, i) => {
              const holidayCheck = isNorwegianHoliday(day);
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              return (
                <div key={i} className={`flex-shrink-0 w-16 p-1.5 text-center rounded font-inter ${isToday ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'}`}>
                  <div className={`text-xs font-medium ${isToday ? 'text-blue-800' : 'text-gray-700'}`}>
                    {format(day, "EEE", { locale: nb })}
                  </div>
                  <div className={`text-xs font-bold ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                    {format(day, "dd.MM", { locale: nb })}
                  </div>
                  {holidayCheck.isHoliday && (
                    <div className="text-xs text-red-600 truncate font-inter" title={holidayCheck.name}>
                      {holidayCheck.name?.substring(0, 4)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            {timeSlots.map((timeSlot) => (
              <div key={timeSlot} className="space-y-1">
                <div className="text-xs font-medium text-gray-700 bg-gray-50 p-1.5 rounded text-center">
                  {timeSlot}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map((day, dayIndex) => (
                    <div key={dayIndex} className="relative">
                      {renderSlotButton(day, timeSlot, dayIndex)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
