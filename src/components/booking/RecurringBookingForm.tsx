import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Repeat, AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WeekdaySelector } from '../facility/recurrence/WeekdaySelector';
import { TimeSlotSelector } from '../facility/recurrence/TimeSlotSelector';
import { PatternPreview } from '../facility/recurrence/PatternPreview';
import { ValidationMessage } from '../facility/recurrence/ValidationMessage';
import { RecurrencePattern } from '@/utils/recurrenceEngine';
import { DateRange } from 'react-day-picker';
import DateRangePicker from '../search/DateRangePicker';

interface RecurringBookingFormProps {
  pattern: RecurrencePattern;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onApply: () => void;
  onCancel: () => void;
}

export function RecurringBookingForm({
  pattern,
  onPatternChange,
  onApply,
  onCancel
}: RecurringBookingFormProps) {
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>(
    pattern.type === 'weekly' || pattern.type === 'biweekly' || pattern.type === 'monthly' 
      ? pattern.type 
      : 'weekly'
  );
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    pattern.endDate 
      ? { from: new Date(), to: pattern.endDate } 
      : { from: new Date(), to: undefined }
  );

  const handleFrequencyChange = (value: string) => {
    const newFrequency = value as 'weekly' | 'biweekly' | 'monthly';
    setFrequency(newFrequency);
    onPatternChange({
      ...pattern,
      type: newFrequency
    });
  };

  const handleWeekdayToggle = (day: number) => {
    const currentWeekdays = pattern.weekdays || [];
    const newWeekdays = currentWeekdays.includes(day)
      ? currentWeekdays.filter(d => d !== day)
      : [...currentWeekdays, day];
    
    onPatternChange({
      ...pattern,
      weekdays: newWeekdays
    });
  };

  const handleTimeSlotToggle = (slot: string) => {
    const currentTimeSlots = pattern.timeSlots || [];
    const newTimeSlots = currentTimeSlots.includes(slot)
      ? currentTimeSlots.filter(t => t !== slot)
      : [...currentTimeSlots, slot];
    
    onPatternChange({
      ...pattern,
      timeSlots: newTimeSlots
    });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.to) {
      onPatternChange({
        ...pattern,
        endDate: range.to
      });
    }
  };

  const isValid = pattern.weekdays.length > 0 && pattern.timeSlots.length > 0 && dateRange?.to;

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Repeat className="h-6 w-6 text-blue-600" />
          Opprett gjentakende reservasjon
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Velg hvordan og når du vil at reservasjonen skal gjentas. Du kan velge frekvens, dager, tidspunkt og hvor lenge mønsteret skal vare.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Frequency Selection */}
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Hvor ofte?</h3>
              </div>
              
              <RadioGroup 
                value={frequency} 
                onValueChange={handleFrequencyChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                  <RadioGroupItem value="weekly" id="weekly" className="border-gray-400 text-blue-600" />
                  <Label htmlFor="weekly" className="flex-1 cursor-pointer">
                    <div className="font-medium text-lg">Ukentlig</div>
                    <div className="text-sm text-gray-600">Samme tid hver uke</div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                  <RadioGroupItem value="biweekly" id="biweekly" className="border-gray-400 text-blue-600" />
                  <Label htmlFor="biweekly" className="flex-1 cursor-pointer">
                    <div className="font-medium text-lg">Annenhver uke</div>
                    <div className="text-sm text-gray-600">Samme tid hver andre uke</div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                  <RadioGroupItem value="monthly" id="monthly" className="border-gray-400 text-blue-600" />
                  <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                    <div className="font-medium text-lg">Månedlig</div>
                    <div className="text-sm text-gray-600">Samme dag hver måned</div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Date Range Selection */}
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Tidsperiode</h3>
              </div>
              
              <div className="space-y-4">
                <Label className="text-base font-medium text-gray-700">Velg start- og sluttdato</Label>
                <DateRangePicker 
                  dateRange={dateRange}
                  setDateRange={handleDateRangeChange}
                />
                
                {!dateRange?.to && (
                  <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription>
                      Du må velge en sluttdato for gjentakende reservasjoner
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Weekday Selection */}
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <WeekdaySelector 
                selectedWeekdays={pattern.weekdays} 
                onWeekdayToggle={handleWeekdayToggle} 
              />
            </CardContent>
          </Card>

          {/* Time Slot Selection */}
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <TimeSlotSelector 
                selectedTimeSlots={pattern.timeSlots} 
                onTimeSlotToggle={handleTimeSlotToggle} 
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview and Validation */}
      <div className="space-y-6">
        {pattern.weekdays.length > 0 && pattern.timeSlots.length > 0 ? (
          <PatternPreview 
            selectedFrequency={frequency}
            selectedWeekdays={pattern.weekdays}
            selectedTimeSlots={pattern.timeSlots}
          />
        ) : (
          <ValidationMessage 
            selectedWeekdays={pattern.weekdays}
            selectedTimeSlots={pattern.timeSlots}
          />
        )}

        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <p className="font-medium">Viktig informasjon om gjentakende reservasjoner:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
              <li>Alle reservasjoner er underlagt tilgjengelighet</li>
              <li>Hvis et tidspunkt allerede er reservert, vil det hoppes over</li>
              <li>Maksimal varighet for gjentakende reservasjoner er 6 måneder</li>
              <li>Avbestillingsregler gjelder for hver enkelt reservasjon</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="flex justify-end gap-4 pt-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="px-6 py-3 text-base rounded-xl"
          >
            Avbryt
          </Button>
          <Button 
            onClick={onApply}
            disabled={!isValid}
            className="px-6 py-3 text-base bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            Opprett reservasjoner
          </Button>
        </div>
      </div>
    </div>
  );
}