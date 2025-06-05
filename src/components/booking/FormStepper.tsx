
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
      {/* Ultra Minimal Progress bar */}
      <div className="w-full h-0.5 bg-gray-200 rounded-full mb-3 overflow-hidden">
        <div 
          className="h-0.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          aria-hidden="true"
        />
      </div>
      
      {/* Ultra Compact Step indicators */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isCurrent = currentStep === index;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {/* Tiny step circle */}
                <div 
                  className={`
                    relative rounded-full w-4 h-4 flex items-center justify-center border transition-all duration-200 z-10
                    ${isCompleted 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : isCurrent 
                        ? 'bg-slate-700 border-slate-700 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }
                  `}
                  role="img"
                  aria-label={`Step ${index + 1} ${isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming'}: ${step}`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-2.5 w-2.5" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true" className="text-[10px] font-bold">{index + 1}</span>
                  )}
                </div>
                
                {/* Hair-thin connecting line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-1">
                    <div 
                      className={`
                        h-px w-full transition-all duration-200
                        ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}
                      `}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
              
              {/* Micro step label */}
              <div className="mt-1 text-center max-w-16">
                <span 
                  className={`
                    text-[10px] font-medium leading-tight
                    ${isCurrent 
                      ? 'text-slate-700 font-semibold' 
                      : isCompleted 
                        ? 'text-green-600'
                        : 'text-gray-400'
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
