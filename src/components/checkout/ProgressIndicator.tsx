
import React from 'react';

interface ProgressIndicatorProps {
  currentStep: 'review' | 'details' | 'confirm';
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = ['review', 'details', 'confirm'];
  
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === stepName ? 'bg-blue-600 text-white' : 
              steps.indexOf(currentStep) > index ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            {index < 2 && <div className="w-12 h-px bg-gray-300 mx-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}
