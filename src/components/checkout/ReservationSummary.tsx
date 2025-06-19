
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface ReservationSummaryProps {
  reservation: CartItem;
}

export function ReservationSummary({ reservation }: ReservationSummaryProps) {
  const timeSlotCount = reservation.timeSlots?.length || 1;
  const dateRange = reservation.timeSlots?.length > 1 ? 
    `${format(new Date(reservation.timeSlots[0].date), 'dd.MM', { locale: nb })} - ${format(new Date(reservation.timeSlots[reservation.timeSlots.length - 1].date), 'dd.MM', { locale: nb })}` :
    format(new Date(reservation.date), 'dd.MM.yyyy', { locale: nb });

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-semibold text-lg">{reservation.facilityName}</h3>
            <p className="text-sm text-gray-600">{reservation.purpose}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{dateRange}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{timeSlotCount} tidspunkt</span>
          </div>
          {reservation.expectedAttendees && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{reservation.expectedAttendees} deltakere</span>
            </div>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-green-600">{reservation.pricing.totalPrice} kr</p>
        <Badge variant="outline" className="mt-1">
          {reservation.organizationType === 'business' ? 'Bedrift' : 
           reservation.organizationType === 'organization' ? 'Organisasjon' : 'Privat'}
        </Badge>
      </div>
    </div>
  );
}
