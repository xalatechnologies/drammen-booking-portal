
import React from 'react';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types/cart';
import { ReservationAccordion } from './ReservationAccordion';

interface ReviewStepProps {
  items: CartItem[];
  onEditReservation: (reservationId: string) => void;
  onRemoveReservation: (reservationId: string) => void;
  onContinue: () => void;
}

export function ReviewStep({ 
  items, 
  onEditReservation, 
  onRemoveReservation, 
  onContinue 
}: ReviewStepProps) {
  const totalSlots = items.reduce((total, item) => total + (item.timeSlots?.length || 1), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Dine reservasjoner ({items.length})
        </h2>
        <span className="text-sm text-gray-500">
          {totalSlots} tidspunkt totalt
        </span>
      </div>
      
      <ReservationAccordion 
        reservations={items}
        onEditReservation={onEditReservation}
        onRemoveReservation={onRemoveReservation}
      />
      
      <Button onClick={onContinue} className="w-full h-12 text-lg">
        Fortsett til kontaktopplysninger
      </Button>
    </div>
  );
}
