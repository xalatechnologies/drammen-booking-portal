
import React from 'react';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot, RecurrencePattern } from '@/utils/recurrenceEngine';
import { EnhancedZoneConflictManager } from '@/utils/enhancedZoneConflictManager';
import { CalendarGrid } from './CalendarGrid';
import { CalendarSidebar } from '../CalendarSidebar';
import { WeekNavigation } from './WeekNavigation';
import { ZoneInfoHeader } from './ZoneInfoHeader';
import { ResponsiveCalendarGrid } from './ResponsiveCalendarGrid';

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
  
  const timeSlots = ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"];

  const getAvailabilityStatus = (zoneId: string, date: Date, timeSlot: string) => {
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
        duration: 2 // Default 2-hour duration
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
    <div className="space-y-6">
      {/* Zone Info Header */}
      <ZoneInfoHeader 
        zone={zone} 
        selectedSlots={selectedSlots}
        onPatternBuilderOpen={() => {}}
        onClearSelection={handleClearSlots}
        onBookingDrawerOpen={() => {}}
        zones={zones}
      />

      {/* Week Navigation */}
      <WeekNavigation 
        currentWeekStart={currentWeekStart}
        onWeekChange={setCurrentWeekStart}
        canGoPrevious={canGoPrevious}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Calendar Column - 70% */}
        <div className="lg:col-span-7">
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
