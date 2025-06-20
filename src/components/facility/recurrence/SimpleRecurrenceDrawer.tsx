
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  { id: 1, label: 'Mandag' },
  { id: 2, label: 'Tirsdag' },
  { id: 3, label: 'Onsdag' },
  { id: 4, label: 'Torsdag' },
  { id: 5, label: 'Fredag' },
  { id: 6, label: 'Lørdag' },
  { id: 0, label: 'Søndag' }
];

interface DragState {
  isDragging: boolean;
  startIndex: number | null;
  currentIndex: number | null;
  previewSlots: string[];
}

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
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>(pattern.weekdays || []);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(pattern.timeSlots || []);
  const [startDate, setStartDate] = useState<string>(
    pattern.startDate ? format(pattern.startDate, 'yyyy-MM-dd') : ''
  );
  const [endDate, setEndDate] = useState<string>(
    pattern.endDate ? format(pattern.endDate, 'yyyy-MM-dd') : ''
  );

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    startIndex: null,
    currentIndex: null,
    previewSlots: []
  });

  const handleWeekdayToggle = (weekdayId: number) => {
    const newWeekdays = selectedWeekdays.includes(weekdayId)
      ? selectedWeekdays.filter(d => d !== weekdayId)
      : [...selectedWeekdays, weekdayId];
    setSelectedWeekdays(newWeekdays);
  };

  const startDrag = useCallback((index: number, event: React.MouseEvent) => {
    event.preventDefault();
    console.log('Starting drag at index:', index);
    setDragState({
      isDragging: true,
      startIndex: index,
      currentIndex: index,
      previewSlots: [timeSlots[index]]
    });
  }, []);

  const updateDrag = useCallback((index: number) => {
    if (!dragState.isDragging || dragState.startIndex === null) return;

    console.log('Updating drag to index:', index, 'from start:', dragState.startIndex);

    const startIndex = dragState.startIndex;
    const endIndex = index;
    const minIndex = Math.min(startIndex, endIndex);
    const maxIndex = Math.max(startIndex, endIndex);
    
    const previewSlots = timeSlots.slice(minIndex, maxIndex + 1);
    console.log('Preview slots:', previewSlots);
    
    setDragState(prev => ({
      ...prev,
      currentIndex: index,
      previewSlots
    }));
  }, [dragState.isDragging, dragState.startIndex]);

  const endDrag = useCallback(() => {
    console.log('Ending drag with preview slots:', dragState.previewSlots);
    
    if (dragState.previewSlots.length > 0) {
      // Add all preview slots that aren't already selected
      const newSlots = dragState.previewSlots.filter(slot => !selectedTimeSlots.includes(slot));
      const updatedSlots = [...selectedTimeSlots, ...newSlots];
      
      // Remove duplicates and sort
      const uniqueSlots = [...new Set(updatedSlots)].sort();
      console.log('Updated slots after drag:', uniqueSlots);
      setSelectedTimeSlots(uniqueSlots);
    }
    
    setDragState({
      isDragging: false,
      startIndex: null,
      currentIndex: null,
      previewSlots: []
    });
  }, [dragState.previewSlots, selectedTimeSlots]);

  const cancelDrag = useCallback(() => {
    console.log('Canceling drag');
    setDragState({
      isDragging: false,
      startIndex: null,
      currentIndex: null,
      previewSlots: []
    });
  }, []);

  const handleTimeSlotToggle = (timeSlot: string) => {
    if (dragState.isDragging) return; // Don't toggle during drag
    
    console.log('Toggling time slot:', timeSlot);
    const newTimeSlots = selectedTimeSlots.includes(timeSlot)
      ? selectedTimeSlots.filter(t => t !== timeSlot)
      : [...selectedTimeSlots, timeSlot];
    
    // Remove duplicates and sort
    const uniqueSlots = [...new Set(newTimeSlots)].sort();
    console.log('Updated time slots:', uniqueSlots);
    setSelectedTimeSlots(uniqueSlots);
  };

  const handleMouseDown = (index: number, event: React.MouseEvent) => {
    console.log('Mouse down on index:', index);
    startDrag(index, event);
  };

  const handleMouseEnter = (index: number) => {
    if (dragState.isDragging) {
      console.log('Mouse enter on index:', index);
      updateDrag(index);
    }
  };

  const handleMouseUp = () => {
    if (dragState.isDragging) {
      console.log('Mouse up - ending drag');
      endDrag();
    }
  };

  const handleClick = (slot: string, index: number, event: React.MouseEvent) => {
    event.preventDefault();
    if (!dragState.isDragging) {
      console.log('Clicking slot:', slot);
      handleTimeSlotToggle(slot);
    }
  };

  const isSlotInPreview = (slot: string) => {
    return dragState.previewSlots.includes(slot);
  };

  const getSlotStyle = (slot: string, isSelected: boolean, isInPreview: boolean) => {
    if (isSelected) {
      return 'bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-700';
    }
    
    if (isInPreview) {
      return 'bg-blue-200 hover:bg-blue-300 border-2 border-blue-400 text-blue-800';
    }
    
    return 'bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 cursor-pointer';
  };

  const handleApply = () => {
    const newPattern: RecurrencePattern = {
      type: frequency,
      weekdays: selectedWeekdays,
      timeSlots: selectedTimeSlots,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      interval: 1
    };

    onPatternChange(newPattern);
    onApplyPattern(newPattern);
    onClose();
  };

  const canApply = selectedWeekdays.length > 0 && selectedTimeSlots.length > 0 && startDate && endDate;

  const today = format(new Date(), 'yyyy-MM-dd');

  // Remove duplicates from selected time slots for display
  const uniqueSelectedSlots = [...new Set(selectedTimeSlots)];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Repeat className="h-5 w-5" />
              Gjentakende Reservasjon
            </DialogTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div 
          className="p-6 overflow-y-auto"
          onMouseLeave={cancelDrag}
          onMouseUp={handleMouseUp}
          style={{ userSelect: 'none' }}
        >
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
                          id={`day-${day.id}`}
                          checked={selectedWeekdays.includes(day.id)}
                          onCheckedChange={() => handleWeekdayToggle(day.id)}
                        />
                        <Label htmlFor={`day-${day.id}`} className="text-sm">
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Time Slots */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Tidspunkt
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {timeSlots.map((slot, index) => {
                      const isSelected = uniqueSelectedSlots.includes(slot);
                      const isInPreview = isSlotInPreview(slot);
                      const slotStyle = getSlotStyle(slot, isSelected, isInPreview);
                      
                      return (
                        <button
                          key={slot}
                          className={`
                            h-10 rounded-lg transition-all duration-200 text-xs font-medium select-none
                            transform hover:scale-105 ${slotStyle}
                          `}
                          onMouseDown={(e) => handleMouseDown(index, e)}
                          onMouseEnter={() => handleMouseEnter(index)}
                          onClick={(e) => handleClick(slot, index, e)}
                          style={{ userSelect: 'none' }}
                        >
                          <div className="flex items-center justify-center h-full">
                            <span className="text-xs font-medium">
                              {slot}
                            </span>
                            {isSelected && (
                              <span className="text-xs ml-1">✓</span>
                            )}
                            {isInPreview && !isSelected && (
                              <span className="text-xs ml-1">◯</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {uniqueSelectedSlots.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <strong>{uniqueSelectedSlots.length} tidspunkt valgt</strong>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mt-3">
                    <p className="text-xs text-gray-600">
                      <strong>Tips:</strong> Klikk på en time for å velge/fravelge den, eller klikk og dra for å velge flere timer på en gang.
                    </p>
                    {dragState.isDragging && (
                      <p className="text-xs text-blue-600 mt-1">
                        <strong>Velger:</strong> {dragState.previewSlots.length} tidspunkt
                      </p>
                    )}
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
                  {selectedWeekdays.map(dayId => weekdays.find(wd => wd.id === dayId)?.label).join(', ')}{' '}
                  kl. {uniqueSelectedSlots.join(', ')}
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
      </DialogContent>
    </Dialog>
  );
}
