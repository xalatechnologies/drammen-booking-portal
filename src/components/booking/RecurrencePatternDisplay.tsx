import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Repeat, Calendar, Clock } from 'lucide-react';
import { RecurrencePattern, recurrenceEngine } from '@/utils/recurrenceEngine';

interface RecurrencePatternDisplayProps {
  pattern: RecurrencePattern;
}

export function RecurrencePatternDisplay({ pattern }: RecurrencePatternDisplayProps) {
  const weekdayNames = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
  const selectedDays = pattern.weekdays.map(day => weekdayNames[day]).join(', ');
  
  let frequencyLabel = '';
  switch (pattern.type) {
    case 'weekly':
      frequencyLabel = 'Ukentlig';
      break;
    case 'biweekly':
      frequencyLabel = 'Annenhver uke';
      break;
    case 'monthly':
      frequencyLabel = 'Månedlig';
      break;
    case 'daily':
      frequencyLabel = 'Daglig';
      break;
    default:
      frequencyLabel = 'Gjentakende';
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Repeat className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-blue-900">Gjentakende reservasjon</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 rounded-full">
            {frequencyLabel}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-blue-800">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="text-sm">{selectedDays}</span>
        </div>
        
        {pattern.timeSlots.length > 0 && (
          <div className="flex items-center gap-2 text-blue-800">
            <Clock className="h-4 w-4 text-blue-600" />
            <div className="flex flex-wrap gap-1">
              {pattern.timeSlots.map(slot => (
                <Badge key={slot} variant="outline" className="text-blue-700 border-blue-300 bg-white text-xs">
                  {slot}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {pattern.endDate && (
          <p className="text-sm text-blue-700">
            Til {pattern.endDate.toLocaleDateString('nb-NO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}
      </div>
    </div>
  );
}