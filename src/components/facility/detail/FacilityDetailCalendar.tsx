
import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zone } from "@/components/booking/types";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";
import { CalendarWithBooking } from "@/components/shared/CalendarWithBooking";

interface FacilityDetailCalendarProps {
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

export const FacilityDetailCalendar: React.FC<FacilityDetailCalendarProps> = ({
  zones,
  selectedSlots,
  onSlotClick,
  onBulkSlotSelection,
  onClearSlots,
  onRemoveSlot,
  facilityId,
  facilityName,
  timeSlotDuration = 1
}) => {
  // Mock availability function - replace with real implementation
  const getAvailabilityStatus = useCallback((zoneId: string, date: Date, timeSlot: string) => {
    const now = new Date();
    const timeHour = parseInt(timeSlot.split(':')[0]);
    const slotDateTime = new Date(date);
    slotDateTime.setHours(timeHour, 0, 0, 0);
    
    if (slotDateTime < now) {
      return { status: 'unavailable', conflict: null };
    }

    // Mock random availability
    const isBooked = Math.random() > 0.8;
    return { 
      status: isBooked ? 'busy' : 'available', 
      conflict: isBooked ? { type: 'existing-booking', details: 'Allerede booket' } : null 
    };
  }, []);

  const isSlotSelected = useCallback((zoneId: string, date: Date, timeSlot: string) => {
    return selectedSlots.some(slot => 
      slot.zoneId === zoneId &&
      slot.date.toDateString() === date.toDateString() &&
      slot.timeSlot === timeSlot
    );
  }, [selectedSlots]);

  const handleContinueBooking = useCallback(() => {
    // Navigate to booking form or show booking modal
    console.log('Continue with booking:', selectedSlots);
  }, [selectedSlots]);

  return (
    <div className="container mx-auto mt-8 px-4 lg:px-0">
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Tilgjengelighet og booking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarWithBooking
            facilityName={facilityName}
            facilityId={facilityId}
            zones={zones}
            selectedSlots={selectedSlots}
            onSlotClick={onSlotClick}
            onBulkSlotSelection={onBulkSlotSelection}
            onRemoveSlot={onRemoveSlot}
            onClearSlots={onClearSlots}
            onContinueBooking={handleContinueBooking}
            getAvailabilityStatus={getAvailabilityStatus}
            isSlotSelected={isSlotSelected}
            timeSlotDuration={timeSlotDuration}
            layout="horizontal"
            compact={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};
