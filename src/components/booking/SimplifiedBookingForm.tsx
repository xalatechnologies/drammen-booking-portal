
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from './types';
import { ActorType } from '@/types/pricing';
import { SelectedSlotsAccordion } from './SelectedSlotsAccordion';
import { BookingFormFields } from './BookingFormFields';
import { PriceCalculationCard } from './PriceCalculationCard';
import { BookingActionButtons } from './BookingActionButtons';

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

  const updateFormData = (updates: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleRemoveSlot = (slot: SelectedTimeSlot) => {
    if (onRemoveSlot) {
      onRemoveSlot(slot.zoneId, slot.date, slot.timeSlot);
    }
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
          <p className="text-gray-600">
            Velg tidspunkt i kalenderen først for å starte booking prosessen.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="space-y-5 p-5">
        {/* Selected Times Overview Accordion */}
        <SelectedSlotsAccordion
          selectedSlots={selectedSlots}
          zones={zones}
          onRemoveSlot={handleRemoveSlot}
        />

        {/* Basic Information */}
        <BookingFormFields
          formData={formData}
          onUpdateFormData={updateFormData}
        />

        {/* Price Calculation */}
        <PriceCalculationCard
          selectedSlots={selectedSlots}
          facilityId={facilityId}
          actorType={formData.actorType}
          activityType={formData.activityType}
        />

        {/* Terms and Action Buttons */}
        <BookingActionButtons
          termsAccepted={formData.termsAccepted}
          onTermsAcceptedChange={(accepted) => updateFormData({ termsAccepted: accepted })}
          onAddToCart={handleAddToCart}
          onCompleteBooking={handleCompleteBooking}
          isFormValid={isFormValid()}
        />
      </CardContent>
    </Card>
  );
}
