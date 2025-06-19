
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {reservations.map((reservation, index) => (
        <AccordionItem 
          key={reservation.id} 
          value={reservation.id}
          className="border rounded-lg bg-white shadow-sm"
        >
          <AccordionTrigger className="p-6 hover:no-underline">
            <div className="w-full mr-4">
              <ReservationSummary reservation={reservation} />
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-6 pt-0">
            <div className="space-y-6">
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
      ))}
    </Accordion>
  );
}
