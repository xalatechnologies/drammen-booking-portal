
import React from "react";
import { Accordion } from "@/components/ui/accordion";
import { FacilityAccordionItem } from "./FacilityAccordionItem";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";
import { Facility } from "@/types/facility";

// Simplified Zone interface for calendar view
interface CalendarZone {
  id: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  description: string;
}

interface FacilityCalendarAccordionProps {
  facilities: Facility[];
  currentWeekStart: Date;
  onFacilitySelect?: (facilityId: string) => void;
  onSlotSelection?: (facilityId: string, slots: SelectedTimeSlot[]) => void;
}

export const FacilityCalendarAccordion: React.FC<FacilityCalendarAccordionProps> = ({
  facilities,
  currentWeekStart,
  onFacilitySelect,
  onSlotSelection,
}) => {
  // Generate hourly time slots from 08:00 to 22:00
  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = 8 + i;
    const nextHour = hour + 1;
    return `${hour.toString().padStart(2, '0')}:00-${nextHour.toString().padStart(2, '0')}:00`;
  });

  const getAvailabilityStatus = (zoneId: string, date: Date, timeSlot: string) => {
    // Mock availability logic - in real app this would check actual bookings
    const now = new Date();
    const timeHour = parseInt(timeSlot.split(':')[0]);
    const slotDateTime = new Date(date);
    slotDateTime.setHours(timeHour, 0, 0, 0);
    
    if (slotDateTime < now) {
      return { status: 'unavailable', conflict: null };
    }

    // Random availability for demo
    const isBooked = Math.random() > 0.8;
    return { 
      status: isBooked ? 'busy' : 'available', 
      conflict: isBooked ? { type: 'existing-booking', details: 'Allerede booket' } : null 
    };
  };

  const isSlotSelected = () => false; // No selection in calendar view

  const handleSlotClick = (zoneId: string, date: Date, timeSlot: string, availability: string) => {
    if (availability === 'available' && onSlotSelection) {
      // Extract facility ID from zone ID
      const facilityId = zoneId.split('-')[1];
      
      // Create a selected slot with duration
      const newSlot: SelectedTimeSlot = {
        zoneId,
        date,
        timeSlot,
        duration: 2 // Default 2 hours duration
      };
      
      // For now, just pass single slot - in future this could handle multiple selections
      onSlotSelection(facilityId, [newSlot]);
      
      // Also trigger facility selection for sidebar
      if (onFacilitySelect) {
        onFacilitySelect(facilityId);
      }
    }
  };

  return (
    <Accordion type="multiple" className="w-full">
      {facilities.map((facility) => (
        <FacilityAccordionItem
          key={facility.id}
          facility={facility}
          currentWeekStart={currentWeekStart}
          timeSlots={timeSlots}
          getAvailabilityStatus={getAvailabilityStatus}
          isSlotSelected={isSlotSelected}
          handleSlotClick={handleSlotClick}
          onFacilitySelect={onFacilitySelect}
        />
      ))}
    </Accordion>
  );
};
