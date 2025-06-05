
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
          className="gap-1.5 border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 h-8 px-3 text-sm"
          aria-label="Go to previous step"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Tilbake
        </Button>
      ) : (
        <div aria-hidden="true"></div>
      )}
      
      <Button 
        type={isLastStep ? "submit" : "button"}
        onClick={isLastStep ? undefined : onNextStep}
        className="bg-slate-700 hover:bg-slate-800 focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 gap-1.5 min-w-[120px] h-8 px-4 text-sm"
        disabled={isSubmitting || (isLastStep && isSubmitDisabled) || !canContinue}
        aria-label={isLastStep ? "Submit booking" : "Go to next step"}
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" aria-hidden="true"></span>
            <span>Sender...</span>
          </>
        ) : isLastStep ? (
          <>
            <span>Send inn</span>
            <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
          </>
        ) : (
          <>
            <span>Neste</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </>
        )}
      </Button>
    </nav>
  );
}
