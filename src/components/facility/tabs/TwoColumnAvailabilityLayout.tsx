
import React from 'react';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot, RecurrencePattern } from '@/utils/recurrenceEngine';
import { EnhancedZoneConflictManager } from '@/utils/enhancedZoneConflictManager';
import { CalendarGrid } from './CalendarGrid';
import { CalendarSidebar } from '../CalendarSidebar';
import { WeekNavigation } from './WeekNavigation';
import { ZoneInfoHeader } from './ZoneInfoHeader';
import { ResponsiveCalendarGrid } from './ResponsiveCalendarGrid';
import { LegendDisplay } from './LegendDisplay';

interface TwoColumnAvailabilityLayoutProps {
  zone: Zone;
  zones: Zone[];
  currentWeekStart: Date;
  setCurrentWeekStart: (date: Date) => void;
  canGoPrevious: boolean;
  selectedSlots: SelectedTimeSlot[];
  setSelectedSlots: (slots: SelectedTimeSlot[]) => void;
  conflictManager: EnhancedZoneConflictManager;
  facilityId: string;
  facilityName: string;
  openingHours: string;
  currentPattern: RecurrencePattern;
  setCurrentPattern: (pattern: RecurrencePattern) => void;
  onPatternApply: (pattern: RecurrencePattern) => void;
}

export function TwoColumnAvailabilityLayout({
  zone,
  zones,
  currentWeekStart,
  setCurrentWeekStart,
  canGoPrevious,
  selectedSlots,
  setSelectedSlots,
  conflictManager,
  facilityId,
  facilityName,
  openingHours,
  currentPattern,
  setCurrentPattern,
  onPatternApply
}: TwoColumnAvailabilityLayoutProps) {
  
  // Generate hourly time slots from 08:00 to 22:00
  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = 8 + i;
    const nextHour = hour + 1;
    return `${hour.toString().padStart(2, '0')}:00-${nextHour.toString().padStart(2, '0')}:00`;
  });

  const getAvailabilityStatus = (zoneId: string, date: Date, timeSlot: string) => {
    // Check if the time slot is in the past
    const now = new Date();
    const timeHour = parseInt(timeSlot.split(':')[0]);
    const slotDateTime = new Date(date);
    slotDateTime.setHours(timeHour, 0, 0, 0);
    
    if (slotDateTime < now) {
      return { status: 'unavailable', conflict: null };
    }

    const conflict = conflictManager.checkZoneConflict(zoneId, date, timeSlot);
    if (conflict) {
      return { status: 'busy', conflict: conflict };
    }
    return { status: 'available', conflict: null };
  };

  const isSlotSelected = (zoneId: string, date: Date, timeSlot: string) => {
    return selectedSlots.some(slot => 
      slot.zoneId === zoneId &&
      slot.date.toDateString() === date.toDateString() &&
      slot.timeSlot === timeSlot
    );
  };

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    if (availability !== 'available') return;

    const isSelected = isSlotSelected(zoneId, date, timeSlot);
    if (isSelected) {
      setSelectedSlots(selectedSlots.filter(slot => 
        !(slot.zoneId === zoneId &&
          slot.date.toDateString() === date.toDateString() &&
          slot.timeSlot === timeSlot)
      ));
    } else {
      setSelectedSlots([...selectedSlots, { 
        zoneId, 
        date, 
        timeSlot,
        duration: 1 // Changed to 1 hour duration for hourly slots
      }]);
    }
  };

  const handleRemoveSlot = (zoneId: string, date: Date, timeSlot: string) => {
    setSelectedSlots(selectedSlots.filter(slot => 
      !(slot.zoneId === zoneId &&
        slot.date.toDateString() === date.toDateString() &&
        slot.timeSlot === timeSlot)
    ));
  };

  const handleClearSlots = () => {
    setSelectedSlots([]);
  };

  return (
    <div className="space-y-4">
      {/* Zone Info Header */}
      <ZoneInfoHeader 
        zone={zone} 
        selectedSlots={selectedSlots}
        onPatternBuilderOpen={() => {}}
        onClearSelection={handleClearSlots}
        onBookingDrawerOpen={() => {}}
        zones={zones}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Calendar Column - 70% */}
        <div className="lg:col-span-7">
          {/* Week Navigation - positioned on the left side */}
          <div className="mb-4">
            <WeekNavigation 
              currentWeekStart={currentWeekStart}
              onWeekChange={setCurrentWeekStart}
              canGoPrevious={canGoPrevious}
            />
          </div>

          {/* Desktop Calendar */}
          <div className="hidden lg:block">
            <CalendarGrid
              zone={zone}
              currentWeekStart={currentWeekStart}
              timeSlots={timeSlots}
              selectedSlots={selectedSlots}
              getAvailabilityStatus={getAvailabilityStatus}
              isSlotSelected={isSlotSelected}
              onSlotClick={handleSlotClick}
            />
          </div>
          
          {/* Mobile/Tablet Responsive Calendar */}
          <div className="lg:hidden">
            <ResponsiveCalendarGrid
              zone={zone}
              currentWeekStart={currentWeekStart}
              timeSlots={timeSlots}
              selectedSlots={selectedSlots}
              getAvailabilityStatus={getAvailabilityStatus}
              isSlotSelected={isSlotSelected}
              onSlotClick={handleSlotClick}
            />
          </div>

          {/* Legend positioned under calendar with same width */}
          <div className="mt-4">
            <LegendDisplay />
          </div>
        </div>

        {/* Sidebar Column - 30% */}
        <div className="lg:col-span-3">
          <CalendarSidebar
            selectedSlots={selectedSlots}
            onClearSlots={handleClearSlots}
            onRemoveSlot={handleRemoveSlot}
            facilityId={facilityId}
            facilityName={facilityName}
            zones={zones}
            currentPattern={currentPattern}
            onPatternChange={setCurrentPattern}
            onPatternApply={onPatternApply}
          />
        </div>
      </div>
    </div>
  );
}
