
import React, { useState, useMemo } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { nb } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarGrid } from './CalendarGrid';
import { LegendDisplay } from './LegendDisplay';
import { BookingForm } from '@/components/booking/BookingForm';
import { Zone } from '@/components/booking/types';
import { SelectedTimeSlot, RecurrencePattern, recurrenceEngine } from '@/utils/recurrenceEngine';
import { useAvailabilityStatus } from './useAvailabilityStatus';
import { AvailabilityModals } from './AvailabilityModals';

interface AvailabilityTabProps {
  zones: Zone[];
  selectedSlots: SelectedTimeSlot[];
  onSlotClick: (zoneId: string, date: Date, timeSlot: string, availability: string) => void;
  onBulkSlotSelection: (slots: SelectedTimeSlot[]) => void;
  onClearSlots: () => void;
  onRemoveSlot: (zoneId: string, date: Date, timeSlot: string) => void;
  facilityId: string;
  facilityName: string;
  currentPattern?: any;
  onPatternChange?: (pattern: any) => void;
  onPatternApply?: (pattern: any) => void;
  timeSlotDuration?: number;
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
  timeSlotDuration = 1
}: AvailabilityTabProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0]?.id || '');
  const [showPatternBuilder, setShowPatternBuilder] = useState(false);
  const [showConflictWizard, setShowConflictWizard] = useState(false);
  const [showBookingDrawer, setShowBookingDrawer] = useState(false);
  const [conflictResolutionData, setConflictResolutionData] = useState<any>(null);
  const [recurrencePattern, setRecurrencePattern] = useState<RecurrencePattern>({
    type: 'weekly',
    weekdays: [],
    timeSlots: [],
    interval: 1
  });

  const { getAvailabilityStatus, isSlotSelected } = useAvailabilityStatus(selectedSlots);

  // Generate time slots from 08:00 to 22:00
  const timeSlots = useMemo(() => 
    Array.from({ length: 14 }, (_, i) => {
      const hour = 8 + i;
      const nextHour = hour + 1;
      return `${hour.toString().padStart(2, '0')}:00-${nextHour.toString().padStart(2, '0')}:00`;
    }), []
  );

  const selectedZone = zones.find(zone => zone.id === selectedZoneId);

  const handlePreviousWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => addDays(prev, 7));
  };

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    onSlotClick(zoneId, date, timeSlot, availability);
  };

  const handleAddToCart = (bookingData: any) => {
    console.log('Adding to cart:', bookingData);
    onClearSlots();
  };

  const handleCompleteBooking = (bookingData: any) => {
    console.log('Completing booking:', bookingData);
  };

  const handleRecurringBooking = () => {
    setShowPatternBuilder(true);
  };

  const handlePatternBuilderClose = () => {
    setShowPatternBuilder(false);
  };

  const handleConflictWizardClose = () => {
    setShowConflictWizard(false);
    setConflictResolutionData(null);
  };

  const handleBookingDrawerClose = () => {
    setShowBookingDrawer(false);
  };

  const handlePatternChange = (pattern: RecurrencePattern) => {
    setRecurrencePattern(pattern);
    if (onPatternChange) {
      onPatternChange(pattern);
    }
  };

  const handlePatternApply = (pattern: RecurrencePattern) => {
    console.log('Applying pattern:', pattern);
    
    // Generate occurrences using the recurrence engine
    if (pattern.timeSlots.length > 0 && pattern.weekdays.length > 0 && selectedZoneId) {
      const occurrences = recurrenceEngine.generateOccurrences(
        pattern,
        currentWeekStart,
        selectedZoneId,
        12 // Generate up to 12 weeks
      );
      
      console.log('Generated occurrences:', occurrences);
      
      // Add the generated slots to the selected slots
      onBulkSlotSelection(occurrences);
    }
    
    if (onPatternApply) {
      onPatternApply(pattern);
    }
    setShowPatternBuilder(false);
  };

  return (
    <div className="space-y-6">
      {/* Simplified Zone Selection Header */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            Velg sone for booking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {zones.map((zone) => (
              <Button
                key={zone.id}
                variant={selectedZoneId === zone.id ? "default" : "outline"}
                onClick={() => setSelectedZoneId(zone.id)}
                className="flex items-center gap-2 text-sm px-3 py-2"
                size="sm"
              >
                {zone.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {zone.area || "120 m²"}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 60/40 Layout for Calendar and Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Column - Calendar (60%) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePreviousWeek} size="lg">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Forrige uke
            </Button>
            <div className="text-center">
              <h3 className="text-xl font-semibold">
                {format(currentWeekStart, 'dd. MMMM', { locale: nb })} - {format(addDays(currentWeekStart, 6), 'dd. MMMM yyyy', { locale: nb })}
              </h3>
            </div>
            <Button variant="outline" onClick={handleNextWeek} size="lg">
              Neste uke
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Calendar Grid */}
          {selectedZone && (
            <Card>
              <CardContent className="p-0">
                <CalendarGrid
                  zone={selectedZone}
                  currentWeekStart={currentWeekStart}
                  timeSlots={timeSlots}
                  selectedSlots={selectedSlots}
                  getAvailabilityStatus={getAvailabilityStatus}
                  isSlotSelected={isSlotSelected}
                  onSlotClick={handleSlotClick}
                  onBulkSlotSelection={onBulkSlotSelection}
                />
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <LegendDisplay />
        </div>

        {/* Right Column - Booking Form (40%) */}
        <div className="lg:col-span-2">
          <div className="sticky top-6">
            <BookingForm
              selectedSlots={selectedSlots}
              facilityId={facilityId}
              facilityName={facilityName}
              zones={zones}
              onAddToCart={handleAddToCart}
              onCompleteBooking={handleCompleteBooking}
              onSlotsCleared={onClearSlots}
              onRemoveSlot={onRemoveSlot}
              onRecurringBooking={handleRecurringBooking}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AvailabilityModals
        showPatternBuilder={showPatternBuilder}
        showConflictWizard={showConflictWizard}
        showBookingDrawer={showBookingDrawer}
        currentPattern={recurrencePattern}
        conflictResolutionData={conflictResolutionData}
        selectedSlots={selectedSlots}
        facilityId={facilityId}
        facilityName={facilityName}
        onPatternBuilderClose={handlePatternBuilderClose}
        onConflictWizardClose={handleConflictWizardClose}
        onBookingDrawerClose={handleBookingDrawerClose}
        onPatternChange={handlePatternChange}
        onPatternApply={handlePatternApply}
      />
    </div>
  );
}
