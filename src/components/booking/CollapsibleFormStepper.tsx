
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
      <div className="space-y-2">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          const canNavigate = canNavigateToStep(index);
          
          return (
            <div key={index} className="flex items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => canNavigate && onStepClick(index)}
                disabled={!canNavigate}
                className={cn(
                  "flex items-center gap-3 p-3 w-full justify-start h-auto font-medium text-sm transition-all duration-200",
                  isCurrent && "bg-slate-100 border border-slate-200 rounded-md",
                  isCompleted && "text-green-700",
                  !canNavigate && "cursor-not-allowed opacity-50"
                )}
                role="button"
                aria-label={`Step ${index + 1}: ${step} ${isCompleted ? '(completed)' : isCurrent ? '(current)' : '(upcoming)'}`}
              >
                {/* Step Indicator */}
                <div 
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all duration-200",
                    isCompleted 
                      ? "bg-green-600 border-green-600" 
                      : isCurrent 
                        ? "bg-slate-700 border-slate-700"
                        : "bg-white border-gray-300"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-white" aria-hidden="true" />
                  ) : (
                    <span 
                      className={cn(
                        "text-xs font-bold",
                        isCurrent ? "text-white" : "text-gray-500"
                      )}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
                
                {/* Step Title */}
                <span 
                  className={cn(
                    "flex-1 text-left font-medium",
                    isCurrent 
                      ? "text-slate-900" 
                      : isCompleted 
                        ? "text-green-700"
                        : "text-gray-600"
                  )}
                >
                  {step}
                </span>
                
                {/* Expand/Collapse Indicator */}
                {isCurrent && (
                  <ChevronDown className="h-4 w-4 text-slate-600" aria-hidden="true" />
                )}
                {!isCurrent && (
                  <ChevronRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
                )}
              </Button>
            </div>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
