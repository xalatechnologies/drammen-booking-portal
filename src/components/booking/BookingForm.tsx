import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from './types';
import { ActorType } from '@/types/pricing';
import { SelectedSlotsAccordion } from './SelectedSlotsAccordion';
import { BookingFormFields } from './BookingFormFields';
import { EnhancedPriceCalculationCard } from './EnhancedPriceCalculationCard';
import { BookingActionButtons } from './BookingActionButtons';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: ActorType;
  termsAccepted: boolean;
}

interface BookingFormProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones?: Zone[];
  onAddToCart?: (bookingData: any) => void;
  onCompleteBooking?: (bookingData: any) => void;
  onSlotsCleared?: () => void;
  onRemoveSlot?: (zoneId: string, date: Date, timeSlot: string) => void;
}

export function BookingForm({
  selectedSlots,
  facilityId,
  facilityName,
  zones = [],
  onAddToCart,
  onCompleteBooking,
  onSlotsCleared,
  onRemoveSlot
}: BookingFormProps) {
  console.log('BookingForm: Rendering with selectedSlots:', selectedSlots);
  console.log('BookingForm: facilityId:', facilityId, 'facilityName:', facilityName);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BookingFormData>({
    purpose: '',
    attendees: 1,
    activityType: '',
    additionalInfo: '',
    actorType: 'private-person' as ActorType,
    termsAccepted: false
  });

  const updateFormData = (updates: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleRemoveSlot = (slot: SelectedTimeSlot) => {
    console.log('BookingForm: handleRemoveSlot called:', slot);
    if (onRemoveSlot) {
      onRemoveSlot(slot.zoneId, slot.date, slot.timeSlot);
    }
  };

  const handleClearAll = () => {
    console.log('BookingForm: handleClearAll called');
    if (onSlotsCleared) {
      onSlotsCleared();
    }
  };

  const isFormValid = () => {
    return selectedSlots.length > 0 && formData.termsAccepted;
  };

  const handleAddToCart = async () => {
    console.log('BookingForm: handleAddToCart called');

    try {
      toast({
        title: "Lagt til i handlekurv",
        description: "Items added to cart successfully",
      });

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
    } catch (error) {
      toast({
        title: "Feil",
        description: "Failed to add to cart",
        variant: "destructive",
      });
    }
  };

  const handleCompleteBooking = async () => {
    console.log('BookingForm: handleCompleteBooking called');

    try {
      toast({
        title: "Reservasjon opprettet",
        description: "Booking created successfully",
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
    } catch (error) {
      toast({
        title: "Feil",
        description: "Failed to create booking",
        variant: "destructive",
      });
    }
  };

  const calculateTotalPrice = () => {
    return selectedSlots.length * 450; // Simple calculation
  };

  if (selectedSlots.length === 0) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <p className="text-gray-500">Ingen tidslukker valgt</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <SelectedSlotsAccordion
        selectedSlots={selectedSlots}
        facilityName={facilityName}
        zones={zones}
        onRemoveSlot={handleRemoveSlot}
        onClearAll={handleClearAll}
      />

      <BookingFormFields
        formData={formData}
        updateFormData={updateFormData}
      />

      <EnhancedPriceCalculationCard
        selectedSlots={selectedSlots}
        actorType={formData.actorType}
        zones={zones}
        totalPrice={calculateTotalPrice()}
      />

      <BookingActionButtons
        isValid={isFormValid()}
        onAddToCart={handleAddToCart}
        onCompleteBooking={handleCompleteBooking}
        totalPrice={calculateTotalPrice()}
      />
    </div>
  );
}
