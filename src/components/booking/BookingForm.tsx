
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Users, X, ShoppingCart, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from './types';

interface BookingFormProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones: Zone[];
  onAddToCart?: (bookingData: any) => void;
  onCompleteBooking?: (bookingData: any) => void;
  onSlotsCleared?: () => void;
  onRemoveSlot?: (zoneId: string, date: Date, timeSlot: string) => void;
  onRecurringBooking?: () => void;
}

export function BookingForm({
  selectedSlots,
  facilityId,
  facilityName,
  zones,
  onAddToCart,
  onCompleteBooking,
  onSlotsCleared,
  onRemoveSlot,
  onRecurringBooking
}: BookingFormProps) {
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  const getZoneName = (zoneId: string) => {
    return zones.find(z => z.id === zoneId)?.name || zoneId;
  };

  const groupedSlots = selectedSlots.reduce((acc, slot) => {
    const dateKey = format(slot.date, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, SelectedTimeSlot[]>);

  const handleProceedToBooking = () => {
    setShowBookingDetails(true);
  };

  return (
    <div className="space-y-4">
      {/* Recurring Booking Button */}
      {onRecurringBooking && (
        <Card>
          <CardContent className="p-4">
            <Button
              onClick={onRecurringBooking}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Opprett gjentakende reservasjon
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Selected Slots */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Valgte tidspunkt
            {selectedSlots.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {selectedSlots.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedSlots.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Ingen tidspunkt valgt</p>
              <p className="text-sm mt-1">Klikk på kalenderen for å velge tidspunkt</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Valgte tidspunkt:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSlotsCleared}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Fjern alle
                </Button>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {Object.entries(groupedSlots).map(([dateKey, daySlots]) => (
                  <div key={dateKey} className="space-y-1">
                    <div className="font-medium text-gray-700">
                      {format(new Date(dateKey), 'EEEE dd. MMMM', { locale: nb })}
                    </div>
                    {daySlots.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                        <div className="flex-1">
                          <div className="font-medium">{slot.timeSlot}</div>
                          <div className="text-sm text-gray-600">{getZoneName(slot.zoneId)}</div>
                        </div>
                        {onRemoveSlot && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveSlot(slot.zoneId, slot.date, slot.timeSlot)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleProceedToBooking}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  Book {selectedSlots.length} tidspunkt
                </Button>
                
                {onAddToCart && (
                  <Button
                    onClick={() => onAddToCart({ selectedSlots, facilityId, facilityName })}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Legg til i handlekurv
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Form - Show when proceeding to booking */}
      {showBookingDetails && selectedSlots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Booking detaljer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Formål</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Beskriv formålet med bookingen"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Antall deltakere</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  placeholder="1"
                  min="1"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowBookingDetails(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Tilbake
                </Button>
                <Button
                  onClick={() => onCompleteBooking && onCompleteBooking({ selectedSlots, facilityId, facilityName })}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Fullfør booking
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
