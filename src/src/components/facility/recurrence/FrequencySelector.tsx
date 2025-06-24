
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Check } from 'lucide-react';

type SupportedFrequency = 'weekly' | 'biweekly' | 'monthly';

interface FrequencySelectorProps {
  selectedFrequency: SupportedFrequency;
  onFrequencyChange: (frequency: SupportedFrequency) => void;
}

const frequencyOptions = [
  { value: 'weekly' as const, label: 'Ukentlig', icon: '📅' },
  { value: 'biweekly' as const, label: 'Hver 2. uke', icon: '📆' },
  { value: 'monthly' as const, label: 'Månedlig', icon: '🗓️' }
];

export function FrequencySelector({ selectedFrequency, onFrequencyChange }: FrequencySelectorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calendar className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Hvor ofte?</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {frequencyOptions.map((option) => {
          const isSelected = selectedFrequency === option.value;
          return (
            <Button
              key={option.value}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onFrequencyChange(option.value)}
              className={`h-24 flex-col gap-3 text-lg font-semibold transition-all transform hover:scale-105 ${
                isSelected 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl ring-4 ring-blue-200' 
                  : 'hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg'
              }`}
            >
              <span className="text-3xl">{option.icon}</span>
              <span>{option.label}</span>
              {isSelected && <Check className="absolute top-2 right-2 h-4 w-4" />}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
