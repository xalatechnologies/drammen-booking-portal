import React, { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot, RecurrencePattern, recurrenceEngine } from '@/utils/recurrenceEngine';
import { EnhancedZoneConflictManager } from '@/utils/enhancedZoneConflictManager';
import { isDateUnavailable } from '@/utils/holidaysAndAvailability';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from '@/i18n';
import { WeekNavigation } from './WeekNavigation';
import { ZoneInfoHeader } from './ZoneInfoHeader';
import { ResponsiveCalendarGrid } from './ResponsiveCalendarGrid';
import { SelectedSlotsDisplay } from './SelectedSlotsDisplay';
import { LegendDisplay } from './LegendDisplay';
import { StrotimeDisplay } from './StrotimeDisplay';
import { isSlotSelected, addSlotToSelection, removeSlotFromSelection } from './AvailabilityTabUtils';
import { StrotimeService } from '@/services/StrotimeService';
import { StrøtimeSlot } from '@/types/booking/strøtimer';

interface AvailabilityTabContentProps {
  zone: Zone;
  zones: Zone[];
  currentWeekStart: Date;
  setCurrentWeekStart: (date: Date) => void;
  canGoPrevious: boolean;
  selectedSlots: SelectedTimeSlot[];
  setSelectedSlots: React.Dispatch<React.SetStateAction<SelectedTimeSlot[]>>;
  conflictManager: EnhancedZoneConflictManager;
  showLegend: boolean;
  onPatternBuilderOpen: () => void;
  onBookingDrawerOpen: () => void;
  setShowConflictWizard: (show: boolean) => void;
  setConflictResolutionData: (data: any) => void;
  currentPattern: RecurrencePattern;
  setCurrentPattern: (pattern: RecurrencePattern) => void;
  facilityId?: string;
  facilityName?: string;
  openingHours?: string;
}

export function AvailabilityTabContent({
  zone,
  zones,
  currentWeekStart,
  setCurrentWeekStart,
  canGoPrevious,
  selectedSlots,
  setSelectedSlots,
  conflictManager,
  showLegend,
  onPatternBuilderOpen,
  onBookingDrawerOpen,
  setShowConflictWizard,
  setConflictResolutionData,
  currentPattern,
  setCurrentPattern,
  facilityId = "",
  facilityName = "",
  openingHours = "08:00-22:00"
}: AvailabilityTabContentProps) {
  // Parse opening hours to generate time slots
  const parseOpeningHours = (hours: string) => {
    try {
      const [start, end] = hours.split('-');
      const startHour = parseInt(start.split(':')[0]);
      const endHour = parseInt(end.split(':')[0]);
      
      const slots = [];
      for (let hour = startHour; hour < endHour; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
      }
      return slots;
    } catch (error) {
      // Fallback to default hours if parsing fails
      return [
        "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
        "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", 
        "20:00", "21:00", "22:00"
      ];
    }
  };

  const timeSlots = parseOpeningHours(openingHours);
  const { addToCart } = useCart();
  const { t } = useTranslation();

  // Add state for strøtimer
  const [strøtimer, setStrøtimer] = useState<StrøtimeSlot[]>([]);
  const [loadingStrøtimer, setLoadingStrøtimer] = useState(false);

  // Fetch strøtimer for the current week
  useEffect(() => {
    const fetchStrøtimer = async () => {
      if (!facilityId) return;
      
      setLoadingStrøtimer(true);
      try {
        const response = await StrotimeService.getAvailableStrøtimer({
          facilityId,
          startDate: currentWeekStart,
          endDate: addDays(currentWeekStart, 6)
        });
        
        if (response.success) {
          setStrøtimer(response.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch strøtimer:', error);
      } finally {
        setLoadingStrøtimer(false);
      }
    };

    fetchStrøtimer();
  }, [facilityId, currentWeekStart]);

  const weekDays = Array(7).fill(0).map((_, i) => addDays(currentWeekStart, i));

  const getAvailabilityStatus = (zoneId: string, date: Date, timeSlot: string) => {
    const unavailableCheck = isDateUnavailable(date);
    if (unavailableCheck.isUnavailable) {
      return { status: 'unavailable', conflict: null };
    }

    const conflict = conflictManager.checkZoneConflict(zoneId, date, timeSlot);
    if (conflict) {
      return { status: 'busy', conflict };
    }

    return { status: 'available', conflict: null };
  };

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    if (availability !== 'available') return;

    const isSelected = isSlotSelected(selectedSlots, zoneId, date, timeSlot);

    if (isSelected) {
      setSelectedSlots(prev => removeSlotFromSelection(prev, zoneId, date, timeSlot));
    } else {
      // Add to both local selection and global cart
      const newSlot = { zoneId, date, timeSlot };
      setSelectedSlots(prev => addSlotToSelection(prev, zoneId, date, timeSlot));
      
      // Add to global cart with required duration property
      addToCart({
        facilityId,
        facilityName,
        zoneId,
        date,
        timeSlot,
        duration: 1, // 1-hour duration for hourly slots
        pricePerHour: zone.pricePerHour
      });
    }
  };

  const clearSelection = () => {
    setSelectedSlots([]);
  };

  const handleStrøtimeBookingComplete = (booking: any) => {
    // Refresh strøtimer after booking
    const fetchStrøtimer = async () => {
      if (!facilityId) return;
      
      try {
        const response = await StrotimeService.getAvailableStrøtimer({
          facilityId,
          startDate: currentWeekStart,
          endDate: addDays(currentWeekStart, 6)
        });
        
        if (response.success) {
          setStrøtimer(response.data || []);
        }
      } catch (error) {
        console.error('Failed to refresh strøtimer:', error);
      }
    };

    fetchStrøtimer();
  };

  return (
    <div className="space-y-4">
      <WeekNavigation
        currentWeekStart={currentWeekStart}
        onWeekChange={setCurrentWeekStart}
        canGoPrevious={canGoPrevious}
      />

      {/* Show strøtimer for each day of the week */}
      {weekDays.map(day => (
        <StrotimeDisplay
          key={day.toISOString()}
          strøtimer={strøtimer}
          date={day}
          onBookingComplete={handleStrøtimeBookingComplete}
        />
      ))}

      <ResponsiveCalendarGrid
        zone={zone}
        currentWeekStart={currentWeekStart}
        timeSlots={timeSlots}
        selectedSlots={selectedSlots}
        getAvailabilityStatus={getAvailabilityStatus}
        isSlotSelected={(zoneId, date, timeSlot) => isSlotSelected(selectedSlots, zoneId, date, timeSlot)}
        onSlotClick={handleSlotClick}
      />

      <LegendDisplay showLegend={showLegend} />

      <ZoneInfoHeader
        zone={zone}
        selectedSlots={selectedSlots}
        onPatternBuilderOpen={onPatternBuilderOpen}
        onClearSelection={clearSelection}
        onBookingDrawerOpen={onBookingDrawerOpen}
        zones={zones}
      />

      <SelectedSlotsDisplay selectedSlots={selectedSlots} />
    </div>
  );
}
