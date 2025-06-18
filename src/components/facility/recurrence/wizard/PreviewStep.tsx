
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

type SupportedFrequency = 'weekly' | 'biweekly' | 'monthly';

interface PreviewStepProps {
  selectedFrequency: SupportedFrequency;
  selectedWeekdays: number[];
  selectedTimeSlots: string[];
}

const frequencyLabels = {
  'weekly': 'Ukentlig',
  'biweekly': 'Hver 2. uke',
  'monthly': 'Månedlig'
};

const weekdayNames = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];

export function PreviewStep({ selectedFrequency, selectedWeekdays, selectedTimeSlots }: PreviewStepProps) {
  const selectedDays = selectedWeekdays.map(day => weekdayNames[day]).join(', ');
  const frequencyLabel = frequencyLabels[selectedFrequency];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Bekreft din reservasjon</h2>
        <p className="text-gray-600 text-lg">Sjekk at alt ser riktig ut før du oppretter reservasjonene</p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-lg mx-auto">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">Frekvens</h3>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-base px-4 py-2">
              {frequencyLabel}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">Dager</h3>
            <p className="text-gray-700 text-base">{selectedDays}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">Tidspunkt</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTimeSlots.map(slot => (
                <Badge key={slot} variant="outline" className="text-gray-700 border-gray-300 text-sm">
                  {slot}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
