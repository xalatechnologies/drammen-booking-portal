
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { BookingDetailsStep } from "./steps/BookingDetailsStep";
import { BookingContactStep } from "./steps/BookingContactStep";
import { BookingConfirmStep } from "./steps/BookingConfirmStep";
import { BookingFormNav } from "./BookingFormNav";
import { CollapsibleFormStepper } from "./CollapsibleFormStepper";
import { bookingFormSchema, BookingFormValues, BookingStep, Zone, BookingData } from "./types";

interface EnhancedBookingFormProps {
  facility: {
    id: string | undefined;
    name: string;
    zones: Zone[];
    availableTimes: {
      date: Date;
      slots: { start: string; end: string; available: boolean }[];
    }[];
  };
  onBookingComplete: (reference: string) => void;
}

export function EnhancedBookingForm({ facility, onBookingComplete }: EnhancedBookingFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const steps: BookingStep[] = ['details', 'contact', 'confirm'];
  const stepTitles = ["Reservasjonsdetaljer", "Kontaktinformasjon", "Gjennomgå og bekreft"];

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      bookingMode: 'one-time',
      date: new Date(),
      timeSlot: "",
      zoneId: "",
      purpose: "",
      attendees: 1,
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      organization: "",
    },
    mode: 'onChange'
  });

  const watchedValues = form.watch();

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const validateCurrentStep = async (): Promise<boolean> => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const getFieldsForStep = (step: number): (keyof BookingFormValues)[] => {
    switch (step) {
      case 0:
        return ['bookingMode', 'date', 'timeSlot', 'zoneId', 'purpose', 'attendees'];
      case 1:
        return ['contactName', 'contactEmail', 'contactPhone'];
      case 2:
        return [];
      default:
        return [];
    }
  };

  const canContinueToNextStep = (): boolean => {
    const fieldsToCheck = getFieldsForStep(currentStep);
    const errors = form.formState.errors;
    
    const hasErrors = fieldsToCheck.some(field => errors[field]);
    const hasValues = fieldsToCheck.every(field => {
      const value = watchedValues[field];
      return value !== "" && value !== undefined && value !== null;
    });

    return !hasErrors && hasValues;
  };

  const handleNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && canContinueToNextStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const generateBookingReference = (): string => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `BK-${timestamp}-${randomStr}`.toUpperCase();
  };

  const onSubmit = async (data: BookingFormValues) => {
    if (!termsAccepted) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Booking submitted:', data);
      const reference = generateBookingReference();
      onBookingComplete(reference);
    } catch (error) {
      console.error('Booking submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBookingData = (): BookingData => {
    const selectedZone = facility.zones.find(z => z.id === watchedValues.zoneId);
    
    return {
      date: watchedValues.date || new Date(),
      bookingMode: watchedValues.bookingMode || 'one-time',
      timeSlot: watchedValues.timeSlot || '',
      zoneId: watchedValues.zoneId || '',
      zoneName: selectedZone?.name || '',
      purpose: watchedValues.purpose || '',
      attendees: watchedValues.attendees || 1,
      contactName: watchedValues.contactName || '',
      contactEmail: watchedValues.contactEmail || '',
      contactPhone: watchedValues.contactPhone || '',
      organization: watchedValues.organization || '',
      endDate: watchedValues.endDate,
    };
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BookingDetailsStep 
            form={form}
            facility={facility}
          />
        );
      case 1:
        return <BookingContactStep form={form} />;
      case 2:
        return (
          <BookingConfirmStep
            facilityName={facility.name}
            bookingData={getBookingData()}
            termsAccepted={termsAccepted}
            onTermsAcceptedChange={setTermsAccepted}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden" role="main" aria-label="Booking form">
      {/* Clean Header */}
      <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900 mb-4" id="form-title">
          Ny reservasjon
        </h1>
        <CollapsibleFormStepper 
          currentStep={currentStep} 
          steps={stepTitles}
          onStepClick={setCurrentStep}
          canNavigateToStep={(stepIndex) => stepIndex <= currentStep}
          aria-label="Booking progress"
        />
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          {/* Form Content */}
          <div className="px-6 py-6">
            <div className="min-h-[400px]" role="tabpanel" aria-labelledby="form-title">
              {renderCurrentStep()}
            </div>
          </div>
          
          {/* Navigation Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <BookingFormNav
              currentStep={currentStep}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              canContinue={canContinueToNextStep()}
              isSubmitting={isSubmitting}
              isSubmitDisabled={!termsAccepted}
              onPreviousStep={handlePreviousStep}
              onNextStep={handleNextStep}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
