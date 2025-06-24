
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, Clock, Users } from 'lucide-react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType } from '@/types/pricing';

interface EnhancedPriceCalculationCardProps {
  selectedSlots: SelectedTimeSlot[];
  actorType: ActorType;
}

export function EnhancedPriceCalculationCard({
  selectedSlots,
  actorType
}: EnhancedPriceCalculationCardProps) {
  const basePrice = 450; // Default price per hour
  const totalHours = selectedSlots.length;
  const subtotal = totalHours * basePrice;
  const tax = Math.round(subtotal * 0.25);
  const total = subtotal + tax;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Prisberegning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Antall timer:</span>
          </div>
          <span className="font-medium">{totalHours}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span>Pris per time:</span>
          <span className="font-medium">{basePrice} kr</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span>Kundegruppe:</span>
          <Badge variant="outline" className="text-xs">
            {actorType}
          </Badge>
        </div>

        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{subtotal} kr</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>MVA (25%):</span>
            <span>{tax} kr</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>{total} kr</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
