
import React from "react";
import { CheckCircle, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CollapsibleFormStepperProps {
  currentStep: number;
  steps: string[];
  onStepClick: (stepIndex: number) => void;
  canNavigateToStep: (stepIndex: number) => boolean;
  "aria-label"?: string;
}

export function CollapsibleFormStepper({ 
  currentStep, 
  steps, 
  onStepClick, 
  canNavigateToStep,
  "aria-label": ariaLabel 
}: CollapsibleFormStepperProps) {
  return (
    <div className="w-full" role="progressbar" aria-label={ariaLabel} aria-valuemin={0} aria-valuemax={steps.length - 1} aria-valuenow={currentStep}>
      <div className="flex flex-col md:flex-row gap-2">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          const canNavigate = canNavigateToStep(index);
          
          return (
            <div key={index} className="flex-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => canNavigate && onStepClick(index)}
                disabled={!canNavigate}
                className={cn(
                  "w-full justify-start gap-3 px-5 py-4 h-auto font-medium text-base transition-all duration-300 rounded-xl",
                  isCurrent && "bg-blue-600 border-2 border-blue-600 text-white shadow-lg",
                  isCompleted && "bg-green-50 border-2 border-green-200 text-green-800 hover:bg-green-100",
                  !isCurrent && !isCompleted && "bg-gray-50 border-2 border-gray-200 text-gray-700 hover:bg-gray-100",
                  !canNavigate && "cursor-not-allowed opacity-60"
                )}
                role="tab"
                aria-selected={isCurrent}
                aria-label={`Step ${index + 1}: ${step} ${isCompleted ? '(completed)' : isCurrent ? '(current)' : '(upcoming)'}`}
              >
                {/* Step Indicator */}
                <div 
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0 transition-all duration-300 font-bold text-sm",
                    isCompleted 
                      ? "bg-green-600 border-green-600 text-white shadow-md" 
                      : isCurrent 
                        ? "bg-white border-white text-blue-600"
                        : "bg-white border-gray-300 text-gray-600"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">
                      {index + 1}
                    </span>
                  )}
                </div>
                
                {/* Step Title */}
                <span 
                  className={cn(
                    "flex-1 text-left font-semibold text-base leading-tight",
                    isCurrent 
                      ? "text-white" 
                      : isCompleted 
                        ? "text-green-800"
                        : "text-gray-700"
                  )}
                >
                  {step}
                </span>
                
                {/* Status Indicator - Only show on mobile or when active */}
                <div className="md:hidden">
                  {isCurrent && (
                    <ChevronDown className="h-5 w-5 text-white" aria-hidden="true" />
                  )}
                  {!isCurrent && (
                    <ChevronRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </div>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
