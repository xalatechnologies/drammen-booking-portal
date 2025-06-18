import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ValidationMessageProps {
  selectedWeekdays: number[];
  selectedTimeSlots: string[];
}

export function ValidationMessage({ selectedWeekdays, selectedTimeSlots }: ValidationMessageProps) {
  const hasWeekdays = selectedWeekdays.length > 0;
  const hasTimeSlots = selectedTimeSlots.length > 0;

  if (hasWeekdays && hasTimeSlots) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 shadow-md">
      <div className="flex items-center gap-3 text-amber-800">
        <div className="p-2 bg-amber-100 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <p className="font-bold text-lg">Nesten ferdig!</p>
          <p className="text-base opacity-90">
            {!hasWeekdays && !hasTimeSlots 
              ? "Velg dager og tider for å opprette gjentakende reservasjon" 
              : !hasWeekdays 
              ? "Velg minst én dag" 
              : "Velg minst ett tidspunkt"}
          </p>
        </div>
      </div>
    </div>
  );
}