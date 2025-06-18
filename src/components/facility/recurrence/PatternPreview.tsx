
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

type SupportedFrequency = 'weekly' | 'biweekly' | 'monthly';

interface PatternPreviewProps {
  selectedFrequency: SupportedFrequency;
  selectedWeekdays: number[];
  selectedTimeSlots: string[];
}

const frequencyOptions = [
  { value: 'weekly' as const, label: 'Ukentlig' },
  { value: 'biweekly' as const, label: 'Hver 2. uke' },
  { value: 'monthly' as const, label: 'Månedlig' }
];

const weekdayNames = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];

export function PatternPreview({ selectedFrequency, selectedWeekdays, selectedTimeSlots }: PatternPreviewProps) {
  const selectedDays = selectedWeekdays.map(day => weekdayNames[day]).join(', ');
  const frequencyLabel = frequencyOptions.find(f => f.value === selectedFrequency)?.label;

  return (
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
            {frequencyLabel}
          </Badge>
          <span className="text-emerald-800 font-bold text-lg">{selectedDays}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedTimeSlots.map(slot => (
            <Badge key={slot} variant="outline" className="text-emerald-700 border-emerald-300 bg-white font-medium">
              {slot}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
