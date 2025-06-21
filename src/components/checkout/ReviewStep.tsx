
import React from 'react';
import { ShoppingCart, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
      {/* Compact Summary */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Gjennomgå reservasjoner</h2>
                <p className="text-sm text-gray-600">{items.length} reservasjon{items.length !== 1 ? 'er' : ''} • {totalSlots} tidspunkt</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{items.reduce((sum, item) => sum + (item.pricing?.totalPrice || 0), 0)} kr</div>
              <div className="text-xs text-gray-500">inkl. MVA</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <Calendar className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-blue-900">{totalSlots}</div>
              <div className="text-xs text-blue-700">tidspunkt</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <MapPin className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-green-900">{new Set(items.map(item => item.facilityId)).size}</div>
              <div className="text-xs text-green-700">fasiliteter</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <ShoppingCart className="h-5 w-5 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-purple-900">{items.reduce((sum, item) => sum + (item.timeSlots?.reduce((total, slot) => total + (slot.duration || 2), 0) || 2), 0)}</div>
              <div className="text-xs text-purple-700">timer totalt</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations List */}
      <ReservationAccordion 
        reservations={items}
        onEditReservation={onEditReservation}
        onRemoveReservation={onRemoveReservation}
      />
      
      {/* Continue Button */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-lg">
        <CardContent className="p-4">
          <Button 
            onClick={onContinue} 
            className="w-full h-12 text-lg bg-white text-blue-600 hover:bg-blue-50 font-semibold"
          >
            Fortsett til kontaktopplysninger →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
