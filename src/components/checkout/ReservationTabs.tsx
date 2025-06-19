
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, CreditCard, Info, Mail, MapPin, Phone, User } from 'lucide-react';
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

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Oversikt</TabsTrigger>
        <TabsTrigger value="services">Tjenester</TabsTrigger>
        <TabsTrigger value="rules">Regler</TabsTrigger>
        <TabsTrigger value="facility">Lokale</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Valgte tidspunkt</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{format(new Date(slot.date), 'EEEE d. MMMM', { locale: nb })}</p>
                    <p className="text-sm text-gray-600">{slot.timeSlot}</p>
                    <p className="text-xs text-gray-500">{slot.zoneId === 'whole-facility' ? 'Hele lokalet' : slot.zoneId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{reservation.pricePerHour * (slot.duration || 2)} kr</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {reservation.customerInfo && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Kontaktinformasjon</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{reservation.customerInfo.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{reservation.customerInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{reservation.customerInfo.phone}</span>
              </div>
              {reservation.customerInfo.organization && (
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{reservation.customerInfo.organization}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {reservation.specialRequirements && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Spesielle krav</h4>
            <p className="text-sm bg-gray-50 p-3 rounded">{reservation.specialRequirements}</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="services" className="space-y-4">
        {reservation.additionalServices.length > 0 ? (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Valgte tjenester</h4>
            <div className="space-y-2">
              {reservation.additionalServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{service.serviceName}</p>
                    <p className="text-sm text-gray-600">Antall: {service.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{service.totalPrice} kr</p>
                    <p className="text-xs text-gray-500">{service.pricePerUnit} kr per enhet</p>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center">
              <span className="font-medium">Total tjenester:</span>
              <span className="font-bold">{reservation.pricing.servicesPrice} kr</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Ingen tilleggstjenester valgt</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="rules" className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Viktige regler</h4>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-medium text-blue-900">Avbestillingsregler</p>
              <p className="text-blue-700 mt-1">Gratis avbestilling frem til 48 timer før avtalt tid</p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="font-medium text-yellow-900">Oppmøte</p>
              <p className="text-yellow-700 mt-1">Møt opp 15 minutter før avtalt tid for innsjekking</p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-medium text-green-900">Rengjøring</p>
              <p className="text-green-700 mt-1">Lokalet må ryddes og rengjøres etter bruk</p>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="facility" className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Om lokalet</h4>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{reservation.facilityName}</span>
              </div>
              <p className="text-sm text-gray-600">
                Et moderne og godt utstyrt lokale perfekt for ditt arrangement.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">Fasiliteter</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Projektør og lerret</li>
                  <li>• Lydanlegg</li>
                  <li>• WiFi</li>
                  <li>• Kaffe/te</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Kontakt</h5>
                <div className="space-y-1 text-gray-600">
                  <p>Telefon: +47 123 45 678</p>
                  <p>E-post: booking@facility.no</p>
                  <p>Åpningstider: 08:00 - 22:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
