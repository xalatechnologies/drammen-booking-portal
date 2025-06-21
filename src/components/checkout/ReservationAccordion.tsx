
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
  // Remove any potential duplicates based on ID
  const uniqueReservations = reservations.filter((reservation, index, self) => 
    index === self.findIndex(r => r.id === reservation.id)
  );

  return (
    <div className="space-y-3">
      {uniqueReservations.map((reservation) => (
        <Accordion key={reservation.id} type="single" collapsible>
          <AccordionItem value={reservation.id} className="border rounded-lg bg-white shadow-sm">
            <AccordionTrigger className="p-4 hover:no-underline [&[data-state=open]>div]:mb-2">
              <ReservationSummary reservation={reservation} />
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="space-y-4 pt-2 border-t">
                <div className="flex justify-end gap-2">
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
                
                <ReservationTabs reservation={reservation} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}
