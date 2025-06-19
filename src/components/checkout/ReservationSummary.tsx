
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, FileText } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface ReservationSummaryProps {
  reservation: CartItem;
}

export function ReservationSummary({ reservation }: ReservationSummaryProps) {
  const timeSlots = reservation.timeSlots || [{
    date: reservation.date,
    timeSlot: reservation.timeSlot,
    zoneId: reservation.zoneId,
    duration: reservation.duration
  }];

  // Group slots by date for better display
  const slotsByDate = timeSlots.reduce((acc, slot) => {
    const dateKey = format(new Date(slot.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, typeof timeSlots>);

  const dateKeys = Object.keys(slotsByDate).sort();

  return (
    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1 space-y-3">
        {/* Facility and Purpose */}
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{reservation.facilityName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{reservation.purpose}</span>
            </div>
          </div>
        </div>

        {/* Compact Time Information */}
        <div className="flex flex-wrap gap-4 text-sm">
          {dateKeys.length === 1 ? (
            // Single date - show inline
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">
                {format(new Date(dateKeys[0]), 'EEEE d. MMMM yyyy', { locale: nb })}
              </span>
            </div>
          ) : (
            // Multiple dates - show range
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">
                {format(new Date(dateKeys[0]), 'dd.MM', { locale: nb })} - {format(new Date(dateKeys[dateKeys.length - 1]), 'dd.MM.yyyy', { locale: nb })}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{timeSlots.length} tidspunkt</span>
          </div>

          {reservation.expectedAttendees && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{reservation.expectedAttendees} deltakere</span>
            </div>
          )}
        </div>

        {/* Time slots summary for single date */}
        {dateKeys.length === 1 && (
          <div className="text-sm text-gray-600 ml-8">
            {slotsByDate[dateKeys[0]].map((slot, index) => (
              <span key={index}>
                {slot.timeSlot}
                {slot.zoneId !== 'whole-facility' && ` (${slot.zoneId})`}
                {index < slotsByDate[dateKeys[0]].length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price and Customer Type */}
      <div className="text-right flex-shrink-0 ml-4">
        <div className="text-2xl font-bold text-green-600 mb-2">
          {reservation.pricing.totalPrice} kr
        </div>
        <Badge variant="outline" className="text-xs">
          {reservation.organizationType === 'business' ? 'Bedrift' : 
           reservation.organizationType === 'organization' ? 'Organisasjon' : 'Privat'}
        </Badge>
      </div>
    </div>
  );
}
