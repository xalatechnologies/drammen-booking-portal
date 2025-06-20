
import React from 'react';

interface ProgressIndicatorProps {
  currentStep: 'review' | 'login' | 'confirm';
  isAuthenticated: boolean;
}

export function ProgressIndicator({ currentStep, isAuthenticated }: ProgressIndicatorProps) {
  // If user is authenticated, skip login step
  const steps = isAuthenticated ? ['review', 'confirm'] : ['review', 'login', 'confirm'];
  const stepLabels = isAuthenticated 
    ? ['Gjennomgå', 'Bekreft']
    : ['Gjennomgå', 'Logg inn', 'Bekreft'];
  
  const currentStepIndex = steps.indexOf(currentStep);
  
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === stepName ? 'bg-blue-600 text-white' : 
              currentStepIndex > index ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              {stepLabels[index]}
            </span>
            {index < steps.length - 1 && <div className="w-12 h-px bg-gray-300 mx-4" />}
          </div>
        ))}
      </div>
    </div>
  );
}
