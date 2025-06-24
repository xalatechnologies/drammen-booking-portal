
import React from 'react';

interface ProgressIndicatorProps {
  currentStep: 'contact' | 'review' | 'confirmation';
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps = ['contact', 'review', 'confirmation'];
  const currentIndex = steps.indexOf(currentStep);
  const progress = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
