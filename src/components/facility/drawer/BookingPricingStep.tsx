
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from '@/components/booking/types';
import { ActorType as PricingActorType, BookingType } from '@/types/pricing';
import { ActorType as CartActorType } from '@/types/cart';
import { useCartStore } from '@/stores/useCartStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Users, MapPin, Calculator, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';

interface BookingPricingStepProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones?: Zone[];
  actorType: PricingActorType;
  onActorTypeChange: (actorType: PricingActorType) => void;
  bookingType: BookingType;
  onBack: () => void;
  onComplete: () => void;
  onAddToCart: () => void;
}

// Helper function to convert between ActorType formats
const convertActorType = (pricingType: PricingActorType): CartActorType => {
  switch (pricingType) {
    case 'private-person': return 'private';
    case 'lag-foreninger': return 'organization';
    case 'paraply': return 'organization';
    case 'private-firma': return 'business';
    case 'kommunale-enheter': return 'organization';
    default: return 'private';
  }
};

export function BookingPricingStep({
  selectedSlots,
  facilityId,
  facilityName,
  zones = [],
  actorType,
  onActorTypeChange,
  bookingType,
  onBack,
  onComplete,
  onAddToCart
}: BookingPricingStepProps) {
  const { addItem } = useCartStore();

  const calculateBasePrice = () => {
    return selectedSlots.length * 450; // Base price per slot
  };

  const getActorTypeMultiplier = (actor: PricingActorType) => {
    switch (actor) {
      case 'private-person': return 1.0;
      case 'lag-foreninger': return 0.7;
      case 'paraply': return 0.5;
      case 'private-firma': return 1.2;
      case 'kommunale-enheter': return 0.8;
      default: return 1.0;
    }
  };

  const calculateFinalPrice = () => {
    const basePrice = calculateBasePrice();
    const multiplier = getActorTypeMultiplier(actorType);
    return Math.round(basePrice * multiplier);
  };

  const handleAddToCart = () => {
    selectedSlots.forEach(slot => {
      const cartItem = {
        facilityId,
        facilityName,
        zoneId: slot.zoneId,
        startTime: slot.date,
        endTime: new Date(slot.date.getTime() + (60 * 60 * 1000)), // 1 hour later
        price: 450,
        duration: 60,
        purpose: 'General booking',
        expectedAttendees: 1,
        actorType: convertActorType(actorType),
        eventType: 'other',
        ageGroup: 'mixed',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
      };
      
      addItem(cartItem);
    });

    onAddToCart();
  };

  const requiresApproval = ['lag-foreninger', 'paraply'].includes(actorType);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Pris og betingelser
        </h3>
        <p className="text-gray-600">
          Velg aktørtype og se endelig pris for reservasjonen
        </p>
      </div>

      {/* Actor Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Aktørtype</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={actorType} onValueChange={onActorTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Velg aktørtype" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private-person">Privatperson</SelectItem>
              <SelectItem value="lag-foreninger">Lag og foreninger</SelectItem>
              <SelectItem value="paraply">Paraplyorganisasjon</SelectItem>
              <SelectItem value="private-firma">Privat firma</SelectItem>
              <SelectItem value="kommunale-enheter">Kommunale enheter</SelectItem>
            </SelectContent>
          </Select>
          
          {requiresApproval && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Krever godkjenning</Badge>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Denne reservasjonen må godkjennes før den blir aktiv.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Slots Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Valgte tidspunkt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {selectedSlots.map((slot, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{slot.zoneId === 'whole-facility' ? 'Hele lokalet' : `Sone ${slot.zoneId}`}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{format(slot.date, 'dd.MM.yyyy')} - {slot.timeSlot}</span>
                  </div>
                </div>
                <Badge variant="outline">450 kr</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Price Calculation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Prisberegning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Grunnpris ({selectedSlots.length} × 450 kr)</span>
              <span>{calculateBasePrice()} kr</span>
            </div>
            <div className="flex justify-between">
              <span>Aktørtype-rabatt ({Math.round((1 - getActorTypeMultiplier(actorType)) * 100)}%)</span>
              <span>-{calculateBasePrice() - calculateFinalPrice()} kr</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Totalt</span>
                <span>{calculateFinalPrice()} kr</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Tilbake
        </Button>
        <Button onClick={handleAddToCart} variant="outline" className="flex-1">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Legg i kurv
        </Button>
        <Button onClick={onComplete} className="flex-1">
          {requiresApproval ? 'Send forespørsel' : 'Fullfør reservasjon'}
        </Button>
      </div>
    </div>
  );
}
