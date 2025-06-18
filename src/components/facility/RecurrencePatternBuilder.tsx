
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
  const selectedDays = pattern.weekdays.map(day => weekdayNames[day]).join(', ');

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
        {/* Smart Frequency Selection */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Hvor ofte?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {frequencyOptions.map((option) => {
              const isSelected = selectedFrequency === option.value;
              return (
                <Button
                  key={option.value}
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => handleFrequencyChange(option.value)}
                  className={`h-24 flex-col gap-3 text-lg font-semibold transition-all transform hover:scale-105 ${
                    isSelected 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl ring-4 ring-blue-200' 
                      : 'hover:bg-blue-50 hover:border-blue-300 hover:shadow-lg'
                  }`}
                >
                  <span className="text-3xl">{option.icon}</span>
                  <span>{option.label}</span>
                  {isSelected && <Check className="absolute top-2 right-2 h-4 w-4" />}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Smart Weekday Selection */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-xl">📅</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Hvilke dager?</h3>
            </div>
            {pattern.weekdays.length > 0 && (
              <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm font-semibold">
                {pattern.weekdays.length} valgt
              </Badge>
            )}
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            {weekdayNames.map((day, index) => {
              const isSelected = pattern.weekdays.includes(index);
              return (
                <Button
                  key={index}
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => toggleWeekday(index)}
                  className={`w-20 h-20 p-0 text-lg font-bold transition-all transform hover:scale-110 relative ${
                    isSelected 
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-xl ring-4 ring-green-200' 
                      : 'hover:bg-green-50 hover:border-green-300 hover:shadow-lg'
                  }`}
                >
                  {isSelected && <Check className="absolute top-1 right-1 h-4 w-4" />}
                  {day}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Smart Time Slots Selection */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Hvilke tider?</h3>
            </div>
            {pattern.timeSlots.length > 0 && (
              <Badge className="bg-purple-100 text-purple-800 px-3 py-1 text-sm font-semibold">
                {pattern.timeSlots.length} valgt
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {timeSlots.map((slot) => {
              const isSelected = pattern.timeSlots.includes(slot);
              return (
                <Button
                  key={slot}
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => toggleTimeSlot(slot)}
                  className={`h-14 text-base font-semibold transition-all transform hover:scale-105 relative ${
                    isSelected 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg ring-3 ring-purple-200' 
                      : 'hover:bg-purple-50 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  {isSelected && <Check className="absolute top-1 right-1 h-3 w-3" />}
                  {slot}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Smart Preview */}
        {isValid && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Check className="h-5 w-5 text-emerald-600" />
              </div>
              <h4 className="text-xl font-bold text-emerald-800">Perfect! Din reservasjon</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="bg-emerald-600 text-white text-sm font-semibold px-3 py-1">
                  {frequencyOptions.find(f => f.value === selectedFrequency)?.label}
                </Badge>
                <span className="text-emerald-800 font-bold text-lg">{selectedDays}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {pattern.timeSlots.map(slot => (
                  <Badge key={slot} variant="outline" className="text-emerald-700 border-emerald-300 bg-white font-medium">
                    {slot}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Smart Validation */}
        {!isValid && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 text-amber-800">
              <div className="p-2 bg-amber-100 rounded-lg">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <p className="font-bold text-lg">Nesten ferdig!</p>
                <p className="text-sm opacity-80">
                  {pattern.weekdays.length === 0 && pattern.timeSlots.length === 0 
                    ? "Velg dager og tider" 
                    : pattern.weekdays.length === 0 
                    ? "Velg minst én dag" 
                    : "Velg minst ett tidspunkt"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Smart Action Buttons */}
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
