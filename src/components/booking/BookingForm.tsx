
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from './types';
import { ActorType } from '@/types/pricing';
import { SelectedSlotsAccordion } from './SelectedSlotsAccordion';
import { BookingFormFields } from './BookingFormFields';
import { ActorTypeCard } from './ActorTypeCard';
import { EnhancedPriceCalculationCard } from './EnhancedPriceCalculationCard';
import { BookingActionButtons } from './BookingActionButtons';
import { BookingService, BookingFormData } from '@/services/BookingService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

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
  const { addToCart } = useCart();

  const [formData, setFormData] = useState<BookingFormData>({
    purpose: '',
    attendees: 1,
    activityType: '',
    additionalInfo: '',
    actorType: '' as ActorType,
    termsAccepted: false
  });

  const [conflicts, setConflicts] = useState<any[]>([]);

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
    setConflicts([]);
    if (onSlotsCleared) {
      onSlotsCleared();
    }
  };

  const isFormValid = () => {
    // Check if actor type is selected and not empty string
    if (!formData.actorType) {
      return false;
    }
    
    const validation = BookingService.validateBookingData({
      selectedSlots,
      facilityId,
      facilityName,
      zones,
      formData: {
        ...formData,
        actorType: formData.actorType as ActorType
      }
    });
    return validation.isValid;
  };

  const handleAddToCart = async () => {
    console.log('BookingForm: handleAddToCart called');

    if (!formData.actorType) {
      toast({
        title: "Feil",
        description: "Vennligst velg aktørtype først.",
        variant: "destructive",
      });
      return;
    }

    const result = await BookingService.addToCart({
      selectedSlots,
      facilityId,
      facilityName,
      zones,
      formData: {
        ...formData,
        actorType: formData.actorType as ActorType
      }
    });

    if (result.success) {
      // Add each slot to cart
      selectedSlots.forEach((slot) => {
        const pricePerHour = 450; // Default price
        const duration = slot.duration || 2;
        
        addToCart({
          facilityId,
          facilityName,
          zoneId: slot.zoneId,
          date: slot.date,
          timeSlot: slot.timeSlot,
          duration,
          pricePerHour,
          purpose: formData.purpose || 'Generell booking',
          expectedAttendees: formData.attendees,
          organizationType: formData.actorType as any,
          additionalServices: [],
          timeSlots: [slot],
          pricing: {
            baseFacilityPrice: pricePerHour * duration,
            servicesPrice: 0,
            discounts: 0,
            vatAmount: 0,
            totalPrice: pricePerHour * duration
          }
        });
      });

      toast({
        title: "Lagt til i handlekurv",
        description: result.message,
      });

      // Clear conflicts and slots after successful addition
      setConflicts([]);
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
      // Handle conflicts
      if (result.conflicts) {
        setConflicts(result.conflicts);
      }
      
      toast({
        title: "Feil",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleCompleteBooking = async () => {
    console.log('BookingForm: handleCompleteBooking called');

    if (!isFormValid()) {
      toast({
        title: "Feil",
        description: "Vennligst fyll ut alle påkrevde felter og aksepter vilkårene.",
        variant: "destructive",
      });
      return;
    }

    // Add each slot to cart
    selectedSlots.forEach((slot) => {
      const pricePerHour = 450; // Default price
      const duration = slot.duration || 2;
      
      addToCart({
        facilityId,
        facilityName,
        zoneId: slot.zoneId,
        date: slot.date,
        timeSlot: slot.timeSlot,
        duration,
        pricePerHour,
        purpose: formData.purpose || 'Generell booking',
        expectedAttendees: formData.attendees,
        organizationType: formData.actorType as any,
        additionalServices: [],
        timeSlots: [slot],
        pricing: {
          baseFacilityPrice: pricePerHour * duration,
          servicesPrice: 0,
          discounts: 0,
          vatAmount: 0,
          totalPrice: pricePerHour * duration
        }
      });
    });

    toast({
      title: "Lagt til i handlekurv",
      description: "Sender deg til kassen...",
    });

    // Clear conflicts and slots after successful addition
    setConflicts([]);
    if (onSlotsCleared) {
      onSlotsCleared();
    }

    // Call parent callback if provided
    if (onCompleteBooking) {
      onCompleteBooking({
        selectedSlots,
        facilityId,
        facilityName,
        formData
      });
    }

    // Navigate to checkout immediately
    setTimeout(() => {
      navigate('/checkout');
    }, 500);
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
      <CardContent className="space-y-4 p-4">
        {/* Conflict Warning */}
        {conflicts.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {conflicts.length === 1 
                ? "Det valgte tidspunktet har en konflikt med en eksisterende booking." 
                : `${conflicts.length} av de valgte tidspunktene har konflikter med eksisterende bookinger.`
              }
              Vennligst velg andre tidspunkt eller kontakt oss for å løse konflikten.
            </AlertDescription>
          </Alert>
        )}

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

        {/* Actor Type Selection */}
        <ActorTypeCard
          value={formData.actorType}
          onChange={(actorType) => updateFormData({ actorType })}
        />

        {/* Enhanced Price Calculation */}
        <EnhancedPriceCalculationCard
          selectedSlots={selectedSlots}
          facilityId={facilityId}
          actorType={formData.actorType}
          activityType={formData.activityType}
          hidePricingModeSelector={true}
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
