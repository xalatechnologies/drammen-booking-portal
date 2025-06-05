
import React from "react";
import { CheckCircle } from "lucide-react";

interface FormStepperProps {
  currentStep: number;
  steps: string[];
}

export function FormStepper({ currentStep, steps }: FormStepperProps) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
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
                    relative rounded-full w-10 h-10 flex items-center justify-center border-2 transition-all duration-300 z-10
                    ${isCompleted 
                      ? 'bg-green-500 border-green-500 text-white shadow-lg' 
                      : isCurrent 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110'
                        : 'bg-white border-gray-300 text-gray-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-2">
                    <div 
                      className={`
                        h-0.5 w-full transition-all duration-300
                        ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                      `}
                    />
                  </div>
                )}
              </div>
              
              {/* Step label */}
              <div className="mt-3 text-center max-w-24">
                <span 
                  className={`
                    text-xs font-medium leading-tight
                    ${isCurrent 
                      ? 'text-blue-600' 
                      : isCompleted 
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }
                  `}
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
