
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from './types';
import { ActorType } from '@/types/pricing';
import { SelectedSlotsAccordion } from './SelectedSlotsAccordion';
import { BookingFormFields } from './BookingFormFields';
import { EnhancedPriceCalculationCard } from './EnhancedPriceCalculationCard';
import { BookingActionButtons } from './BookingActionButtons';
import { BookingService, BookingFormData } from '@/services/BookingService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  console.log('SimplifiedBookingForm: Rendering with selectedSlots:', selectedSlots);
  console.log('SimplifiedBookingForm: facilityId:', facilityId, 'facilityName:', facilityName);
  
  const { toast } = useToast();
  const navigate = useNavigate();

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
    console.log('SimplifiedBookingForm: handleRemoveSlot called:', slot);
    if (onRemoveSlot) {
      onRemoveSlot(slot.zoneId, slot.date, slot.timeSlot);
    }
  };

  const handleClearAll = () => {
    console.log('SimplifiedBookingForm: handleClearAll called');
    if (onSlotsCleared) {
      onSlotsCleared();
    }
  };

  const isFormValid = () => {
    return BookingService.validateBookingData({
      selectedSlots,
      facilityId,
      facilityName,
      zones,
      formData
    });
  };

  const handleAddToCart = async () => {
    console.log('SimplifiedBookingForm: handleAddToCart called');

    const result = await BookingService.addToCart({
      selectedSlots,
      facilityId,
      facilityName,
      zones,
      formData
    });

    if (result.success) {
      toast({
        title: "Lagt til i handlekurv",
        description: result.message,
      });

      // Clear slots after successful addition
      if (onSlotsCleared) {
        onSlotsCleared();
      }

      // Call parent callback if provided
      if (onAddToCart) {
        onAddToCart({
          selectedSlots,
          facilityId,
          facilityName,
          formData
        });
      }
    } else {
      toast({
        title: "Feil",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleCompleteBooking = async () => {
    console.log('SimplifiedBookingForm: handleCompleteBooking called');

    const result = await BookingService.completeBooking({
      selectedSlots,
      facilityId,
      facilityName,
      zones,
      formData
    });

    if (result.success) {
      toast({
        title: "Reservasjon opprettet",
        description: result.message,
      });

      setTimeout(() => {
        navigate('/checkout');
      }, 1000);

      if (onCompleteBooking) {
        onCompleteBooking({
          selectedSlots,
          facilityId,
          facilityName,
          formData
        });
      }
    } else {
      toast({
        title: "Feil",
        description: result.message,
        variant: "destructive",
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
          onClearAll={handleClearAll}
        />

        {/* Basic Information */}
        <BookingFormFields
          formData={formData}
          onUpdateFormData={updateFormData}
        />

        {/* Enhanced Price Calculation */}
        <EnhancedPriceCalculationCard
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
