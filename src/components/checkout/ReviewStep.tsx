
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CartItem } from '@/types/cart';
import { ReservationAccordion } from './ReservationAccordion';

interface ReviewStepProps {
  items: CartItem[];
  onEditReservation: (reservationId: string) => void;
  onRemoveReservation: (reservationId: string) => void;
  onSendToApproval: (reservationId?: string) => void;
  onEmptyCart: () => void;
}

export function ReviewStep({ 
  items, 
  onEditReservation, 
  onRemoveReservation, 
  onSendToApproval,
  onEmptyCart
}: ReviewStepProps) {
  const totalSlots = items.reduce((total, item) => total + (item.timeSlots?.length || 1), 0);
  const totalPrice = items.reduce((total, item) => total + (item.pricing?.totalPrice || (item.pricePerHour * 2)), 0);

  return (
    <div className="space-y-6">
      <ReservationAccordion 
        reservations={items}
        onEditReservation={onEditReservation}
        onRemoveReservation={onRemoveReservation}
        onSendToApproval={onSendToApproval}
      />
      
      {/* Total Price Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Total for {items.length} reservasjon{items.length !== 1 ? 'er' : ''}
              </h3>
              <p className="text-sm text-gray-600">
                {totalSlots} tidspunkt totalt
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {totalPrice} kr
              </div>
              <Badge variant="outline" className="text-xs mt-1">
                Inkl. MVA
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onEmptyCart}
        >
          Tøm handlekurv
        </Button>
        
        <Button 
          onClick={() => onSendToApproval()} 
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Send alle sammen til godkjenning
        </Button>
      </div>
    </div>
  );
}
