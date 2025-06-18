import React from 'react';
import { Button } from '@/components/ui/button';
import { Repeat } from 'lucide-react';
import { RecurrencePattern, recurrenceEngine } from '@/utils/recurrenceEngine';

interface RecurrencePatternButtonProps {
  pattern: RecurrencePattern | null;
  onClick: () => void;
}

export function RecurrencePatternButton({ pattern, onClick }: RecurrencePatternButtonProps) {
  const hasPattern = pattern && pattern.weekdays.length > 0 && pattern.timeSlots.length > 0;
  
  return (
    <Button
      variant={hasPattern ? "default" : "outline"}
      onClick={onClick}
      className={`gap-2 h-12 text-base font-medium rounded-xl ${
        hasPattern 
          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
          : 'border-2 border-gray-200 hover:border-blue-600 text-gray-700'
      }`}
    >
      <Repeat className="h-5 w-5" />
      {hasPattern 
        ? `${recurrenceEngine.getPatternDescription(pattern)}`
        : 'Opprett gjentakende reservasjon'
      }
    </Button>
  );
}