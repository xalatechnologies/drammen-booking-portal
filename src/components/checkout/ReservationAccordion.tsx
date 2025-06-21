
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Edit3, Trash2 } from 'lucide-react';
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
    <div className="space-y-4">
      {uniqueReservations.map((reservation, index) => (
        <Accordion key={reservation.id} type="single" collapsible>
          <AccordionItem 
            value={reservation.id} 
            className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg overflow-hidden"
          >
            <AccordionTrigger className="p-6 hover:no-underline group [&[data-state=open]>div]:mb-2">
              <div className="w-full">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                      Reservasjon #{index + 1}
                    </div>
                  </div>
                </div>
                <ReservationSummary reservation={reservation} />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-6 pt-4 border-t border-gray-100">
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditReservation(reservation.id)}
                    className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                  >
                    <Edit3 className="h-4 w-4" />
                    Rediger
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveReservation(reservation.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Fjern
                  </Button>
                </div>
                
                <ReservationTabs reservation={reservation} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}
