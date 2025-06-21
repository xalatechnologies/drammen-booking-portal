
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Calendar, Clock, Users, FileText, CheckCircle, Shield } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { ReservationSummary } from './ReservationSummary';
import { ReservationTabs } from './ReservationTabs';

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

  return (
    <div className="space-y-3">
      {uniqueReservations.map((reservation, index) => (
        <Accordion key={reservation.id} type="single" collapsible>
          <AccordionItem 
            value={reservation.id} 
            className="bg-white/80 backdrop-blur-sm border-0 rounded-xl shadow-md overflow-hidden"
          >
            <AccordionTrigger className="p-4 hover:no-underline group [&[data-state=open]>div]:mb-1">
              <div className="w-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {index + 1}
                  </div>
                  <div className="text-left">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      Reservasjon #{index + 1}
                    </div>
                  </div>
                </div>
                <ReservationSummary reservation={reservation} />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-3 border-t border-gray-100">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditReservation(reservation.id)}
                    className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                  >
                    <Edit3 className="h-3 w-3" />
                    Rediger
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveReservation(reservation.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                  >
                    <Trash2 className="h-3 w-3" />
                    Fjern
                  </Button>
                </div>
                
                <ReservationTabs reservation={reservation} />

                {/* Included & Terms - Compact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Inkludert</span>
                    </div>
                    <div className="space-y-1 text-xs text-green-800">
                      <div>• Tilgang til fasiliteten</div>
                      <div>• Grunnleggende utstyr</div>
                      <div>• Rengjøring etter bruk</div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-900">Vilkår</span>
                    </div>
                    <div className="space-y-1 text-xs text-amber-800">
                      <div>• Gratis avbestilling 48t før</div>
                      <div>• Møt opp 15 min før</div>
                      <div>• Faktura sendes etter</div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}
