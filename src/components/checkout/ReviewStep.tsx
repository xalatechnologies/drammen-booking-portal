
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
      {/* Elegant Summary Header */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dine reservasjoner</h2>
                <p className="text-gray-600">Gjennomgå detaljene før du fortsetter</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{items.length}</div>
              <div className="text-sm text-gray-500">reservasjon{items.length !== 1 ? 'er' : ''}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{totalSlots}</div>
              <div className="text-sm text-blue-700">tidspunkt totalt</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{new Set(items.map(item => item.facilityId)).size}</div>
              <div className="text-sm text-green-700">ulike fasiliteter</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <ShoppingCart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">{items.reduce((sum, item) => sum + (item.pricing?.totalPrice || 0), 0)}</div>
              <div className="text-sm text-purple-700">kr totalt</div>
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
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-xl">
        <CardContent className="p-6">
          <Button 
            onClick={onContinue} 
            className="w-full h-14 text-lg bg-white text-blue-600 hover:bg-blue-50 font-semibold"
          >
            Fortsett til kontaktopplysninger →
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
