
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ShoppingCart, CreditCard, Plus, Minus, X, Clock, Calendar, MapPin } from 'lucide-react';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from './types';
import { ActorType } from '@/types/pricing';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

interface SimplifiedBookingFormProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones?: Zone[];
  onAddToCart?: (bookingData: any) => void;
  onCompleteBooking?: (bookingData: any) => void;
  onSlotsCleared?: () => void;
  onRemoveSlot?: (zoneId: string, date: Date, timeSlot: string) => void;
}

interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: ActorType | '';
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
  onSlotsCleared,
  onRemoveSlot
}: SimplifiedBookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    purpose: '',
    attendees: 1,
    activityType: '',
    additionalInfo: '',
    actorType: '',
    termsAccepted: false
  });

  const firstSlot = selectedSlots[0];
  const { calculation, isLoading } = usePriceCalculation({
    facilityId,
    zoneId: firstSlot?.zoneId,
    startDate: firstSlot?.date,
    customerType: formData.actorType as ActorType,
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

  const handleRemoveSlot = (slot: SelectedTimeSlot) => {
    if (onRemoveSlot) {
      onRemoveSlot(slot.zoneId, slot.date, slot.timeSlot);
    }
  };

  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone?.name || 'Ukjent sone';
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
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Ingen tidspunkt valgt
          </h3>
          <p className="text-gray-600 text-lg">
            Velg tidspunkt i kalenderen først for å starte booking prosessen.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Booking informasjon</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Times Overview Accordion */}
        <Accordion type="single" collapsible defaultValue="selected-times">
          <AccordionItem value="selected-times">
            <AccordionTrigger className="text-lg font-medium">
              Oversikt av valgte tider ({selectedSlots.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {selectedSlots.map((slot, index) => (
                  <div key={`${slot.zoneId}-${slot.date.toISOString()}-${slot.timeSlot}`} 
                       className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-blue-900 font-medium">
                        <Calendar className="h-4 w-4" />
                        {format(slot.date, 'EEEE d. MMMM yyyy', { locale: nb })}
                      </div>
                      <div className="flex items-center gap-2 text-blue-700 text-sm mt-1">
                        <Clock className="h-4 w-4" />
                        {slot.timeSlot}
                      </div>
                      <div className="flex items-center gap-2 text-blue-700 text-sm mt-1">
                        <MapPin className="h-4 w-4" />
                        {getZoneName(slot.zoneId)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSlot(slot)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Basic Information */}
        <div className="space-y-5">
          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-lg font-medium">
              Formål <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="purpose"
              placeholder="Beskriv formålet med reservasjonen..."
              value={formData.purpose}
              onChange={(e) => updateFormData({ purpose: e.target.value })}
              className="min-h-[80px] text-lg"
              required
            />
          </div>

          {/* Number of Attendees */}
          <div className="space-y-2">
            <Label className="text-lg font-medium">
              Antall deltakere <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAttendeesChange(-1)}
                disabled={formData.attendees <= 1}
                className="h-10 w-10 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={formData.attendees}
                onChange={(e) => updateFormData({ attendees: parseInt(e.target.value) || 1 })}
                className="w-20 text-center text-lg"
                min="1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAttendeesChange(1)}
                className="h-10 w-10 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Activity Type */}
          <div className="space-y-2">
            <Label className="text-lg font-medium">
              Type aktivitet <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.activityType}
              onValueChange={(value) => updateFormData({ activityType: value })}
            >
              <SelectTrigger className="text-lg">
                <SelectValue placeholder="Velg type aktivitet" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-lg">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="additionalInfo" className="text-lg font-medium">
              Tilleggsopplysninger
            </Label>
            <Textarea
              id="additionalInfo"
              placeholder="Tilleggsinformasjon om reservasjonen (valgfritt)..."
              value={formData.additionalInfo}
              onChange={(e) => updateFormData({ additionalInfo: e.target.value })}
              className="min-h-[80px] text-lg"
            />
          </div>

          {/* Actor Type - After Additional Information */}
          <div className="space-y-2">
            <Label className="text-lg font-medium">
              Aktør type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.actorType}
              onValueChange={(value: ActorType) => updateFormData({ actorType: value })}
            >
              <SelectTrigger className="text-lg">
                <SelectValue placeholder="Velg aktør type" />
              </SelectTrigger>
              <SelectContent>
                {actorTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-lg">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Calculation - Conditional */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-900 mb-3 text-lg">
              Prisberegning
            </h4>
            
            {!formData.actorType ? (
              <div className="text-blue-700 text-lg">
                Velg aktør type for å beregne pris
              </div>
            ) : isLoading ? (
              <div className="text-blue-700 text-lg">
                Beregner pris...
              </div>
            ) : calculation ? (
              <div className="space-y-2 text-blue-800">
                <div className="flex justify-between text-lg">
                  <span>Antall tidspunkt:</span>
                  <span>{selectedSlots.length}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Grunnpris:</span>
                  <span>{calculation.basePrice} kr</span>
                </div>
                {calculation.discounts.length > 0 && (
                  <div className="flex justify-between text-lg text-green-700">
                    <span>Rabatt ({actorTypes.find(a => a.value === formData.actorType)?.label}):</span>
                    <span>-{calculation.discounts.reduce((sum, d) => sum + d.amount, 0)} kr</span>
                  </div>
                )}
                <div className="flex justify-between text-lg">
                  <span>MVA (25%):</span>
                  <span>{Math.round(calculation.totalPrice * 0.25)} kr</span>
                </div>
                <hr className="border-blue-300" />
                <div className="flex justify-between font-bold text-xl">
                  <span>Total:</span>
                  <span>{calculation.totalPrice + Math.round(calculation.totalPrice * 0.25)} kr</span>
                </div>
              </div>
            ) : (
              <div className="text-blue-700 text-lg">Ingen prisberegning tilgjengelig</div>
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
          <div className="text-lg">
            <label htmlFor="terms" className="cursor-pointer">
              Jeg aksepterer{' '}
              <a 
                href="/vilkar" 
                target="_blank" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                vilkår og betingelser
              </a>
              {' '}for bruk av lokalene{' '}
              <span className="text-red-500">*</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={handleAddToCart}
            disabled={!isFormValid()}
            variant="outline"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 text-lg py-3"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Legg i handlekurv
          </Button>
          
          <Button
            onClick={handleCompleteBooking}
            disabled={!isFormValid()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
            size="lg"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Fullfør booking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
