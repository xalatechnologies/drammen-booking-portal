import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Calendar } from 'lucide-react';

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
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Hvilke dager?</h3>
        </div>
        {selectedWeekdays.length > 0 && (
          <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm font-semibold rounded-full">
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
              variant={isSelected ? "default" : "outline"}
              onClick={() => onWeekdayToggle(index)}
              className={`w-20 h-20 p-0 text-lg font-bold transition-all transform hover:scale-110 relative rounded-xl ${
                isSelected 
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-xl border-2 border-green-600' 
                  : 'hover:bg-green-50 hover:border-green-300 hover:shadow-lg border-2 border-gray-200'
              }`}
            >
              {isSelected && <Check className="absolute top-2 right-2 h-3 w-3" />}
              {day}
            </Button>
          );
        })}
      </div>
    </div>
  );
}