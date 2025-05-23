
import React from "react";

interface FormStepperProps {
  currentStep: number;
  steps: string[];
}

export function FormStepper({ currentStep, steps }: FormStepperProps) {
  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full mb-4">
        <div 
          className="h-2 bg-blue-600 rounded-full transition-all duration-300" 
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`rounded-full w-10 h-10 flex items-center justify-center border-2 transition-colors
                ${currentStep === index 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : currentStep > index 
                    ? 'bg-white border-blue-600 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-400'}`}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-1 font-medium">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
