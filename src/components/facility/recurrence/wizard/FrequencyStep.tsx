
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

type SupportedFrequency = 'weekly' | 'biweekly' | 'monthly';

interface FrequencyStepProps {
  selectedFrequency: SupportedFrequency;
  onFrequencyChange: (frequency: SupportedFrequency) => void;
}

const frequencyOptions = [
  { 
    value: 'weekly' as const, 
    label: 'Ukentlig', 
    description: 'Samme tid hver uke',
    icon: '📅' 
  },
  { 
    value: 'biweekly' as const, 
    label: 'Hver 2. uke', 
    description: 'Annenhver uke',
    icon: '📆' 
  },
  { 
    value: 'monthly' as const, 
    label: 'Månedlig', 
    description: 'Samme uke hver måned',
    icon: '🗓️' 
  }
];

export function FrequencyStep({ selectedFrequency, onFrequencyChange }: FrequencyStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Hvor ofte vil du reservere?</h2>
        <p className="text-gray-600">Velg hvor ofte du vil at reservasjonen skal gjentas</p>
      </div>

      <div className="grid gap-4 max-w-md mx-auto">
        {frequencyOptions.map((option) => {
          const isSelected = selectedFrequency === option.value;
          return (
            <Button
              key={option.value}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onFrequencyChange(option.value)}
              className={`
                h-auto p-4 flex-col gap-2 text-left transition-all
                ${isSelected 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                  : 'hover:bg-gray-50 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-3 w-full">
                <span className="text-2xl">{option.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold">{option.label}</div>
                  <div className={`text-sm ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                    {option.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
