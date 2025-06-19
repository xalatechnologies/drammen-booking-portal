
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
      <Card className="mb-6 border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-7 w-7 text-orange-600" />
            <h3 className="text-xl font-bold text-orange-900">
              Strøtimer - {format(date, 'EEEE dd.MM', { locale: nb })}
            </h3>
            <Badge variant="secondary" className="bg-orange-200 text-orange-800 text-sm px-3 py-1">
              Drop-in
            </Badge>
          </div>
          
          <p className="text-base text-orange-700 mb-6 font-medium">
            Ledige tider som kan bookes umiddelbart uten søknad. Førstemann til mølla!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dayStrøtimer.map((strøtime) => (
              <div 
                key={strøtime.id}
                className="border border-orange-300 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                    <Clock className="h-5 w-5" />
                    {strøtime.startTime} - {strøtime.endTime}
                  </div>
                  <Badge variant="outline" className="text-sm px-2 py-1">
                    {strøtime.duration} min
                  </Badge>
                </div>
                
                <div className="text-base text-gray-600 mb-3 font-medium">
                  {strøtime.zoneName}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-orange-600">
                    {strøtime.pricePerSlot} kr
                  </span>
                  <Button
                    size="default"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2"
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
