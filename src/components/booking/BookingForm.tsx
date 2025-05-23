
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { generateRecurrenceRule, checkBookingConflict } from "@/utils/bookingConflict";
import { BookingFormValues, bookingFormSchema, BookingStep } from "./types";
import { FormStepper } from "./FormStepper";
import { BookingDetailsStep } from "./steps/BookingDetailsStep";
import { BookingContactStep } from "./steps/BookingContactStep";
import { BookingConfirmStep } from "./steps/BookingConfirmStep";
import { BookingFormNav } from "./BookingFormNav";
import { BookingData } from "./BookingSummary";

interface BookingFormProps {
  facilityId: string;
  facilityName: string;
  maxCapacity: number;
  availableTimeSlots: {
    date: Date;
    slots: { start: string; end: string; available: boolean }[];
  }[];
  onCompleteBooking: () => void;
}

export function BookingForm({
  facilityId,
  facilityName,
  maxCapacity,
  availableTimeSlots,
  onCompleteBooking,
}: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formProgress, setFormProgress] = useState(1);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      bookingMode: 'one-time',
      date: new Date(),
      timeSlot: "",
      purpose: "",
      attendees: 1,
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      organization: "",
      recurrenceFrequency: 'weekly',
      recurrenceInterval: 1,
    },
  });

  const onSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    
    try {
      let recurrenceRule;
      
      // Generate recurrence rule for recurring bookings
      if (data.bookingMode === 'recurring' && data.recurrenceFrequency) {
        recurrenceRule = generateRecurrenceRule(
          data.recurrenceFrequency,
          data.recurrenceInterval || 1,
          data.recurrenceCount,
          data.recurrenceEndDate
        );
      }
      
      // Check for booking conflicts
      // Note: In a real app, you'd fetch existing bookings from your database
      const mockExistingBookings = []; // This would come from your API
      
      const conflictCheck = await checkBookingConflict(
        facilityId,
        data.date,
        data.timeSlot,
        data.bookingMode,
        data.bookingMode === 'one-time' ? undefined : (data.endDate || data.recurrenceEndDate),
        recurrenceRule,
        mockExistingBookings
      );
      
      if (conflictCheck.hasConflict) {
        toast({
          title: "Konflikt med eksisterende reservasjon",
          description: "Den valgte tiden overlapper med en eksisterende reservasjon. Vennligst velg en annen tid.",
          variant: "destructive",
          duration: 5000,
        });
        setIsSubmitting(false);
        return;
      }
      
      // In a real app, this would send the data to a backend API
      console.log("Booking data:", {
        ...data,
        recurrenceRule,
        facilityId
      });
      
      toast({
        title: "Reservasjon sendt",
        description: `Din reservasjon av ${facilityName} er mottatt.`,
        duration: 5000,
      });
      
      onCompleteBooking();
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "Feil",
        description: "Det oppstod en feil under innsending av reservasjonen. Vennligst prøv igjen.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToNextStep = async () => {
    if (currentStep === 'details') {
      // Validate only the details fields
      const detailsFields = ['bookingMode', 'date', 'timeSlot', 'purpose', 'attendees'];
      
      // Add conditional fields based on booking mode
      if (form.watch('bookingMode') === 'date-range') {
        detailsFields.push('endDate');
      } else if (form.watch('bookingMode') === 'recurring') {
        detailsFields.push('recurrenceFrequency', 'recurrenceInterval');
        
        // Either end date or count must be provided
        if (form.getValues('recurrenceEndDate')) {
          detailsFields.push('recurrenceEndDate');
        } else {
          detailsFields.push('recurrenceCount');
        }
      }
      
      const detailsResult = await form.trigger(detailsFields as any);
      if (detailsResult) {
        setCurrentStep('contact');
        setFormProgress(2);
      }
    } else if (currentStep === 'contact') {
      // Validate only the contact fields
      const contactResult = await form.trigger(['contactName', 'contactEmail', 'contactPhone', 'organization']);
      if (contactResult) {
        setCurrentStep('confirm');
        setFormProgress(3);
      }
    } else if (currentStep === 'confirm') {
      form.handleSubmit(onSubmit)();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 'contact') {
      setCurrentStep('details');
      setFormProgress(1);
    } else if (currentStep === 'confirm') {
      setCurrentStep('contact');
      setFormProgress(2);
    }
  };

  // Construct booking data for summary view
  const getBookingDataForSummary = (): BookingData => {
    const values = form.getValues();
    
    // Construct a recurrence description based on frequency and interval
    let recurrenceDescription = '';
    if (values.bookingMode === 'recurring' && values.recurrenceFrequency) {
      recurrenceDescription = getRecurrenceDescription(
        values.recurrenceFrequency,
        values.recurrenceInterval || 1
      );
    }
    
    return {
      bookingMode: values.bookingMode,
      date: values.date,
      timeSlot: values.timeSlot || "",
      purpose: values.purpose || "",
      attendees: values.attendees || 0,
      contactName: values.contactName || "",
      contactEmail: values.contactEmail || "",
      contactPhone: values.contactPhone || "",
      organization: values.organization,
      endDate: values.bookingMode === 'date-range' ? values.endDate : 
               values.bookingMode === 'recurring' ? values.recurrenceEndDate : 
               undefined,
      recurrenceRule: values.bookingMode === 'recurring' && values.recurrenceFrequency ? 
        generateRecurrenceRule(
          values.recurrenceFrequency,
          values.recurrenceInterval || 1,
          values.recurrenceCount,
          values.recurrenceEndDate
        ) : undefined,
      recurrenceDescription
    };
  };

  const steps = [
    { label: "Detaljer" },
    { label: "Kontakt" },
    { label: "Bekreft" },
  ];

  return (
    <div className="space-y-6">
      {/* Stepper UI */}
      <FormStepper 
        currentStep={formProgress} 
        totalSteps={steps.length} 
        steps={steps} 
      />

      <Form {...form}>
        <form className="space-y-6">
          {/* Step 1: Details */}
          {currentStep === 'details' && (
            <BookingDetailsStep 
              form={form}
              availableTimeSlots={availableTimeSlots}
              maxCapacity={maxCapacity}
            />
          )}

          {/* Step 2: Contact */}
          {currentStep === 'contact' && (
            <BookingContactStep form={form} />
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 'confirm' && (
            <BookingConfirmStep
              facilityName={facilityName}
              bookingData={getBookingDataForSummary()}
            />
          )}

          {/* Navigation buttons */}
          <BookingFormNav 
            currentStep={currentStep}
            isSubmitting={isSubmitting}
            onPrevious={goToPreviousStep}
            onNext={goToNextStep}
          />
        </form>
      </Form>
    </div>
  );
}

// Import needed for getBookingDataForSummary
import { getRecurrenceDescription } from "@/utils/bookingConflict";
