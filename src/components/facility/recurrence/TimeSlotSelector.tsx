import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Check } from 'lucide-react';

interface TimeSlotSelectorProps {
  selectedTimeSlots: string[];
  onTimeSlotToggle: (timeSlot: string) => void;
}

const timeSlots = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'];

export function TimeSlotSelector({ selectedTimeSlots, onTimeSlotToggle }: TimeSlotSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Hvilke tider?</h3>
        </div>
        {selectedTimeSlots.length > 0 && (
          <Badge className="bg-purple-100 text-purple-800 px-3 py-1 text-sm font-semibold rounded-full">
            {selectedTimeSlots.length} valgt
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {timeSlots.map((slot) => {
          const isSelected = selectedTimeSlots.includes(slot);
          return (
            <Button
              key={slot}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onTimeSlotToggle(slot)}
              className={`h-14 text-base font-medium transition-all transform hover:scale-105 relative rounded-xl ${
                isSelected 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg border-2 border-purple-600' 
                  : 'hover:bg-purple-50 hover:border-purple-300 hover:shadow-md border-2 border-gray-200'
              }`}
            >
              {isSelected && <Check className="absolute top-2 right-2 h-3 w-3" />}
              {slot}
            </Button>
          );
        })}
      </div>
    </div>
  );
}