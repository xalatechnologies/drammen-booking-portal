
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
  const totalSlots = items.reduce((total, item) => total + (item.timeSlots?.length || 1), 0);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Dine reservasjoner
          </div>
          <div className="text-sm font-normal text-gray-600">
            {items.length} reservasjon{items.length !== 1 ? 'er' : ''} • {totalSlots} tidspunkt
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ReservationAccordion 
          reservations={items}
          onEditReservation={onEditReservation}
          onRemoveReservation={onRemoveReservation}
        />
        
        <Button onClick={onContinue} className="w-full h-12 text-lg">
          Fortsett til kontaktopplysninger
        </Button>
      </CardContent>
    </Card>
  );
}
