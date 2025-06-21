
import React from 'react';
import { CheckCircle, Circle, User, CreditCard, Eye } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: 'review' | 'login' | 'confirm';
  isAuthenticated: boolean;
}

export function ProgressIndicator({ currentStep, isAuthenticated }: ProgressIndicatorProps) {
  const steps = isAuthenticated ? ['review', 'confirm'] : ['review', 'login', 'confirm'];
  const stepLabels = isAuthenticated 
    ? ['Gjennomgå', 'Bekreft']
    : ['Gjennomgå', 'Logg inn', 'Bekreft'];
  
  const stepIcons = isAuthenticated
    ? [Eye, CreditCard]
    : [Eye, User, CreditCard];
  
  const currentStepIndex = steps.indexOf(currentStep);
  
  return (
    <div className="flex items-center justify-center mb-12">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-0">
        <div className="flex items-center space-x-8">
          {steps.map((stepName, index) => {
            const Icon = stepIcons[index];
            const isActive = currentStep === stepName;
            const isCompleted = currentStepIndex > index;
            
            return (
              <div key={stepName} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110' : 
                    isCompleted ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <span className={`mt-3 text-sm font-medium transition-colors ${
                    isActive ? 'text-blue-600' : 
                    isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {stepLabels[index]}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-px mx-6 transition-colors ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
