
import React from 'react';

interface CheckoutBreadcrumbProps {
  currentStep: 'contact' | 'review' | 'confirmation';
}

export function CheckoutBreadcrumb({ currentStep }: CheckoutBreadcrumbProps) {
  const steps = [
    { key: 'contact', label: 'Contact Details' },
    { key: 'review', label: 'Review' },
    { key: 'confirmation', label: 'Confirmation' }
  ];

  return (
    <div className="bg-gray-50 border-b">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <nav className="flex space-x-4">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`flex items-center ${
                currentStep === step.key ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}
            >
              <span className="text-sm">{step.label}</span>
              {index < steps.length - 1 && (
                <span className="mx-2 text-gray-300">→</span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
