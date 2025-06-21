
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Calendar, Clock, Users, MapPin, CheckCircle } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface ReservationAccordionProps {
  reservations: CartItem[];
  onEditReservation: (reservationId: string) => void;
  onRemoveReservation: (reservationId: string) => void;
}

export function ReservationAccordion({ 
  reservations, 
  onEditReservation, 
  onRemoveReservation 
}: ReservationAccordionProps) {
  const uniqueReservations = reservations.filter((reservation, index, self) => 
    index === self.findIndex(r => r.id === reservation.id)
  );

  const getBookingType = (reservation: CartItem) => {
    const timeSlots = reservation.timeSlots || [{
      date: reservation.date,
      timeSlot: reservation.timeSlot,
      zoneId: reservation.zoneId,
      duration: reservation.duration
    }];
    
    if (timeSlots.length === 1) {
      return 'Enkelt booking';
    }
    
    const dateKeys = [...new Set(timeSlots.map(slot => format(new Date(slot.date), 'yyyy-MM-dd')))];
    if (dateKeys.length > 1) {
      const uniqueDays = new Set(timeSlots.map(slot => format(new Date(slot.date), 'EEEE', { locale: nb })));
      if (uniqueDays.size === 1) {
        return 'Fastlån';
      }
    }
    return 'Flere tidspunkt';
  };

  return (
    <div className="space-y-4">
      {uniqueReservations.map((reservation) => {
        const timeSlots = reservation.timeSlots || [{
          date: reservation.date,
          timeSlot: reservation.timeSlot,
          zoneId: reservation.zoneId,
          duration: reservation.duration
        }];
        
        const totalDuration = timeSlots.reduce((sum, slot) => sum + (slot.duration || 2), 0);
        const bookingType = getBookingType(reservation);

        return (
          <Accordion key={reservation.id} type="single" collapsible className="w-full">
            <AccordionItem value={reservation.id} className="border border-gray-200 rounded-lg bg-white shadow-sm">
              <AccordionTrigger className="px-6 py-4 hover:no-underline text-left">
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{reservation.facilityName}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {bookingType}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {timeSlots.length === 1 
                            ? format(new Date(timeSlots[0].date), 'dd.MM.yyyy', { locale: nb })
                            : `${format(new Date(timeSlots[0].date), 'dd.MM', { locale: nb })} - ${format(new Date(timeSlots[timeSlots.length - 1].date), 'dd.MM.yyyy', { locale: nb })}`
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{totalDuration}t</span>
                      </div>
                      
                      {reservation.expectedAttendees && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{reservation.expectedAttendees}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 truncate">{reservation.purpose}</p>
                  </div>
                  
                  <div className="text-right ml-6">
                    <div className="text-xl font-bold text-green-600 mb-1">
                      {reservation.pricing?.totalPrice || (reservation.pricePerHour * totalDuration)} kr
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {reservation.organizationType === 'business' ? 'Bedrift' : 
                       reservation.organizationType === 'organization' ? 'Organisasjon' : 'Privat'}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditReservation(reservation.id)}
                        className="flex items-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Rediger
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveReservation(reservation.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Fjern
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        console.log('Send this reservation to approval:', reservation.id);
                      }}
                    >
                      Send til godkjenning
                    </Button>
                  </div>

                  {/* Detailed Time Slots */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Valgte tidspunkt:</h4>
                    <div className="grid gap-2">
                      {timeSlots.map((slot, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">
                              {format(new Date(slot.date), 'EEEE dd.MM.yyyy', { locale: nb })}
                            </span>
                            <span className="text-gray-600">{slot.timeSlot}</span>
                            <span className="text-gray-500">({slot.duration || 2}t)</span>
                          </div>
                          <span className="text-gray-600 text-xs">
                            {slot.zoneId === 'whole-facility' ? 'Hele lokalet' : slot.zoneId}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terms and Included Services */}
                  <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Inkludert i prisen
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Tilgang til fasiliteten</li>
                        <li>• Grunnleggende utstyr</li>
                        <li>• Rengjøring etter bruk</li>
                        <li>• Teknisk support</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Vilkår</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Gratis avbestilling (48t)</li>
                        <li>• Møt opp 15 min før</li>
                        <li>• Faktura etter arrangementet</li>
                        <li>• Bekreftelse på e-post</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
}
