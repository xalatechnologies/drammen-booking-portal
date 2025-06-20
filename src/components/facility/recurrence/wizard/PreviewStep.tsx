
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Calendar, Clock, Repeat, MapPin } from 'lucide-react';

type SupportedFrequency = 'weekly' | 'biweekly' | 'monthly';

interface PreviewStepProps {
  selectedFrequency: SupportedFrequency;
  selectedWeekdays: number[];
  selectedTimeSlots: string[];
  startDate?: Date;
  endDate?: Date;
}

const frequencyLabels = {
  'weekly': 'Hver uke',
  'biweekly': 'Annenhver uke',
  'monthly': 'Månedlig'
};

const weekdayNames = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];

export function PreviewStep({ 
  selectedFrequency, 
  selectedWeekdays, 
  selectedTimeSlots,
  startDate,
  endDate 
}: PreviewStepProps) {
  const selectedDays = selectedWeekdays.map(day => weekdayNames[day]).join(', ');
  const frequencyLabel = frequencyLabels[selectedFrequency];

  // Calculate total number of sessions
  const calculateTotalSessions = () => {
    if (!startDate || !endDate) return 0;
    
    const weeksBetween = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
    let multiplier = 1;
    
    if (selectedFrequency === 'biweekly') {
      multiplier = 0.5;
    } else if (selectedFrequency === 'monthly') {
      multiplier = 1/4;
    }
    
    return Math.ceil(weeksBetween * selectedWeekdays.length * selectedTimeSlots.length * multiplier);
  };

  const totalSessions = calculateTotalSessions();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Bekreft din reservasjon</h2>
        <p className="text-gray-600 text-lg">Sjekk at alt ser riktig ut før du oppretter reservasjonene</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Frequency Card */}
        <Card className="border border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Repeat className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Frekvens</h3>
            </div>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-base px-3 py-1">
              {frequencyLabel}
            </Badge>
          </CardContent>
        </Card>

        {/* Days Card */}
        <Card className="border border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Dager</h3>
            </div>
            <p className="text-gray-700 text-base">{selectedDays}</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Slots Card */}
      <Card className="border border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Tidspunkt</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTimeSlots.map(slot => (
              <Badge key={slot} variant="outline" className="text-gray-700 border-gray-300 text-sm px-3 py-1">
                {slot}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Date Range & Summary */}
      {startDate && endDate && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-blue-900 mb-2 text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Periode og sammendrag
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Startdato:</span>
                  <p className="text-blue-700">{startDate.toLocaleDateString('nb-NO')}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Sluttdato:</span>
                  <p className="text-blue-700">{endDate.toLocaleDateString('nb-NO')}</p>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Totalt:</span>
                  <p className="text-blue-700 font-semibold">{totalSessions} reservasjoner</p>
                </div>
              </div>

              <div className="bg-white border border-blue-200 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-blue-900 mb-2">Mønster sammendrag:</h4>
                <p className="text-blue-800 text-sm">
                  {frequencyLabel} på {selectedDays} kl. {selectedTimeSlots.join(', ')} fra{' '}
                  {startDate.toLocaleDateString('nb-NO')} til {endDate.toLocaleDateString('nb-NO')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Warning for large number of bookings */}
      {totalSessions > 20 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <span className="text-lg">⚠️</span>
              <span className="font-medium">
                Du er i ferd med å opprette {totalSessions} reservasjoner. Dette kan ta litt tid.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
