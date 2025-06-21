
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, FileText, Package, Star } from 'lucide-react';
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

  const getBookingType = () => {
    if (totalSlots === 1) {
      return 'Timeleie';
    } else if (dateKeys.length > 1) {
      const uniqueDays = new Set(timeSlots.map(slot => format(new Date(slot.date), 'EEEE', { locale: nb })));
      if (uniqueDays.size === 1) {
        return 'Fastlån';
      }
      return 'Timeleie';
    } else {
      return 'Timeleie';
    }
  };

  const bookingType = getBookingType();

  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex-1 space-y-4">
        {/* Facility Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-xl text-gray-900 truncate mb-2">{reservation.facilityName}</h3>
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700 truncate font-medium">{reservation.purpose}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
                {bookingType}
              </Badge>
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                {totalDuration} timer
              </Badge>
              <Badge variant="outline" className="border-gray-200">
                {reservation.organizationType === 'business' ? 'Bedrift' : 
                 reservation.organizationType === 'organization' ? 'Organisasjon' : 'Privat'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {dateKeys.length === 1 ? (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">
                  {format(new Date(dateKeys[0]), 'EEEE d. MMMM yyyy', { locale: nb })}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">
                  {format(new Date(dateKeys[0]), 'dd.MM', { locale: nb })} - {format(new Date(dateKeys[dateKeys.length - 1]), 'dd.MM.yyyy', { locale: nb })}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{totalDuration} timer totalt</span>
            </div>

            {reservation.expectedAttendees && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>{reservation.expectedAttendees} deltakere</span>
              </div>
            )}
          </div>

          {/* Time slots summary */}
          {totalSlots <= 3 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Tidspunkt: </span>
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
            </div>
          )}

          {totalSlots > 3 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Tidspunkt: </span>
                Første: {timeSlots[0].timeSlot} - Siste: {timeSlots[timeSlots.length - 1].timeSlot}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Price Section */}
      <div className="text-right flex-shrink-0 ml-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Pris</span>
          </div>
          <div className="text-3xl font-bold text-green-700">
            {reservation.pricing?.totalPrice || (reservation.pricePerHour * totalDuration)} kr
          </div>
        </div>
      </div>
    </div>
  );
}
