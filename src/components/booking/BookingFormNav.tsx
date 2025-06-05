
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

interface BookingFormNavProps {
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  canContinue: boolean;
  isSubmitting: boolean;
  isSubmitDisabled: boolean;
  onPreviousStep: () => void;
  onNextStep: () => void;
}

export function BookingFormNav({ 
  currentStep, 
  isFirstStep,
  isLastStep,
  canContinue,
  isSubmitting, 
  isSubmitDisabled,
  onPreviousStep, 
  onNextStep 
}: BookingFormNavProps) {
  return (
    <nav className="flex justify-between items-center" aria-label="Form navigation">
      {!isFirstStep ? (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPreviousStep} 
          disabled={isSubmitting}
          className="gap-2 border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-slate-800 focus:ring-offset-2"
          aria-label="Go to previous step"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Tilbake
        </Button>
      ) : (
        <div aria-hidden="true"></div>
      )}
      
      <Button 
        type={isLastStep ? "submit" : "button"}
        onClick={isLastStep ? undefined : onNextStep}
        className="bg-slate-800 hover:bg-slate-900 focus:ring-2 focus:ring-slate-800 focus:ring-offset-2 gap-2 min-w-[140px]"
        disabled={isSubmitting || (isLastStep && isSubmitDisabled) || !canContinue}
        aria-label={isLastStep ? "Submit booking" : "Go to next step"}
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" aria-hidden="true"></span>
            <span>Sender...</span>
            <span className="sr-only">Sending booking request</span>
          </>
        ) : isLastStep ? (
          <>
            <span>Send inn reservasjon</span>
            <CheckCircle className="h-4 w-4" aria-hidden="true" />
          </>
        ) : (
          <>
            <span>Neste</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </Button>
    </nav>
  );
}
