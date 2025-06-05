import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { BookingDetailsStep } from "./steps/BookingDetailsStep";
import { BookingContactStep } from "./steps/BookingContactStep";
import { BookingConfirmStep } from "./steps/BookingConfirmStep";
import { FormStepper } from "./FormStepper";
import { BookingFormNav } from "./BookingFormNav";
import { toast } from "sonner";
import type { BookingFormValues, Zone } from "./types";
import { generateRecurrenceRule, getRecurrenceDescription } from "@/utils/bookingConflict";

interface BookingFormProps {
  facilityId: string;
  facilityName: string;
  maxCapacity: number;
  zones: Zone[];
  availableTimeSlots: {
    date: Date;
    slots: { start: string; end: string; available: boolean }[];
  }[];
  onCompleteBooking: () => void;
  termsAccepted: boolean;
  onTermsAcceptedChange: (accepted: boolean) => void;
}

const bookingFormSchema = z.object({
  date: z.date({
    required_error: "Vennligst velg en dato",
  }),
  bookingMode: z.enum(["one-time", "date-range", "recurring"], {
    required_error: "Vennligst velg booking type",
  }),
  endDate: z.date().optional(),
  timeSlot: z.string({
    required_error: "Vennligst velg et tidspunkt",
  }),
  zoneId: z.string({
    required_error: "Vennligst velg en sone",
  }),
  purpose: z.string({
    required_error: "Vennligst oppgi formålet med reservasjonen",
  }).min(10, {
    message: "Formålet må være minst 10 tegn langt",
  }),
  attendees: z.number({
    required_error: "Vennligst oppgi antall deltakere",
  }).min(1, {
    message: "Antall deltakere må være minst 1",
  }),
  contactName: z.string({
    required_error: "Vennligst oppgi kontaktperson",
  }).min(2, {
    message: "Kontaktperson må være minst 2 tegn langt",
  }),
  contactEmail: z.string({
    required_error: "Vennligst oppgi e-post",
  }).email({
    message: "Vennligst oppgi en gyldig e-postadresse",
  }),
  contactPhone: z.string({
    required_error: "Vennligst oppgi telefonnummer",
  }).regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: "Vennligst oppgi et gyldig telefonnummer",
  }),
  organization: z.string().optional(),
  recurrence: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
    interval: z.number().min(1).optional(),
    count: z.number().min(1).optional(),
    until: z.date().optional()
  }).optional()
});

const defaultValues: Partial<BookingFormValues> = {
  attendees: 1,
  bookingMode: "one-time",
  date: new Date(),
  zoneId: "whole-facility", // Default to whole facility
};

async function createBooking(data: BookingFormValues) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Form data submitted:", data);
      resolve({ success: true });
    }, 1000);
  });
}

export function BookingForm({ 
  facilityId, 
  facilityName, 
  maxCapacity,
  zones,
  availableTimeSlots,
  onCompleteBooking,
  termsAccepted,
  onTermsAcceptedChange
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
    mode: "onChange"
  });
  
  useEffect(() => {
    setCanContinue(form.formState.isValid);
  }, [form.formState.isValid]);
  
  const nextStep = () => {
    if (currentStep < 2 && canContinue) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleSubmit = async (data: BookingFormValues) => {
    // Validate terms acceptance before submission
    if (!termsAccepted) {
      toast.error("Du må godkjenne vilkårene for å fortsette");
      return;
    }
    
    setIsSubmitting(true);
    
    // Find selected zone
    const selectedZone = zones.find(zone => zone.id === data.zoneId);
    
    // Prepare booking data based on booking mode
    let bookingData = {
      ...data,
      facilityId: facilityId,
      facilityName: facilityName,
      zoneName: selectedZone?.name,
    };
    
    try {
      const result = await createBooking(bookingData);
      
      if (result && typeof result === 'object' && 'success' in result && result.success) {
        toast.success("Reservasjonen er sendt!");
        onCompleteBooking();
      } else {
        toast.error("Noe gikk galt. Vennligst prøv igjen.");
      }
    } catch (error) {
      toast.error("Det oppstod en feil under innsendingen.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BookingDetailsStep 
            form={form}
            maxCapacity={maxCapacity}
            zones={zones}
            availableTimeSlots={availableTimeSlots}
          />
        );
      case 1:
        return (
          <BookingContactStep 
            form={form}
          />
        );
      case 2:
        const recurrenceData = form.watch("recurrence");
        const frequency = recurrenceData?.frequency;
        const interval = recurrenceData?.interval;
        const count = recurrenceData?.count;
        const until = recurrenceData?.until;
        const selectedZone = zones.find(zone => zone.id === form.watch("zoneId"));

        return (
          <BookingConfirmStep
            facilityName={facilityName}
            bookingData={{
              date: form.watch("date") || new Date(),
              bookingMode: form.watch("bookingMode") || "one-time",
              timeSlot: form.watch("timeSlot") || "",
              zoneId: form.watch("zoneId") || "",
              zoneName: selectedZone?.name || "",
              purpose: form.watch("purpose") || "",
              attendees: form.watch("attendees") || 1,
              contactName: form.watch("contactName") || "",
              contactEmail: form.watch("contactEmail") || "",
              contactPhone: form.watch("contactPhone") || "",
              organization: form.watch("organization") || "",
              endDate: form.watch("endDate"),
              recurrenceRule: recurrenceData && frequency ? 
                generateRecurrenceRule(
                  frequency,
                  interval || 1,
                  count,
                  until
                ) : undefined,
              recurrenceDescription: recurrenceData && frequency ? 
                getRecurrenceDescription(frequency, interval || 1) : undefined,
            }}
            termsAccepted={termsAccepted}
            onTermsAcceptedChange={onTermsAcceptedChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <FormStepper 
        currentStep={currentStep}
        steps={["Detaljert informasjon", "Kontaktinformasjon", "Bekreftelse"]}
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {renderStepContent()}
          
          <BookingFormNav
            currentStep={currentStep}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === 2}
            canContinue={canContinue}
            onPreviousStep={() => setCurrentStep(currentStep - 1)}
            onNextStep={nextStep}
            isSubmitting={isSubmitting}
            isSubmitDisabled={!termsAccepted && currentStep === 2}
          />
        </form>
      </Form>
    </div>
  );
}
