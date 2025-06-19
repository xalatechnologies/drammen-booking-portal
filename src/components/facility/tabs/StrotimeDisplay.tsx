
import React, { useState } from 'react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { Clock, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StrøtimeSlot } from '@/types/booking/strøtimer';
import { StrotimeBookingModal } from './StrotimeBookingModal';

interface StrotimeDisplayProps {
  strøtimer: StrøtimeSlot[];
  date: Date;
  onBookingComplete?: (booking: any) => void;
}

export function StrotimeDisplay({ strøtimer, date, onBookingComplete }: StrotimeDisplayProps) {
  const [selectedStrøtime, setSelectedStrøtime] = useState<StrøtimeSlot | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const dayStrøtimer = strøtimer.filter(slot => 
    slot.date.toDateString() === date.toDateString() && slot.isAvailable
  );

  if (dayStrøtimer.length === 0) {
    return null;
  }

  const handleBookStrøtime = (strøtime: StrøtimeSlot) => {
    setSelectedStrøtime(strøtime);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = (booking: any) => {
    setShowBookingModal(false);
    setSelectedStrøtime(null);
    onBookingComplete?.(booking);
  };

  return (
    <>
      <Card className="mb-4 border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-orange-900">
              Strøtimer - {format(date, 'EEEE dd.MM', { locale: nb })}
            </h3>
            <Badge variant="secondary" className="bg-orange-200 text-orange-800">
              Drop-in
            </Badge>
          </div>
          
          <p className="text-sm text-orange-700 mb-4">
            Ledige tider som kan bookes umiddelbart uten søknad. Førstemann til mølla!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dayStrøtimer.map((strøtime) => (
              <div 
                key={strøtime.id}
                className="border border-orange-300 rounded-lg p-3 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                    <Clock className="h-4 w-4" />
                    {strøtime.startTime} - {strøtime.endTime}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {strøtime.duration} min
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  {strøtime.zoneName}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-orange-600">
                    {strøtime.pricePerSlot} kr
                  </span>
                  <Button
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => handleBookStrøtime(strøtime)}
                  >
                    Book nå
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedStrøtime && (
        <StrotimeBookingModal
          isOpen={showBookingModal}
          strøtime={selectedStrøtime}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
}
