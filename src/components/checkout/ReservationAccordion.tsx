
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Calendar, Clock, Users, CheckCircle, User, FileText, Info, MapPin, Shield } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface ReservationAccordionProps {
  reservations: CartItem[];
  onEditReservation: (reservationId: string) => void;
  onRemoveReservation: (reservationId: string) => void;
  onSendToApproval: (reservationId: string) => void;
}

export function ReservationAccordion({ 
  reservations, 
  onEditReservation, 
  onRemoveReservation,
  onSendToApproval
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

  const getActorTypeLabel = (actorType: string) => {
    switch (actorType) {
      case 'private': return 'Privatperson';
      case 'business': return 'Bedrift';
      case 'organization': return 'Organisasjon';
      case 'lag-foreninger': return 'Lag/Foreninger';
      case 'paraply': return 'Paraplyorganisasjon';
      default: return 'Ukjent';
    }
  };

  const getEventTypeLabel = (eventType?: string) => {
    switch (eventType) {
      case 'sport': return 'Sport';
      case 'cultural': return 'Kultur';
      case 'meeting': return 'Møte';
      case 'training': return 'Trening';
      case 'competition': return 'Konkurranse';
      case 'other': return 'Annet';
      default: return 'Ikke spesifisert';
    }
  };

  const generateIndividualTimeSlots = (reservation: CartItem) => {
    const timeSlots = reservation.timeSlots || [{
      date: reservation.date,
      timeSlot: reservation.timeSlot,
      zoneId: reservation.zoneId,
      duration: reservation.duration
    }];

    const individualSlots: Array<{
      date: string;
      timeSlot: string;
      zoneId: string;
      displayText: string;
    }> = [];

    timeSlots.forEach(slot => {
      const [startTime] = slot.timeSlot.split('-');
      const startHour = parseInt(startTime.split(':')[0]);
      const duration = slot.duration || 2;
      
      // Generate individual hour slots
      for (let i = 0; i < duration; i++) {
        const currentHour = startHour + i;
        const nextHour = currentHour + 1;
        const hourSlot = `${currentHour.toString().padStart(2, '0')}:00-${nextHour.toString().padStart(2, '0')}:00`;
        
        const displayText = `${format(new Date(slot.date), 'EEEE dd.MM.yyyy', { locale: nb })} ${hourSlot}`;
        
        individualSlots.push({
          date: slot.date,
          timeSlot: hourSlot,
          zoneId: slot.zoneId,
          displayText
        });
      }
    });

    return individualSlots;
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
        
        const totalDuration = timeSlots.reduce((sum, slot) => {
          return sum + (slot.duration || 2);
        }, 0);
        
        const bookingType = getBookingType(reservation);
        const individualTimeSlots = generateIndividualTimeSlots(reservation);

        return (
          <div key={reservation.id} className="border border-gray-200 rounded-lg bg-white shadow-sm">
            {/* Action Buttons at Top */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
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
                onClick={() => onSendToApproval(reservation.id)}
              >
                Send til godkjenning
              </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={reservation.id} className="border-none">
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
                        {getActorTypeLabel(reservation.organizationType)}
                      </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-8 pt-4 border-t border-gray-100">
                    {/* Booking Details */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-600" />
                        Booking detaljer
                      </h4>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-gray-700 block">Formål</span>
                              <p className="text-gray-600 mt-1">{reservation.purpose}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-gray-700 block">Aktør type</span>
                              <span className="text-gray-600">{getActorTypeLabel(reservation.organizationType)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {reservation.eventType && (
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />
                              <div>
                                <span className="font-medium text-gray-700 block">Arrangementstype</span>
                                <span className="text-gray-600">{getEventTypeLabel(reservation.eventType)}</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-gray-700 block">Forventet deltakere</span>
                              <span className="text-gray-600">{reservation.expectedAttendees}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {reservation.specialRequirements && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-gray-700 block">Spesielle krav</span>
                              <p className="text-gray-600 mt-1">{reservation.specialRequirements}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Detailed Time Slots */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        Tidspunkt(er)
                      </h4>
                      <div className="space-y-2">
                        {individualTimeSlots.map((slot, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <span className="font-medium text-gray-900">{slot.displayText}</span>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600 text-sm">
                                {slot.zoneId === 'whole-facility' ? 'Hele lokalet' : slot.zoneId}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Services and Terms */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="bg-green-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Inkludert i prisen
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3 text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>Tilgang til fasiliteten</span>
                          </li>
                          <li className="flex items-center gap-3 text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>Grunnleggende utstyr</span>
                          </li>
                          <li className="flex items-center gap-3 text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>Rengjøring etter bruk</span>
                          </li>
                          <li className="flex items-center gap-3 text-gray-700">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>Teknisk support</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-amber-50 rounded-lg p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-amber-600" />
                          Vilkår og betingelser
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3 text-gray-700">
                            <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                            <span>Gratis avbestilling (48t)</span>
                          </li>
                          <li className="flex items-center gap-3 text-gray-700">
                            <Users className="h-4 w-4 text-amber-500 flex-shrink-0" />
                            <span>Møt opp 15 min før</span>
                          </li>
                          <li className="flex items-center gap-3 text-gray-700">
                            <FileText className="h-4 w-4 text-amber-500 flex-shrink-0" />
                            <span>Faktura etter arrangementet</span>
                          </li>
                          <li className="flex items-center gap-3 text-gray-700">
                            <CheckCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                            <span>Bekreftelse på e-post</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        );
      })}
    </div>
  );
}
