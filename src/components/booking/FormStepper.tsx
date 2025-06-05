
import React from "react";
import { CheckCircle } from "lucide-react";

interface FormStepperProps {
  currentStep: number;
  steps: string[];
  "aria-label"?: string;
}

export function FormStepper({ currentStep, steps, "aria-label": ariaLabel }: FormStepperProps) {
  return (
    <div className="w-full" role="progressbar" aria-label={ariaLabel} aria-valuemin={0} aria-valuemax={steps.length - 1} aria-valuenow={currentStep}>
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-2 bg-gradient-to-r from-slate-800 to-slate-700 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          aria-hidden="true"
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          const isUpcoming = currentStep < index;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {/* Step circle */}
                <div 
                  className={`
                    relative rounded-full w-8 h-8 flex items-center justify-center border-2 transition-all duration-300 z-10 text-sm font-semibold
                    ${isCompleted 
                      ? 'bg-green-600 border-green-600 text-white shadow-md' 
                      : isCurrent 
                        ? 'bg-slate-800 border-slate-800 text-white shadow-md scale-105'
                        : 'bg-white border-gray-300 text-gray-500'
                    }
                  `}
                  role="img"
                  aria-label={`Step ${index + 1} ${isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming'}: ${step}`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">{index + 1}</span>
                  )}
                </div>
                
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2">
                    <div 
                      className={`
                        h-0.5 w-full transition-all duration-300
                        ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}
                      `}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
              
              {/* Step label */}
              <div className="mt-2 text-center max-w-24">
                <span 
                  className={`
                    text-xs font-medium leading-tight
                    ${isCurrent 
                      ? 'text-slate-800 font-semibold' 
                      : isCompleted 
                        ? 'text-green-700'
                        : 'text-gray-500'
                    }
                  `}
                  aria-hidden="true"
                >
                  {step}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
