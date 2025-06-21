import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CartItem } from '@/types/cart';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { ReservationHeader } from './ReservationHeader';
import { ReservationDetails } from './ReservationDetails';
import { TimeSlotsList } from './TimeSlotsList';
import { ServicesAndTerms } from './ServicesAndTerms';

interface ReservationAccordionProps {
  reservations: CartItem[];
  onEditReservation: (reservationId: string) => void;
  onRemoveReservation: (reservationId: string) => void;
  onSendToApproval: (reservationId: string) => void;
}

export function ReservationAccordion({ 
  reservations, 
  onEditReservation, 
  onRemoveReservation,
  onSendToApproval
}: ReservationAccordionProps) {
  const uniqueReservations = reservations.filter((reservation, index, self) => 
    index === self.findIndex(r => r.id === reservation.id)
  );

  const getBookingType = (reservation: CartItem) => {
    const timeSlots = reservation.timeSlots || [{
      date: reservation.date,
      timeSlot: reservation.timeSlot,
      zoneId: reservation.zoneId,
      duration: reservation.duration
    }];
    
    if (timeSlots.length === 1) {
      return 'Enkelt booking';
    }
    
    const dateKeys = [...new Set(timeSlots.map(slot => {
      const dateValue = slot.date instanceof Date ? slot.date : new Date(slot.date);
      return format(dateValue, 'yyyy-MM-dd');
    }))];
    if (dateKeys.length > 1) {
      const uniqueDays = new Set(timeSlots.map(slot => {
        const dateValue = slot.date instanceof Date ? slot.date : new Date(slot.date);
        return format(dateValue, 'EEEE', { locale: nb });
      }));
      if (uniqueDays.size === 1) {
        return 'Fastlån';
      }
    }
    return 'Flere tidspunkt';
  };

  return (
    <div className="space-y-4">
      {uniqueReservations.map((reservation) => {
        const timeSlots = reservation.timeSlots || [{
          date: reservation.date,
          timeSlot: reservation.timeSlot,
          zoneId: reservation.zoneId,
          duration: reservation.duration
        }];
        
        const totalDuration = timeSlots.reduce((sum, slot) => {
          return sum + (slot.duration || 2);
        }, 0);
        
        const bookingType = getBookingType(reservation);

        return (
          <div key={reservation.id} className="border border-gray-200 rounded-lg bg-white shadow-sm">
            <ReservationHeader
              reservation={reservation}
              bookingType={bookingType}
              totalDuration={totalDuration}
              onEditReservation={onEditReservation}
              onRemoveReservation={onRemoveReservation}
              onSendToApproval={onSendToApproval}
            />

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={reservation.id} className="border-none">
                <AccordionTrigger className="px-6 py-4 hover:no-underline text-left">
                  
                </AccordionTrigger>
                
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-8 pt-4 border-t border-gray-100">
                    <ReservationDetails reservation={reservation} />
                    <TimeSlotsList reservation={reservation} />
                    <ServicesAndTerms />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        );
      })}
    </div>
  );
}
