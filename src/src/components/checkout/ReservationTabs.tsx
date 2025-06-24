
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, FileText, Package2 } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface ReservationTabsProps {
  reservation: CartItem;
}

export function ReservationTabs({ reservation }: ReservationTabsProps) {
  const timeSlots = reservation.timeSlots || [{
    date: reservation.date,
    timeSlot: reservation.timeSlot,
    zoneId: reservation.zoneId,
    duration: reservation.duration
  }];

  // Group slots by date
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
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="details" className="flex items-center gap-2">
          <Package2 className="h-4 w-4" />
          Pakkedetaljer
        </TabsTrigger>
        <TabsTrigger value="schedule" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Tidsplan
        </TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Formål:</span>
            <p className="mt-1">{reservation.purpose}</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Forventet deltakere:</span>
            <p className="mt-1">{reservation.expectedAttendees || 1} personer</p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Organisasjonstype:</span>
            <p className="mt-1">
              {reservation.organizationType === 'business' ? 'Bedrift' : 
               reservation.organizationType === 'organization' ? 'Organisasjon' : 'Privat'}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-700">Totalt antall timer:</span>
            <p className="mt-1">{timeSlots.reduce((sum, slot) => sum + (slot.duration || 2), 0)} timer</p>
          </div>
        </div>

        {reservation.additionalServices && reservation.additionalServices.length > 0 && (
          <div>
            <span className="font-medium text-gray-700">Tilleggstjenester:</span>
            <div className="mt-2 space-y-1">
              {reservation.additionalServices.map((service, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{service.serviceName} x{service.quantity}</span>
                  <span>{service.totalPrice} kr</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="schedule" className="mt-4 space-y-4">
        <div className="space-y-3">
          {dateKeys.map(dateKey => (
            <div key={dateKey} className="border rounded-lg p-3 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-2">
                {format(new Date(dateKey), 'EEEE d. MMMM yyyy', { locale: nb })}
              </h4>
              <div className="space-y-2">
                {slotsByDate[dateKey].map((slot, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{slot.timeSlot}</span>
                      {slot.zoneId && slot.zoneId !== 'whole-facility' && (
                        <Badge variant="outline" className="text-xs">
                          {slot.zoneId}
                        </Badge>
                      )}
                    </div>
                    <span className="text-gray-600">{slot.duration || 2}t</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
