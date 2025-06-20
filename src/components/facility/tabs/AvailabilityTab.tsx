
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Repeat, ShoppingCart } from 'lucide-react';
import { SelectedTimeSlot, RecurrencePattern } from '@/utils/recurrenceEngine';
import { Zone } from '@/components/booking/types';
import { SimplifiedBookingForm } from '@/components/booking/SimplifiedBookingForm';
import { CalendarWeekView } from '@/components/booking/CalendarWeekView';
import { AvailabilityModals } from './AvailabilityModals';
import { usePatternHandler } from './PatternHandler';
import { EnhancedZoneConflictManager } from '@/utils/enhancedZoneConflictManager';

interface AvailabilityTabProps {
  zones: Zone[];
  selectedSlots: SelectedTimeSlot[];
  onSlotClick: (zoneId: string, date: Date, timeSlot: string, availability: string) => void;
  onBulkSlotSelection: (slots: SelectedTimeSlot[]) => void;
  onClearSlots: () => void;
  onRemoveSlot: (zoneId: string, date: Date, timeSlot: string) => void;
  facilityId: string;
  facilityName: string;
  currentPattern: RecurrencePattern;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onPatternApply: (pattern: RecurrencePattern) => void;
  timeSlotDuration: number;
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
  timeSlotDuration
}: AvailabilityTabProps) {
  const [showPatternBuilder, setShowPatternBuilder] = useState(false);
  const [showConflictWizard, setShowConflictWizard] = useState(false);
  const [showBookingDrawer, setShowBookingDrawer] = useState(false);
  const [conflictResolutionData, setConflictResolutionData] = useState<any>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  const conflictManager = new EnhancedZoneConflictManager([]);

  const handleConflictDetected = (data: any) => {
    setConflictResolutionData(data);
    setShowConflictWizard(true);
  };

  const handlePatternApplied = (slots: SelectedTimeSlot[]) => {
    console.log('AvailabilityTab: Pattern applied with slots:', slots);
    onBulkSlotSelection(slots);
  };

  const { handlePatternApply } = usePatternHandler({
    pattern: currentPattern,
    zones,
    currentWeekStart,
    conflictManager,
    onConflictDetected: handleConflictDetected,
    onPatternApplied: handlePatternApplied,
  });

  const handlePatternBuilderApply = (pattern: RecurrencePattern) => {
    console.log('AvailabilityTab: handlePatternBuilderApply called with pattern:', pattern);
    
    // First update the pattern
    onPatternChange(pattern);
    
    // Then apply the pattern to generate slots
    handlePatternApply(pattern);
    
    // Close the pattern builder
    setShowPatternBuilder(false);
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

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          onClick={() => setShowPatternBuilder(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Repeat className="h-4 w-4" />
          Gjentakende Reservasjon
        </Button>
        
        <Button 
          onClick={() => setShowBookingDrawer(true)}
          disabled={selectedSlots.length === 0}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
        >
          <ShoppingCart className="h-4 w-4" />
          Fullfør Booking ({selectedSlots.length})
        </Button>
      </div>

      {/* Calendar and Booking Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold">Velg tidspunkt</h3>
            </div>
            
            <CalendarWeekView
              zones={zones}
              selectedSlots={selectedSlots}
              onSlotClick={onSlotClick}
              timeSlotDuration={timeSlotDuration}
              currentWeekStart={currentWeekStart}
              onWeekChange={setCurrentWeekStart}
            />
          </div>
        </div>

        {/* Booking Form Section */}
        <div className="lg:col-span-1">
          <SimplifiedBookingForm
            selectedSlots={selectedSlots}
            facilityId={facilityId}
            facilityName={facilityName}
            zones={zones}
            onSlotsCleared={onClearSlots}
            onRemoveSlot={onRemoveSlot}
          />
        </div>
      </div>

      {/* Modals */}
      <AvailabilityModals
        showPatternBuilder={showPatternBuilder}
        showConflictWizard={showConflictWizard}
        showBookingDrawer={showBookingDrawer}
        currentPattern={currentPattern}
        conflictResolutionData={conflictResolutionData}
        selectedSlots={selectedSlots}
        facilityId={facilityId}
        facilityName={facilityName}
        onPatternBuilderClose={handlePatternBuilderClose}
        onConflictWizardClose={handleConflictWizardClose}
        onBookingDrawerClose={handleBookingDrawerClose}
        onPatternChange={onPatternChange}
        onPatternApply={handlePatternBuilderApply}
      />
    </div>
  );
}
