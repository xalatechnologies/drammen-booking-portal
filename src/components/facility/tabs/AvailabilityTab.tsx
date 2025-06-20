
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Repeat, ShoppingCart } from 'lucide-react';
import { SelectedTimeSlot, RecurrencePattern } from '@/utils/recurrenceEngine';
import { Zone } from '@/components/booking/types';
import { SimplifiedBookingForm } from '@/components/booking/SimplifiedBookingForm';
import { CalendarGrid } from './CalendarGrid';
import { WeekNavigation } from './WeekNavigation';
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

  // Generate time slots based on timeSlotDuration
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 22; hour += timeSlotDuration) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + timeSlotDuration).toString().padStart(2, '0')}:00`;
      slots.push(`${startTime}-${endTime}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Use the first zone or create a default one with all required properties
  const primaryZone: Zone = zones[0] || {
    id: 'whole-facility',
    name: 'Hele lokalet',
    capacity: 30,
    equipment: [],
    pricePerHour: 450,
    description: '',
    area: '120 m²',
    isMainZone: true,
    bookingRules: {
      minBookingDuration: 60,
      maxBookingDuration: 480,
      allowedTimeSlots: ['08:00-22:00'],
      bookingTypes: ['engangs', 'fast', 'arrangement'],
      advanceBookingDays: 365,
      cancellationHours: 24
    },
    adminInfo: {
      contactPersonName: 'Facility Admin',
      contactPersonEmail: 'admin@facility.no',
      specialInstructions: '',
      maintenanceSchedule: []
    },
    layout: {
      coordinates: { x: 0, y: 0, width: 100, height: 100 },
      entryPoints: ['main']
    },
    accessibility: [],
    features: [],
    isActive: true
  };

  const getAvailabilityStatus = (zoneId: string, date: Date, timeSlot: string) => {
    // Simple availability logic - in real implementation this would check against bookings
    return { status: 'available', conflict: null };
  };

  const isSlotSelected = (zoneId: string, date: Date, timeSlot: string) => {
    return selectedSlots.some(slot => 
      slot.zoneId === zoneId && 
      slot.date.toDateString() === date.toDateString() && 
      slot.timeSlot === timeSlot
    );
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
            
            <WeekNavigation
              currentWeekStart={currentWeekStart}
              onWeekChange={setCurrentWeekStart}
              canGoPrevious={true}
            />
            
            <CalendarGrid
              zone={primaryZone}
              currentWeekStart={currentWeekStart}
              timeSlots={timeSlots}
              selectedSlots={selectedSlots}
              getAvailabilityStatus={getAvailabilityStatus}
              isSlotSelected={isSlotSelected}
              onSlotClick={onSlotClick}
              onBulkSlotSelection={onBulkSlotSelection}
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
