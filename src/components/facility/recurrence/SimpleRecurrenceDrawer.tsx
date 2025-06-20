
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer';
import { Calendar, Clock, Repeat, X } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { RecurrencePattern } from '@/utils/recurrenceEngine';

interface SimpleRecurrenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pattern: RecurrencePattern;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onApplyPattern: (pattern: RecurrencePattern) => void;
}

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
  '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

const weekdays = [
  { id: 'monday', label: 'Mandag' },
  { id: 'tuesday', label: 'Tirsdag' },
  { id: 'wednesday', label: 'Onsdag' },
  { id: 'thursday', label: 'Torsdag' },
  { id: 'friday', label: 'Fredag' },
  { id: 'saturday', label: 'Lørdag' },
  { id: 'sunday', label: 'Søndag' }
];

export function SimpleRecurrenceDrawer({
  isOpen,
  onClose,
  pattern,
  onPatternChange,
  onApplyPattern
}: SimpleRecurrenceDrawerProps) {
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>(
    pattern.type === 'weekly' || pattern.type === 'biweekly' || pattern.type === 'monthly' 
      ? pattern.type 
      : 'weekly'
  );
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>(pattern.weekdays || []);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(pattern.timeSlots || []);
  const [startDate, setStartDate] = useState<string>(
    pattern.startDate ? format(pattern.startDate, 'yyyy-MM-dd') : ''
  );
  const [endDate, setEndDate] = useState<string>(
    pattern.endDate ? format(pattern.endDate, 'yyyy-MM-dd') : ''
  );

  const handleWeekdayToggle = (weekday: string) => {
    const newWeekdays = selectedWeekdays.includes(weekday)
      ? selectedWeekdays.filter(d => d !== weekday)
      : [...selectedWeekdays, weekday];
    setSelectedWeekdays(newWeekdays);
  };

  const handleTimeSlotToggle = (timeSlot: string) => {
    const newTimeSlots = selectedTimeSlots.includes(timeSlot)
      ? selectedTimeSlots.filter(t => t !== timeSlot)
      : [...selectedTimeSlots, timeSlot];
    setSelectedTimeSlots(newTimeSlots);
  };

  const handleApply = () => {
    const newPattern: RecurrencePattern = {
      type: frequency,
      weekdays: selectedWeekdays,
      timeSlots: selectedTimeSlots,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined
    };

    onPatternChange(newPattern);
    onApplyPattern(newPattern);
    onClose();
  };

  const canApply = selectedWeekdays.length > 0 && selectedTimeSlots.length > 0 && startDate && endDate;

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-4xl mx-auto max-h-[90vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              Gjentakende Reservasjon
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Frequency Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Repeat className="h-5 w-5" />
                    Frekvens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={frequency} onValueChange={(value: 'weekly' | 'biweekly' | 'monthly') => setFrequency(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Hver uke</SelectItem>
                      <SelectItem value="biweekly">Annenhver uke</SelectItem>
                      <SelectItem value="monthly">Månedlig</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Date Range */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Periode
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="start-date">Startdato</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={today}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">Sluttdato</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || today}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Weekdays */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Velg dager</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {weekdays.map((day) => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={day.id}
                          checked={selectedWeekdays.includes(day.id)}
                          onCheckedChange={() => handleWeekdayToggle(day.id)}
                        />
                        <Label htmlFor={day.id} className="text-sm">
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Time Slots */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Tidspunkt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedTimeSlots.includes(slot) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTimeSlotToggle(slot)}
                        className="text-xs"
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Summary */}
          {canApply && (
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-blue-900 mb-2">Sammendrag</h4>
                <p className="text-blue-800 text-sm">
                  {frequency === 'weekly' ? 'Hver uke' : frequency === 'biweekly' ? 'Annenhver uke' : 'Månedlig'} på{' '}
                  {selectedWeekdays.map(day => weekdays.find(wd => wd.id === day)?.label).join(', ')}{' '}
                  kl. {selectedTimeSlots.join(', ')}
                </p>
                <p className="text-blue-700 text-sm mt-1">
                  Fra {startDate} til {endDate}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="border-t p-4 flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Avbryt
          </Button>
          <Button 
            onClick={handleApply}
            disabled={!canApply}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Opprett Reservasjoner
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
