
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, FileText, Package } from 'lucide-react';
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
  const totalSlots = timeSlots.length;
  const totalDuration = timeSlots.reduce((sum, slot) => sum + (slot.duration || 2), 0);

  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex-1 space-y-3">
        {/* Facility and Purpose */}
        <div className="flex items-start gap-3">
          <Package className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg text-gray-900 truncate">{reservation.facilityName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate">{reservation.purpose}</span>
            </div>
            <div className="mt-1">
              <Badge variant="secondary" className="text-xs">
                Reservasjonspakke med {totalSlots} tidspunkt
              </Badge>
            </div>
          </div>
        </div>

        {/* Time Information */}
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
            <span>{totalSlots} tidspunkt ({totalDuration}t total)</span>
          </div>

          {reservation.expectedAttendees && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{reservation.expectedAttendees} deltakere</span>
            </div>
          )}
        </div>

        {/* Time slots summary */}
        {totalSlots <= 3 && (
          <div className="text-sm text-gray-600 ml-8">
            {dateKeys.map(dateKey => 
              slotsByDate[dateKey].map((slot, index) => (
                <span key={`${dateKey}-${index}`}>
                  {slot.timeSlot}
                  {slot.zoneId && slot.zoneId !== 'whole-facility' && ` (${slot.zoneId})`}
                  {index < slotsByDate[dateKey].length - 1 || dateKeys.indexOf(dateKey) < dateKeys.length - 1 ? ', ' : ''}
                </span>
              ))
            )}
          </div>
        )}

        {totalSlots > 3 && (
          <div className="text-sm text-gray-600 ml-8">
            Første: {timeSlots[0].timeSlot} - Siste: {timeSlots[timeSlots.length - 1].timeSlot}
          </div>
        )}
      </div>

      {/* Price and Customer Type */}
      <div className="text-right flex-shrink-0 ml-4">
        <div className="text-2xl font-bold text-green-600 mb-2">
          {reservation.pricing?.totalPrice || (reservation.pricePerHour * totalDuration)} kr
        </div>
        <Badge variant="outline" className="text-xs">
          {reservation.organizationType === 'business' ? 'Bedrift' : 
           reservation.organizationType === 'organization' ? 'Organisasjon' : 'Privat'}
        </Badge>
      </div>
    </div>
  );
}
