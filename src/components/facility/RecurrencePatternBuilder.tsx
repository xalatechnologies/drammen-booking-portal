
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Repeat } from 'lucide-react';
import { RecurrencePattern } from '@/utils/recurrenceEngine';

interface RecurrencePatternBuilderProps {
  pattern: RecurrencePattern;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onClose: () => void;
  onApplyPattern?: (pattern: RecurrencePattern) => void;
}

const weekdayNames = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
const timeSlots = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'];

export function RecurrencePatternBuilder({ pattern, onPatternChange, onClose, onApplyPattern }: RecurrencePatternBuilderProps) {
  const [selectedFrequency, setSelectedFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');

  const updatePattern = (updates: Partial<RecurrencePattern>) => {
    onPatternChange({ ...pattern, ...updates });
  };

  const toggleWeekday = (day: number) => {
    const newWeekdays = pattern.weekdays.includes(day)
      ? pattern.weekdays.filter(d => d !== day)
      : [...pattern.weekdays, day];
    updatePattern({ weekdays: newWeekdays, type: selectedFrequency });
  };

  const toggleTimeSlot = (timeSlot: string) => {
    const newTimeSlots = pattern.timeSlots.includes(timeSlot)
      ? pattern.timeSlots.filter(t => t !== timeSlot)
      : [...pattern.timeSlots, timeSlot];
    updatePattern({ timeSlots: newTimeSlots });
  };

  const handleFrequencyChange = (frequency: 'weekly' | 'biweekly' | 'monthly') => {
    setSelectedFrequency(frequency);
    updatePattern({ type: frequency });
  };

  const handleApplyPattern = () => {
    if (onApplyPattern) {
      onApplyPattern({ ...pattern, type: selectedFrequency });
    }
    onClose();
  };

  return (
    <Card className="w-full max-w-2xl font-inter">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Repeat className="h-6 w-6" />
          Opprett gjentakende booking
        </CardTitle>
        <p className="text-base text-gray-600">
          Velg hvor ofte du vil reservere og hvilke tidspunkt
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Frequency Selection - Simplified */}
        <div>
          <h4 className="text-base font-medium mb-3 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Hvor ofte vil du reservere?
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant={selectedFrequency === 'weekly' ? 'default' : 'outline'}
              onClick={() => handleFrequencyChange('weekly')}
              className="h-16 flex-col gap-1"
            >
              <span className="font-medium">Ukentlig</span>
              <span className="text-xs opacity-70">Hver uke</span>
            </Button>
            <Button
              variant={selectedFrequency === 'biweekly' ? 'default' : 'outline'}
              onClick={() => handleFrequencyChange('biweekly')}
              className="h-16 flex-col gap-1"
            >
              <span className="font-medium">Annenhver uke</span>
              <span className="text-xs opacity-70">Hver 2. uke</span>
            </Button>
            <Button
              variant={selectedFrequency === 'monthly' ? 'default' : 'outline'}
              onClick={() => handleFrequencyChange('monthly')}
              className="h-16 flex-col gap-1"
            >
              <span className="font-medium">Månedlig</span>
              <span className="text-xs opacity-70">Én gang i måneden</span>
            </Button>
          </div>
        </div>

        {/* Weekday Selection */}
        <div>
          <h4 className="text-base font-medium mb-3">Hvilke dager?</h4>
          <div className="flex gap-2">
            {weekdayNames.map((day, index) => (
              <Button
                key={index}
                variant={pattern.weekdays.includes(index) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleWeekday(index)}
                className="w-14 h-14 p-0 text-base"
              >
                {day}
              </Button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">Velg én eller flere dager</p>
        </div>

        {/* Time Slots Selection */}
        <div>
          <h4 className="text-base font-medium mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Hvilke tidspunkt?
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <Button
                key={slot}
                variant={pattern.timeSlots.includes(slot) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleTimeSlot(slot)}
                className="justify-start text-base h-10"
              >
                {slot}
              </Button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">Velg tidspunkt du trenger</p>
        </div>

        {/* Preview */}
        {pattern.weekdays.length > 0 && pattern.timeSlots.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-base font-medium mb-2 text-blue-900">Din booking:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {selectedFrequency === 'weekly' ? 'Ukentlig' : 
                   selectedFrequency === 'biweekly' ? 'Annenhver uke' : 'Månedlig'}
                </Badge>
                <span className="text-sm text-blue-800">
                  {pattern.weekdays.map(day => weekdayNames[day]).join(', ')}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {pattern.timeSlots.map(slot => (
                  <Badge key={slot} variant="outline" className="text-xs">
                    {slot}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="text-base px-6">
            Avbryt
          </Button>
          <Button 
            onClick={handleApplyPattern}
            disabled={pattern.timeSlots.length === 0 || pattern.weekdays.length === 0}
            className="text-base px-6"
          >
            Legg til bookinger
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
