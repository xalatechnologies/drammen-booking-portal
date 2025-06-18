
import React from "react";
import { Form } from "@/components/ui/form";
import { BookingFormNav } from "./BookingFormNav";
import { CollapsibleFormStepper } from "./CollapsibleFormStepper";
import { BookingFormProvider, useBookingForm } from "./BookingFormProvider";
import { BookingFormSteps } from "./BookingFormSteps";
import { validateCurrentStep, canContinueToNextStep } from "./BookingFormValidation";
import { Zone, BookingStep } from "./types";
import { BookingFormValues } from "./formSchema";

interface EnhancedBookingFormProps {
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
  onBookingComplete: (reference: string) => void;
}

function BookingFormContent({ facility, onBookingComplete }: EnhancedBookingFormProps) {
  const {
    form,
    currentStep,
    setCurrentStep,
    isSubmitting,
    setIsSubmitting,
    termsAccepted
  } = useBookingForm();

  const steps: BookingStep[] = ['details', 'services', 'contact', 'confirm'];
  const stepTitles = [
    "Reservasjonsdetaljer", 
    "Ekstra tjenester", 
    "Kontaktinformasjon", 
    "Gjennomgå og bekreft"
  ];

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNextStep = async () => {
    const isValid = await validateCurrentStep(form, currentStep);
    if (isValid && canContinueToNextStep(form, currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
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

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden" role="main" aria-label="Booking form">
      {/* Clean Header */}
      <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-b border-gray-200">
        <CollapsibleFormStepper 
          currentStep={currentStep} 
          steps={stepTitles} 
          onStepClick={setCurrentStep} 
          canNavigateToStep={stepIndex => stepIndex <= currentStep} 
          aria-label="Booking progress" 
        />
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          {/* Form Content */}
          <div className="px-6 py-6">
            <div className="min-h-[400px]" role="tabpanel" aria-labelledby="form-title">
              <BookingFormSteps facility={facility} />
            </div>
          </div>
          
          {/* Navigation Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <BookingFormNav 
              currentStep={currentStep} 
              isFirstStep={isFirstStep} 
              isLastStep={isLastStep} 
              canContinue={canContinueToNextStep(form, currentStep)} 
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

export function EnhancedBookingForm(props: EnhancedBookingFormProps) {
  return (
    <BookingFormProvider>
      <BookingFormContent {...props} />
    </BookingFormProvider>
  );
}
