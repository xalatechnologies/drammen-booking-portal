import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from './types';
import { ActorType } from '@/types/pricing';
import { SelectedSlotsAccordion } from './SelectedSlotsAccordion';
import { BookingFormFields } from './BookingFormFields';
import { EnhancedPriceCalculationCard } from './EnhancedPriceCalculationCard';
import { BookingActionButtons } from './BookingActionButtons';
import { useCartStore } from '@/stores/useCartStore';
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
  console.log('SimplifiedBookingForm: Rendering with selectedSlots:', selectedSlots);
  console.log('SimplifiedBookingForm: facilityId:', facilityId, 'facilityName:', facilityName);
  
  const { addToCart } = useCartStore();
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
    const valid = formData.purpose.trim() && 
           formData.attendees > 0 && 
           formData.activityType && 
           formData.actorType &&
           formData.termsAccepted &&
           selectedSlots.length > 0;
    
    console.log('SimplifiedBookingForm: Form validation:', {
      purpose: !!formData.purpose.trim(),
      attendees: formData.attendees > 0,
      activityType: !!formData.activityType,
      actorType: !!formData.actorType,
      termsAccepted: formData.termsAccepted,
      hasSlots: selectedSlots.length > 0,
      overall: valid
    });
    
    return valid;
  };

  const handleAddToCart = () => {
    console.log('SimplifiedBookingForm: handleAddToCart called');
    console.log('SimplifiedBookingForm: Form valid:', isFormValid());
    console.log('SimplifiedBookingForm: Form data:', formData);
    console.log('SimplifiedBookingForm: Selected slots:', selectedSlots);

    if (!isFormValid()) {
      toast({
        title: "Manglende informasjon",
        description: "Vennligst fyll ut alle påkrevde felt og aksepter vilkårene",
        variant: "destructive",
      });
      return;
    }

    try {
      // Calculate total pricing for all slots
      const totalDuration = selectedSlots.reduce((total, slot) => total + (slot.duration || 2), 0);
      const averagePricePerHour = zones.length > 0 ? 
        selectedSlots.reduce((total, slot) => {
          const zone = zones.find(z => z.id === slot.zoneId);
          return total + (zone?.pricePerHour || 450);
        }, 0) / selectedSlots.length : 450;

      const baseFacilityPrice = averagePricePerHour * totalDuration;

      console.log('SimplifiedBookingForm: Creating single reservation with multiple slots:', {
        facilityId,
        facilityName,
        selectedSlots,
        totalDuration,
        averagePricePerHour,
        baseFacilityPrice
      });

      // Create a single cart item with all selected slots
      addToCart({
        facilityId,
        facilityName,
        zoneId: selectedSlots[0].zoneId, // Primary zone for backward compatibility
        date: selectedSlots[0].date, // Primary date for backward compatibility
        timeSlot: selectedSlots[0].timeSlot, // Primary time slot for backward compatibility
        duration: totalDuration,
        pricePerHour: averagePricePerHour,
        purpose: formData.purpose,
        expectedAttendees: formData.attendees,
        organizationType: formData.actorType === 'private-person' ? 'private' : 
                        formData.actorType === 'lag-foreninger' ? 'organization' : 'business',
        additionalServices: [],
        timeSlots: selectedSlots, // All selected slots in one reservation
        customerInfo: {
          name: '',
          email: '',
          phone: ''
        },
        pricing: {
          baseFacilityPrice,
          servicesPrice: 0,
          discounts: 0,
          vatAmount: 0,
          totalPrice: baseFacilityPrice
        }
      });

      toast({
        title: "Lagt til i handlekurv",
        description: `Reservasjon med ${selectedSlots.length} tidspunkt er lagt til i handlekurven`,
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
    } catch (error) {
      console.error('SimplifiedBookingForm: Error adding to cart:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke legge til i handlekurv. Prøv igjen.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteBooking = () => {
    console.log('SimplifiedBookingForm: handleCompleteBooking called');
    console.log('SimplifiedBookingForm: Form valid:', isFormValid());

    if (!isFormValid()) {
      toast({
        title: "Manglende informasjon",
        description: "Vennligst fyll ut alle påkrevde felt og aksepter vilkårene",
        variant: "destructive",
      });
      return;
    }

    // For now, add to cart and navigate to checkout
    handleAddToCart();
    
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
