
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues, Zone } from "../types";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";
import { ActorType } from "@/types/pricing";
import { CustomerInfoSection } from "./sections/CustomerInfoSection";
import { EventDetailsSection } from "./sections/EventDetailsSection";
import { BookingTimingSection } from "./sections/BookingTimingSection";
import { BookingPurposeSection } from "./sections/BookingPurposeSection";
import { ZoneSelectionSection } from "./sections/ZoneSelectionSection";
import { PricingDisplaySection } from "./sections/PricingDisplaySection";

export interface BookingDetailsStepProps {
  form: UseFormReturn<BookingFormValues>;
  facility: {
    id: string | undefined;
    name: string;
    zones: Zone[];
    availableTimes: {
      date: Date;
      slots: { start: string; end: string; available: boolean }[];
    }[];
  };
}

// Customer type mapping to ActorType
const customerTypeToActorType = (customerType: string): ActorType => {
  switch (customerType) {
    case 'nonprofit': return 'lag-foreninger';
    case 'business': return 'private-firma';
    case 'youth': return 'private-person';
    case 'senior': return 'private-person';
    default: return 'private-person';
  }
};

export function BookingDetailsStep({ form, facility }: BookingDetailsStepProps) {
  const watchedValues = form.watch();

  // Calculate price with more immediate feedback
  const { calculation, isLoading } = usePriceCalculation({
    facilityId: facility.id,
    zoneId: watchedValues.zoneId,
    startDate: watchedValues.date,
    endDate: watchedValues.endDate,
    timeSlot: watchedValues.timeSlot,
    customerType: watchedValues.customerType ? customerTypeToActorType(watchedValues.customerType) : 'private-person',
    bookingMode: watchedValues.bookingMode,
    eventType: watchedValues.eventType,
    ageGroup: watchedValues.ageGroup
  });

  // Show pricing when we have minimum required info
  const shouldShowPricing = watchedValues.customerType && watchedValues.zoneId && watchedValues.date;

  return (
    <div className="space-y-8">
      <CustomerInfoSection form={form} />
      
      <EventDetailsSection form={form} />
      
      <BookingTimingSection form={form} />

      <BookingPurposeSection form={form} />

      <ZoneSelectionSection
        form={form}
        zones={facility.zones}
        selectedDate={watchedValues.date || new Date()}
        selectedTimeSlot={watchedValues.timeSlot || ""}
      />

      <PricingDisplaySection
        calculation={calculation}
        isLoading={isLoading}
        shouldShowPricing={shouldShowPricing}
        hasTimeSlot={!!watchedValues.timeSlot}
      />
    </div>
  );
}
