
import React from 'react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';

interface SelectedSlotsDisplayProps {
  selectedSlots: SelectedTimeSlot[];
}

export function SelectedSlotsDisplay({ selectedSlots }: SelectedSlotsDisplayProps) {
  if (selectedSlots.length === 0) return null;

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-blue-800 font-inter">Valgte tidspunkt ({selectedSlots.length})</h4>
          <Badge className="bg-blue-600 font-inter">{selectedSlots.length} timer</Badge>
        </div>
        <div className="max-h-24 overflow-auto space-y-1">
          {selectedSlots.slice(0, 3).map((slot, index) => (
            <div key={index} className="text-sm text-blue-700 font-inter">
              {format(slot.date, 'EEE dd.MM', { locale: nb })} - {slot.timeSlot}
            </div>
          ))}
          {selectedSlots.length > 3 && (
            <div className="text-xs text-blue-600 font-inter">+ {selectedSlots.length - 3} flere</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
