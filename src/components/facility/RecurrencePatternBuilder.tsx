
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Repeat, Settings } from 'lucide-react';
import { RecurrencePattern } from '@/utils/recurrenceEngine';

interface RecurrencePatternBuilderProps {
  pattern: RecurrencePattern;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onClose: () => void;
}

const weekdayNames = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
const timeSlots = ['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00'];

export function RecurrencePatternBuilder({ pattern, onPatternChange, onClose }: RecurrencePatternBuilderProps) {
  const [activeTab, setActiveTab] = useState(pattern.type);

  const updatePattern = (updates: Partial<RecurrencePattern>) => {
    onPatternChange({ ...pattern, ...updates });
  };

  const toggleWeekday = (day: number) => {
    const newWeekdays = pattern.weekdays.includes(day)
      ? pattern.weekdays.filter(d => d !== day)
      : [...pattern.weekdays, day];
    updatePattern({ weekdays: newWeekdays });
  };

  const toggleTimeSlot = (timeSlot: string) => {
    const newTimeSlots = pattern.timeSlots.includes(timeSlot)
      ? pattern.timeSlots.filter(t => t !== timeSlot)
      : [...pattern.timeSlots, timeSlot];
    updatePattern({ timeSlots: newTimeSlots });
  };

  const handleTabChange = (value: string) => {
    // Type guard to ensure the value is a valid pattern type
    if (value === 'single' || value === 'weekly' || value === 'biweekly' || value === 'monthly' || value === 'custom') {
      setActiveTab(value);
      updatePattern({ type: value });
    }
  };

  return (
    <Card className="w-full max-w-2xl font-inter">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Repeat className="h-6 w-6" />
          Gjentakende booking
        </CardTitle>
        <p className="text-base text-gray-600">
          Velg når og hvor ofte du vil reservere
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Pattern Type Selection */}
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4 text-base">
            <TabsTrigger value="single" className="text-base">Enkelt</TabsTrigger>
            <TabsTrigger value="weekly" className="text-base">Ukentlig</TabsTrigger>
            <TabsTrigger value="biweekly" className="text-base">Annenhver uke</TabsTrigger>
            <TabsTrigger value="monthly" className="text-base">Månedlig</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-4">
            <p className="text-base text-gray-600">Velg tidspunkt for enkeltstående booking</p>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <div>
              <h4 className="text-base font-medium mb-3">Velg ukedager:</h4>
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
            </div>
          </TabsContent>

          <TabsContent value="biweekly" className="space-y-4">
            <div>
              <h4 className="text-base font-medium mb-3">Velg ukedager (annenhver uke):</h4>
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
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            <div>
              <h4 className="text-base font-medium mb-3">Velg mønster:</h4>
              <div className="grid grid-cols-2 gap-2">
                {['first', 'second', 'third', 'fourth', 'last'].map((patternType) => (
                  <Button
                    key={patternType}
                    variant={pattern.monthlyPattern === patternType ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updatePattern({ monthlyPattern: patternType as any })}
                    className="text-base"
                  >
                    {patternType === 'first' && 'Første'}
                    {patternType === 'second' && 'Andre'}
                    {patternType === 'third' && 'Tredje'}
                    {patternType === 'fourth' && 'Fjerde'}
                    {patternType === 'last' && 'Siste'}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                {weekdayNames.slice(1, 6).map((day, index) => (
                  <Button
                    key={index + 1}
                    variant={pattern.monthlyWeekday === index + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updatePattern({ monthlyWeekday: index + 1 })}
                    className="w-14 h-14 p-0 text-base"
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Time Slots Selection */}
        <div>
          <h4 className="text-base font-medium mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Velg tidspunkt:
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <Button
                key={slot}
                variant={pattern.timeSlots.includes(slot) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleTimeSlot(slot)}
                className="justify-start text-base"
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>

        {/* Pattern Summary */}
        {pattern.weekdays.length > 0 && pattern.timeSlots.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="text-base font-medium mb-2">Valgt mønster:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-base">
                {pattern.weekdays.map(day => weekdayNames[day]).join(', ')}
              </Badge>
              <Badge variant="outline" className="text-base">
                {pattern.timeSlots.join(', ')}
              </Badge>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="text-base px-6 py-3">
            Avbryt
          </Button>
          <Button 
            onClick={onClose}
            disabled={pattern.weekdays.length === 0 || pattern.timeSlots.length === 0}
            className="text-base px-6 py-3"
          >
            Bruk mønster
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
