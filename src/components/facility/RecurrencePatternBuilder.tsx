
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Repeat, Check, X } from 'lucide-react';
import { RecurrencePattern } from '@/utils/recurrenceEngine';

interface RecurrencePatternBuilderProps {
  pattern: RecurrencePattern;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onClose: () => void;
  onApplyPattern?: (pattern: RecurrencePattern) => void;
}

const weekdayNames = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
const timeSlots = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'];

const frequencyOptions = [
  { value: 'weekly' as const, label: 'Ukentlig', icon: '📅' },
  { value: 'biweekly' as const, label: 'Hver 2. uke', icon: '📆' },
  { value: 'monthly' as const, label: 'Månedlig', icon: '🗓️' }
];

export function RecurrencePatternBuilder({ pattern, onPatternChange, onClose, onApplyPattern }: RecurrencePatternBuilderProps) {
  const [selectedFrequency, setSelectedFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>(pattern.type || 'weekly');

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

  const isValid = pattern.weekdays.length > 0 && pattern.timeSlots.length > 0;
  const selectedDays = pattern.weekdays.map(day => weekdayNames[day]).join(', ');

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-800">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Repeat className="h-5 w-5 text-blue-600" />
            </div>
            Gjentakende reservasjon
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 space-y-8">
        {/* Frequency Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-800">Frekvens</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {frequencyOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedFrequency === option.value ? 'default' : 'outline'}
                onClick={() => handleFrequencyChange(option.value)}
                className={`h-20 flex-col gap-2 text-base font-medium transition-all ${
                  selectedFrequency === option.value 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                    : 'hover:bg-blue-50 hover:border-blue-300'
                }`}
              >
                <span className="text-2xl">{option.icon}</span>
                <span>{option.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Weekday Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <h3 className="text-lg font-medium text-gray-800">Dager</h3>
            </div>
            {pattern.weekdays.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pattern.weekdays.length} valgt
              </Badge>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {weekdayNames.map((day, index) => {
              const isSelected = pattern.weekdays.includes(index);
              return (
                <Button
                  key={index}
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => toggleWeekday(index)}
                  className={`w-16 h-16 p-0 text-base font-medium transition-all ${
                    isSelected 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                      : 'hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  {isSelected && <Check className="absolute top-1 right-1 h-3 w-3" />}
                  {day}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Time Slots Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-800">Tidspunkt</h3>
            {pattern.timeSlots.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pattern.timeSlots.length} valgt
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {timeSlots.map((slot) => {
              const isSelected = pattern.timeSlots.includes(slot);
              return (
                <Button
                  key={slot}
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => toggleTimeSlot(slot)}
                  className={`h-12 text-base font-medium transition-all relative ${
                    isSelected 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                      : 'hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  {isSelected && <Check className="absolute top-1 right-1 h-3 w-3" />}
                  {slot}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Preview */}
        {isValid && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Check className="h-5 w-5 text-green-600" />
              <h4 className="text-lg font-medium text-green-800">Din reservasjon</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  {frequencyOptions.find(f => f.value === selectedFrequency)?.label}
                </Badge>
                <span className="text-green-700 font-medium">{selectedDays}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {pattern.timeSlots.map(slot => (
                  <Badge key={slot} variant="outline" className="text-green-700 border-green-300">
                    {slot}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Validation Message */}
        {!isValid && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <span className="text-lg">⚠️</span>
              <span className="font-medium">
                Velg minst én dag og ett tidspunkt for å fortsette
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-100">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 h-12 text-base font-medium"
          >
            Avbryt
          </Button>
          <Button 
            onClick={handleApplyPattern}
            disabled={!isValid}
            className="flex-1 h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="h-4 w-4 mr-2" />
            Opprett reservasjoner
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
