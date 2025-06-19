
import React from 'react';
import { addDays } from 'date-fns';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot, RecurrencePattern } from '@/utils/recurrenceEngine';
import { EnhancedZoneConflictManager } from '@/utils/enhancedZoneConflictManager';
import { useTranslation } from '@/i18n';
import { WeekNavigation } from './WeekNavigation';
import { ZoneInfoHeader } from './ZoneInfoHeader';
import { ResponsiveCalendarGrid } from './ResponsiveCalendarGrid';
import { SelectedSlotsDisplay } from './SelectedSlotsDisplay';
import { LegendDisplay } from './LegendDisplay';
import { StrotimeDisplay } from './StrotimeDisplay';
import { AvailabilityStatusManager } from './AvailabilityStatusManager';
import { useStrotimer } from '@/hooks/useStrotimer';
import { parseOpeningHours } from '@/utils/openingHoursParser';
import { isSlotSelected } from './AvailabilityTabUtils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Zap } from 'lucide-react';

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
  const timeSlots = parseOpeningHours(openingHours);
  const { t } = useTranslation();

  // Use custom hooks for separated concerns
  const { strøtimer, handleStrøtimeBookingComplete } = useStrotimer({
    facilityId,
    currentWeekStart
  });

  // Create availability status manager
  const availabilityStatusManager = new AvailabilityStatusManager(conflictManager);

  const weekDays = Array(7).fill(0).map((_, i) => addDays(currentWeekStart, i));

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    if (availability !== 'available') return;

    const isSelected = isSlotSelected(selectedSlots, zoneId, date, timeSlot);

    if (isSelected) {
      setSelectedSlots(prev => prev.filter(slot => 
        !(slot.zoneId === zoneId && 
          slot.date.toDateString() === date.toDateString() && 
          slot.timeSlot === timeSlot)
      ));
    } else {
      setSelectedSlots(prev => [...prev, {
        zoneId,
        date: new Date(date),
        timeSlot,
        duration: 2 // Default 2 hours
      }]);
    }
  };

  const clearSelectionHandler = () => {
    setSelectedSlots([]);
  };

  // Enhanced booking handler that properly passes selected slots
  const handleBookingClick = () => {
    if (selectedSlots.length === 0) {
      // Show a message that user needs to select slots first
      console.log('No slots selected');
      return;
    }
    console.log('Opening booking drawer with selected slots:', selectedSlots);
    onBookingDrawerOpen();
  };

  // Check if there are any strøtimer for the current week
  const hasStrøtimer = strøtimer.length > 0;

  console.log('AvailabilityTabContent - Opening hours:', openingHours);
  console.log('AvailabilityTabContent - Generated time slots:', timeSlots);
  console.log('AvailabilityTabContent - Strøtimer data:', strøtimer);
  console.log('AvailabilityTabContent - FacilityId:', facilityId);
  console.log('AvailabilityTabContent - Current week start:', currentWeekStart);
  console.log('AvailabilityTabContent - Selected slots:', selectedSlots);

  return (
    <div className="space-y-4">
      <WeekNavigation
        currentWeekStart={currentWeekStart}
        onWeekChange={setCurrentWeekStart}
        canGoPrevious={canGoPrevious}
      />

      {/* Strøtimer Accordion - Only show if there are strøtimer */}
      {hasStrøtimer && (
        <Accordion type="single" collapsible className="w-full bg-blue-50 rounded-lg">
          <AccordionItem value="strotimer" className="border-blue-100">
            <AccordionTrigger className="hover:no-underline px-6 py-4 bg-blue-100 text-blue-900 rounded-t-lg">
              <div className="flex items-center gap-3">
                <Zap className="h-6 w-6 text-orange-500" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-blue-900">
                    Strøtimer - Ledige tider
                  </h3>
                  <p className="text-sm text-blue-700">
                    {strøtimer.length} ledige tider tilgjengelig for drop-in booking
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4 px-6 pb-6 bg-blue-50 rounded-b-lg">
              {weekDays.map(day => (
                <StrotimeDisplay
                  key={day.toISOString()}
                  strøtimer={strøtimer}
                  date={day}
                  onBookingComplete={handleStrøtimeBookingComplete}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      <ResponsiveCalendarGrid
        zone={zone}
        currentWeekStart={currentWeekStart}
        timeSlots={timeSlots}
        selectedSlots={selectedSlots}
        getAvailabilityStatus={(zoneId, date, timeSlot) => 
          availabilityStatusManager.getAvailabilityStatus(zoneId, date, timeSlot)
        }
        isSlotSelected={(zoneId, date, timeSlot) => isSlotSelected(selectedSlots, zoneId, date, timeSlot)}
        onSlotClick={handleSlotClick}
      />

      <LegendDisplay showLegend={showLegend} />

      <ZoneInfoHeader
        zone={zone}
        selectedSlots={selectedSlots}
        onPatternBuilderOpen={onPatternBuilderOpen}
        onClearSelection={clearSelectionHandler}
        onBookingDrawerOpen={handleBookingClick}
        zones={zones}
      />

      <SelectedSlotsDisplay selectedSlots={selectedSlots} />
    </div>
  );
}
