
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecurrencePattern, SelectedTimeSlot } from '@/utils/recurrenceEngine';

interface RecurrencePatternBuilderProps {
  pattern: RecurrencePattern;
  onPatternChange: (pattern: RecurrencePattern) => void;
  onApply: (pattern: RecurrencePattern) => void;
  onCancel: () => void;
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
}

export function RecurrencePatternBuilder({
  pattern,
  onPatternChange,
  onApply,
  onCancel,
  selectedSlots,
  facilityId
}: RecurrencePatternBuilderProps) {
  const [currentPattern, setCurrentPattern] = useState<RecurrencePattern>(pattern);
  const [frequency, setFrequency] = useState<string>('weekly');
  const [count, setCount] = useState<number>(1);

  const handlePatternUpdate = (updates: Partial<RecurrencePattern>) => {
    const newPattern = { ...currentPattern, ...updates };
    setCurrentPattern(newPattern);
    onPatternChange(newPattern);
  };

  const handleApply = () => {
    onApply(currentPattern);
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Opprett gjentakende booking</h3>
          <p className="text-gray-600 mb-6">
            Konfigurer hvordan denne bookingen skal gjentas over tid.
          </p>
        </div>

        {/* Pattern configuration would go here */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Frekvens</label>
            <select 
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="daily">Daglig</option>
              <option value="weekly">Ukentlig</option>
              <option value="monthly">Månedlig</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Antall gjentakelser</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full p-2 border rounded-md"
              min="1"
              max="52"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Avbryt
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Opprett gjentakende booking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
