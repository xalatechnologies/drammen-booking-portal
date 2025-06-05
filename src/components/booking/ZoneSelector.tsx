
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues, Zone } from "./types";
import { EnhancedZoneSelector } from "./EnhancedZoneSelector";
import { ExistingBooking } from "@/utils/zoneConflictManager";

interface ZoneSelectorProps {
  form: UseFormReturn<BookingFormValues>;
  zones: Zone[];
  selectedDate: Date;
  selectedTimeSlot: string;
  existingBookings?: ExistingBooking[];
}

export function ZoneSelector({ 
  form, 
  zones, 
  selectedDate, 
  selectedTimeSlot,
  existingBookings = []
}: ZoneSelectorProps) {
  return (
    <EnhancedZoneSelector
      form={form}
      zones={zones}
      selectedDate={selectedDate}
      selectedTimeSlot={selectedTimeSlot}
      existingBookings={existingBookings}
      onZoneSelect={(zone) => {
        console.log('Zone selected:', zone.name);
        // Additional zone selection logic can be added here
      }}
    />
  );
}
