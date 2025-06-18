
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
    <div className="space-y-6">
      <div className="text-center">
        <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Hvilke tider?</h2>
        <p className="text-gray-600">Velg hvilke tidspunkt du vil reservere</p>
        {selectedTimeSlots.length > 0 && (
          <Badge variant="secondary" className="mt-2">
            {selectedTimeSlots.length} tidspunkt valgt
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
        {timeSlots.map((slot) => {
          const isSelected = selectedTimeSlots.includes(slot);
          return (
            <Button
              key={slot}
              variant={isSelected ? 'default' : 'outline'}
              onClick={() => onTimeSlotToggle(slot)}
              className={`
                h-12 text-base font-medium transition-all
                ${isSelected 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                  : 'hover:bg-gray-50 hover:border-gray-300'
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
