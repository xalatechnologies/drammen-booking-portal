
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Calendar, Clock, Users } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface ReservationHeaderProps {
  reservation: CartItem;
  bookingType: string;
  totalDuration: number;
  onEditReservation: (reservationId: string) => void;
  onRemoveReservation: (reservationId: string) => void;
  onSendToApproval: (reservationId: string) => void;
}

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

export function ReservationHeader({ 
  reservation, 
  bookingType, 
  totalDuration, 
  onEditReservation, 
  onRemoveReservation, 
  onSendToApproval 
}: ReservationHeaderProps) {
  const timeSlots = reservation.timeSlots || [{
    date: reservation.date,
    timeSlot: reservation.timeSlot,
    zoneId: reservation.zoneId,
    duration: reservation.duration
  }];

  return (
    <>
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

      {/* Summary Content */}
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
                  ? (() => {
                      const dateValue = timeSlots[0].date instanceof Date ? timeSlots[0].date : new Date(timeSlots[0].date);
                      return format(dateValue, 'dd.MM.yyyy', { locale: nb });
                    })()
                  : (() => {
                      const firstDate = timeSlots[0].date instanceof Date ? timeSlots[0].date : new Date(timeSlots[0].date);
                      const lastDate = timeSlots[timeSlots.length - 1].date instanceof Date ? timeSlots[timeSlots.length - 1].date : new Date(timeSlots[timeSlots.length - 1].date);
                      return `${format(firstDate, 'dd.MM', { locale: nb })} - ${format(lastDate, 'dd.MM.yyyy', { locale: nb })}`;
                    })()
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
    </>
  );
}
