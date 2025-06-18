
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface WeekdaySelectorProps {
  selectedWeekdays: number[];
  onWeekdayToggle: (day: number) => void;
}

const weekdayNames = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];

export function WeekdaySelector({ selectedWeekdays, onWeekdayToggle }: WeekdaySelectorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <span className="text-xl">📅</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Hvilke dager?</h3>
        </div>
        {selectedWeekdays.length > 0 && (
          <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm font-semibold">
            {selectedWeekdays.length} valgt
          </Badge>
        )}
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        {weekdayNames.map((day, index) => {
          const isSelected = selectedWeekdays.includes(index);
          return (
            <Button
              key={index}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onWeekdayToggle(index)}
              className={`w-20 h-20 p-0 text-lg font-bold transition-all transform hover:scale-110 relative ${
                isSelected 
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-xl ring-4 ring-green-200' 
                  : 'hover:bg-green-50 hover:border-green-300 hover:shadow-lg'
              }`}
            >
              {isSelected && <Check className="absolute top-1 right-1 h-4 w-4" />}
              {day}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
