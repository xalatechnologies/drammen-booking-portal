
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WeekdayStepProps {
  selectedWeekdays: number[];
  onWeekdayToggle: (day: number) => void;
}

const weekdayNames = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];

export function WeekdayStep({ selectedWeekdays, onWeekdayToggle }: WeekdayStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">📅</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Hvilke dager?</h2>
        <p className="text-gray-600">Velg hvilke dager i uken du vil reservere</p>
        {selectedWeekdays.length > 0 && (
          <Badge variant="secondary" className="mt-2">
            {selectedWeekdays.length} dag{selectedWeekdays.length !== 1 ? 'er' : ''} valgt
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
        {weekdayNames.map((day, index) => {
          const isSelected = selectedWeekdays.includes(index);
          return (
            <Button
              key={index}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onWeekdayToggle(index)}
              className={`
                h-16 text-base font-medium transition-all
                ${isSelected 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                  : 'hover:bg-gray-50 hover:border-gray-300'
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
