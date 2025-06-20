
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WeekdayStepProps {
  selectedWeekdays: number[];
  onWeekdayToggle: (day: number) => void;
}

// Start with Monday (1) instead of Sunday (0)
const weekdayNames = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];
const weekdayValues = [1, 2, 3, 4, 5, 6, 0]; // Monday = 1, Sunday = 0

export function WeekdayStep({ selectedWeekdays, onWeekdayToggle }: WeekdayStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="text-5xl mb-4">📅</div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Hvilke dager?</h2>
        <p className="text-gray-600 text-lg mb-4">Velg hvilke dager i uken du vil reservere</p>
        {selectedWeekdays.length > 0 && (
          <Badge variant="secondary" className="text-sm">
            {selectedWeekdays.length} dag{selectedWeekdays.length !== 1 ? 'er' : ''} valgt
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
        {weekdayNames.map((day, index) => {
          const dayValue = weekdayValues[index];
          const isSelected = selectedWeekdays.includes(dayValue);
          return (
            <Button
              key={index}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onWeekdayToggle(dayValue)}
              className={`
                h-16 text-lg font-medium transition-colors
                ${isSelected 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                  : 'hover:bg-gray-50 border-gray-200'
                }
              `}
            >
              {day}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
