
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
          className="h-2 bg-[#1e3a8a] rounded-full transition-all duration-300" 
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
                  ? 'bg-[#1e3a8a] border-[#1e3a8a] text-white' 
                  : currentStep > index 
                    ? 'bg-white border-[#1e3a8a] text-[#1e3a8a]'
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
