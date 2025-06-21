
import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface TimeSlotsListProps {
  reservation: CartItem;
}

export function TimeSlotsList({ reservation }: TimeSlotsListProps) {
  const timeSlots = reservation.timeSlots || [{
    date: reservation.date,
    timeSlot: reservation.timeSlot,
    zoneId: reservation.zoneId,
    duration: reservation.duration
  }];

  const generateIndividualTimeSlots = () => {
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
        
        const dateValue = slot.date instanceof Date ? slot.date : new Date(slot.date);
        const displayText = `${format(dateValue, 'EEEE dd.MM.yyyy', { locale: nb })} ${hourSlot}`;
        
        individualSlots.push({
          date: typeof slot.date === 'string' ? slot.date : slot.date.toISOString(),
          timeSlot: hourSlot,
          zoneId: slot.zoneId,
          displayText
        });
      }
    });

    return individualSlots;
  };

  const individualTimeSlots = generateIndividualTimeSlots();

  return (
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
  );
}
