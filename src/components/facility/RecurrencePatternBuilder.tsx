
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Repeat, Check, X } from 'lucide-react';
import { RecurrencePattern } from '@/utils/recurrenceEngine';
import { FrequencySelector } from './recurrence/FrequencySelector';
import { WeekdaySelector } from './recurrence/WeekdaySelector';
import { TimeSlotSelector } from './recurrence/TimeSlotSelector';
import { PatternPreview } from './recurrence/PatternPreview';
import { ValidationMessage } from './recurrence/ValidationMessage';

interface RecurrencePatternBuilderProps {
  pattern: RecurrencePattern;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onClose: () => void;
  onApplyPattern?: (pattern: RecurrencePattern) => void;
}

type SupportedFrequency = 'weekly' | 'biweekly' | 'monthly';

export function RecurrencePatternBuilder({ pattern, onPatternChange, onClose, onApplyPattern }: RecurrencePatternBuilderProps) {
  // Ensure we only use supported frequency types, default to 'weekly'
  const getSupportedFrequency = (type: RecurrencePattern['type']): SupportedFrequency => {
    if (type === 'weekly' || type === 'biweekly' || type === 'monthly') {
      return type;
    }
    return 'weekly';
  };

  const [selectedFrequency, setSelectedFrequency] = useState<SupportedFrequency>(
    getSupportedFrequency(pattern.type)
  );

  const updatePattern = (updates: Partial<RecurrencePattern>) => {
    onPatternChange({ ...pattern, ...updates });
  };

  const handleWeekdayToggle = (day: number) => {
    const newWeekdays = pattern.weekdays.includes(day)
      ? pattern.weekdays.filter(d => d !== day)
      : [...pattern.weekdays, day];
    updatePattern({ weekdays: newWeekdays, type: selectedFrequency });
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    const newTimeSlots = pattern.timeSlots.includes(timeSlot)
      ? pattern.timeSlots.filter(t => t !== timeSlot)
      : [...pattern.timeSlots, timeSlot];
    updatePattern({ timeSlots: newTimeSlots });
  };

  const handleFrequencyChange = (frequency: SupportedFrequency) => {
    setSelectedFrequency(frequency);
    updatePattern({ type: frequency });
  };

  const handleApplyPattern = () => {
    if (onApplyPattern) {
      onApplyPattern({ ...pattern, type: selectedFrequency });
    }
    onClose();
  };

  const isValid = pattern.weekdays.length > 0 && pattern.timeSlots.length > 0;

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Repeat className="h-6 w-6" />
            </div>
            Gjentakende Reservasjon
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 space-y-8">
        <FrequencySelector
          selectedFrequency={selectedFrequency}
          onFrequencyChange={handleFrequencyChange}
        />

        <WeekdaySelector
          selectedWeekdays={pattern.weekdays}
          onWeekdayToggle={handleWeekdayToggle}
        />

        <TimeSlotSelector
          selectedTimeSlots={pattern.timeSlots}
          onTimeSlotToggle={handleTimeSlotToggle}
        />

        {isValid ? (
          <PatternPreview
            selectedFrequency={selectedFrequency}
            selectedWeekdays={pattern.weekdays}
            selectedTimeSlots={pattern.timeSlots}
          />
        ) : (
          <ValidationMessage
            selectedWeekdays={pattern.weekdays}
            selectedTimeSlots={pattern.timeSlots}
          />
        )}

        <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 h-14 text-lg font-semibold hover:bg-gray-50"
          >
            Avbryt
          </Button>
          <Button 
            onClick={handleApplyPattern}
            disabled={!isValid}
            className={`flex-1 h-14 text-lg font-bold transition-all transform ${
              isValid 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:scale-105' 
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <Check className="h-5 w-5 mr-2" />
            Opprett Reservasjoner
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
