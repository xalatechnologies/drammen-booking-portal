
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface TimeSlotStepProps {
  selectedTimeSlots: string[];
  onTimeSlotToggle: (timeSlot: string) => void;
}

const timeSlots = [
  '08:00-10:00', '10:00-12:00', '12:00-14:00', 
  '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'
];

export function TimeSlotStep({ selectedTimeSlots, onTimeSlotToggle }: TimeSlotStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Hvilke tider?</h2>
        <p className="text-gray-600 text-lg mb-4">Velg hvilke tidspunkt du vil reservere</p>
        {selectedTimeSlots.length > 0 && (
          <Badge variant="secondary" className="text-sm">
            {selectedTimeSlots.length} tidspunkt valgt
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
        {timeSlots.map((slot) => {
          const isSelected = selectedTimeSlots.includes(slot);
          return (
            <Button
              key={slot}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onTimeSlotToggle(slot)}
              className={`
                h-14 text-base font-medium transition-colors
                ${isSelected 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                  : 'hover:bg-gray-50 border-gray-200'
                }
              `}
            >
              {slot}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
