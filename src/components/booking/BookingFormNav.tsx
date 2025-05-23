
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
    <div className="flex justify-between pt-6 border-t border-gray-200">
      {!isFirstStep ? (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPreviousStep} 
          disabled={isSubmitting}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Tilbake
        </Button>
      ) : (
        <div></div> // Empty div to maintain layout with flex justify-between
      )}
      
      <Button 
        type={isLastStep ? "submit" : "button"}
        onClick={isLastStep ? undefined : onNextStep}
        className="bg-blue-600 hover:bg-blue-700 gap-1"
        disabled={isSubmitting || (isLastStep && isSubmitDisabled) || !canContinue}
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
            Sender...
          </>
        ) : isLastStep ? (
          <>
            Send inn reservasjon
            <CheckCircle className="h-4 w-4 ml-1" />
          </>
        ) : (
          <>
            Neste
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
