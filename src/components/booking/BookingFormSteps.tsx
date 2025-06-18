
import React from 'react';
import { BookingDetailsStep } from './steps/BookingDetailsStep';
import { BookingContactStep } from './steps/BookingContactStep';
import { BookingServicesStep } from './steps/BookingServicesStep';
import { BookingConfirmStep } from './steps/BookingConfirmStep';
import { useBookingForm } from './BookingFormProvider';
import { Zone, BookingData } from './types';

interface BookingFormStepsProps {
  facility: {
    id: string | undefined;
    name: string;
    zones: Zone[];
    availableTimes: {
      date: Date;
      slots: {
        start: string;
        end: string;
        available: boolean;
      }[];
    }[];
  };
}

export function BookingFormSteps({ facility }: BookingFormStepsProps) {
  const { form, currentStep, termsAccepted, setTermsAccepted } = useBookingForm();
  const watchedValues = form.watch();

  const getBookingData = (): BookingData => {
    const selectedZone = facility.zones.find(z => z.id === watchedValues.zoneId);
    return {
      date: watchedValues.date,
      bookingMode: watchedValues.bookingMode,
      timeSlot: watchedValues.timeSlot,
      zoneId: watchedValues.zoneId,
      zoneName: selectedZone?.name || '',
      purpose: watchedValues.purpose,
      attendees: watchedValues.attendees,
      contactName: watchedValues.contactName,
      contactEmail: watchedValues.contactEmail,
      contactPhone: watchedValues.contactPhone,
      organization: watchedValues.organization,
      endDate: watchedValues.endDate,
      customerType: watchedValues.customerType,
      eventType: watchedValues.eventType,
      ageGroup: watchedValues.ageGroup
    };
  };

  switch (currentStep) {
    case 0:
      return <BookingDetailsStep form={form} facility={facility} />;
    case 1:
      return (
        <BookingServicesStep 
          form={form} 
          facilityId={facility.id || '1'}
          actorType={watchedValues.customerType}
          attendees={watchedValues.attendees}
        />
      );
    case 2:
      return <BookingContactStep form={form} />;
    case 3:
      return (
        <BookingConfirmStep 
          facilityName={facility.name} 
          facilityId={facility.id}
          bookingData={getBookingData()} 
          termsAccepted={termsAccepted} 
          onTermsAcceptedChange={setTermsAccepted} 
        />
      );
    default:
      return null;
  }
}
