
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Dine reservasjoner ({items.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReservationAccordion 
          reservations={items}
          onEditReservation={onEditReservation}
          onRemoveReservation={onRemoveReservation}
        />
        
        <Button onClick={onContinue} className="w-full h-12 text-lg mt-6">
          Fortsett til kontaktopplysninger
        </Button>
      </CardContent>
    </Card>
  );
}
