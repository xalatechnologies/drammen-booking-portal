
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
          className="gap-2 border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 h-12 px-6 text-base font-medium rounded-xl"
          aria-label="Go to previous step"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          Tilbake
        </Button>
      ) : (
        <div aria-hidden="true"></div>
      )}
      
      <Button 
        type={isLastStep ? "submit" : "button"}
        onClick={isLastStep ? undefined : onNextStep}
        className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 gap-2 min-w-[140px] h-12 px-8 text-base font-semibold rounded-xl shadow-lg shadow-blue-200/50"
        disabled={isSubmitting || (isLastStep && isSubmitDisabled) || !canContinue}
        aria-label={isLastStep ? "Submit booking" : "Go to next step"}
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" aria-hidden="true"></span>
            <span>Sender...</span>
          </>
        ) : isLastStep ? (
          <>
            <span>Send inn reservasjon</span>
            <CheckCircle className="h-5 w-5" aria-hidden="true" />
          </>
        ) : (
          <>
            <span>Neste steg</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </>
        )}
      </Button>
    </nav>
  );
}
