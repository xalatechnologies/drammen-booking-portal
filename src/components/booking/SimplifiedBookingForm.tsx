
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, CreditCard, Plus, Minus, RotateCcw } from 'lucide-react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from './types';
import { ActorType } from '@/types/pricing';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';

interface SimplifiedBookingFormProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones?: Zone[];
  onAddToCart?: (bookingData: any) => void;
  onCompleteBooking?: (bookingData: any) => void;
  onRecurringBooking?: () => void;
  onSlotsCleared?: () => void;
}

interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: ActorType;
  termsAccepted: boolean;
}

const activityTypes = [
  'Møte',
  'Konferanse', 
  'Workshop',
  'Trening',
  'Sosial aktivitet',
  'Kurs',
  'Presentasjon',
  'Annet'
];

const actorTypes = [
  { value: 'private-person', label: 'Privatperson' },
  { value: 'lag-foreninger', label: 'Lag og foreninger' },
  { value: 'paraply', label: 'Paraplyorganisasjoner' },
  { value: 'private-firma', label: 'Private firma' },
  { value: 'kommunale-enheter', label: 'Kommunale enheter' }
];

export function SimplifiedBookingForm({
  selectedSlots,
  facilityId,
  facilityName,
  zones = [],
  onAddToCart,
  onCompleteBooking,
  onRecurringBooking,
  onSlotsCleared
}: SimplifiedBookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    purpose: '',
    attendees: 1,
    activityType: '',
    additionalInfo: '',
    actorType: 'private-person',
    termsAccepted: false
  });

  const firstSlot = selectedSlots[0];
  const { calculation, isLoading } = usePriceCalculation({
    facilityId,
    zoneId: firstSlot?.zoneId,
    startDate: firstSlot?.date,
    customerType: formData.actorType,
    timeSlot: firstSlot?.timeSlot,
    eventType: formData.activityType,
  });

  const updateFormData = (updates: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleAttendeesChange = (change: number) => {
    const newValue = Math.max(1, formData.attendees + change);
    updateFormData({ attendees: newValue });
  };

  const isFormValid = () => {
    return formData.purpose.trim() && 
           formData.attendees > 0 && 
           formData.activityType && 
           formData.actorType &&
           formData.termsAccepted &&
           selectedSlots.length > 0;
  };

  const handleAddToCart = () => {
    if (onAddToCart && isFormValid()) {
      onAddToCart({
        selectedSlots,
        facilityId,
        facilityName,
        formData
      });
    }
  };

  const handleCompleteBooking = () => {
    if (onCompleteBooking && isFormValid()) {
      onCompleteBooking({
        selectedSlots,
        facilityId,
        facilityName,
        formData
      });
    }
  };

  if (selectedSlots.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Ingen tidspunkt valgt
          </h3>
          <p className="text-gray-600">
            Velg tidspunkt i kalenderen først for å starte booking prosessen.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Booking informasjon</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-sm font-medium">
              Formål <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="purpose"
              placeholder="Beskriv formålet med reservasjonen..."
              value={formData.purpose}
              onChange={(e) => updateFormData({ purpose: e.target.value })}
              className="min-h-[60px]"
              required
            />
          </div>

          {/* Number of Attendees */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Antall deltakere <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAttendeesChange(-1)}
                disabled={formData.attendees <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={formData.attendees}
                onChange={(e) => updateFormData({ attendees: parseInt(e.target.value) || 1 })}
                className="w-16 text-center"
                min="1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAttendeesChange(1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Activity Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Type aktivitet <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.activityType}
              onValueChange={(value) => updateFormData({ activityType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg type aktivitet" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actor Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Aktør type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.actorType}
              onValueChange={(value: ActorType) => updateFormData({ actorType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Velg aktør type" />
              </SelectTrigger>
              <SelectContent>
                {actorTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="additionalInfo" className="text-sm font-medium">
              Tilleggsopplysninger
            </Label>
            <Textarea
              id="additionalInfo"
              placeholder="Tilleggsinformasjon om reservasjonen (valgfritt)..."
              value={formData.additionalInfo}
              onChange={(e) => updateFormData({ additionalInfo: e.target.value })}
              className="min-h-[60px]"
            />
          </div>
        </div>

        {/* Price Calculation */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 mb-3">
              Prisberegning
            </h4>
            
            {isLoading ? (
              <div className="text-blue-700">Beregner pris...</div>
            ) : calculation ? (
              <div className="space-y-2 text-blue-800">
                <div className="flex justify-between text-sm">
                  <span>Antall tidspunkt:</span>
                  <span>{selectedSlots.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Grunnpris:</span>
                  <span>{calculation.basePrice} kr</span>
                </div>
                {calculation.discounts.length > 0 && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>Rabatt ({formData.actorType}):</span>
                    <span>-{calculation.discounts.reduce((sum, d) => sum + d.amount, 0)} kr</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>MVA (25%):</span>
                  <span>{Math.round(calculation.totalPrice * 0.25)} kr</span>
                </div>
                <hr className="border-blue-300" />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{calculation.totalPrice + Math.round(calculation.totalPrice * 0.25)} kr</span>
                </div>
              </div>
            ) : (
              <div className="text-blue-700">Ingen prisberegning tilgjengelig</div>
            )}
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={formData.termsAccepted}
            onCheckedChange={(checked) => updateFormData({ termsAccepted: !!checked })}
            className="mt-1"
          />
          <div className="text-sm">
            <label htmlFor="terms" className="cursor-pointer">
              Jeg aksepterer vilkår og betingelser for bruk av lokalene{' '}
              <span className="text-red-500">*</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={onRecurringBooking}
            variant="outline"
            className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Gjentakende booking
          </Button>
          
          <Button
            onClick={handleAddToCart}
            disabled={!isFormValid()}
            variant="outline"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Legg i handlekurv
          </Button>
          
          <Button
            onClick={handleCompleteBooking}
            disabled={!isFormValid()}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Fullfør booking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
