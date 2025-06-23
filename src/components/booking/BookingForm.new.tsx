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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useBookingStore } from '@/stores/useBookingStore';
import { useCartStore } from '@/stores/useCartStore';
import { EventType } from '@/types/models';

// Define the form data interface
export interface BookingFormData {
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

// Helper function to convert activity type to event type
const convertActivityToEventType = (activityType: string): EventType => {
  switch (activityType) {
    case 'sport':
    case 'sports': return 'training';
    case 'kultur':
    case 'cultural': return 'performance';
    case 'møte':
    case 'meeting': return 'meeting';
    case 'trening':
    case 'training': return 'training';
    case 'konkurranse':
    case 'competition': return 'competition';
    default: return 'other';
  }
};

// Helper function to convert between ActorType formats
const convertActorType = (pricingType: ActorType): any => {
  switch (pricingType) {
    case 'private-person': return 'private';
    case 'lag-foreninger': return 'lag-foreninger';
    case 'paraply': return 'paraply';
    case 'private-firma': return 'business';
    case 'kommunale-enheter': return 'organization';
    default: return 'private';
  }
};

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
  
  // Get actions from the booking store
  const { checkForConflicts, create } = useBookingStore();
  
  // Get actions from the cart store
  const { addToCart: addItemToCart } = useCartStore();

  const [formData, setFormData] = useState<BookingFormData>({
    purpose: '',
    attendees: 1,
    activityType: '',
    additionalInfo: '',
    actorType: 'private-person' as ActorType,
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
    // Validate the booking data
    if (selectedSlots.length === 0) return false;
    if (!formData.purpose || formData.purpose.trim().length === 0) return false;
    if (formData.attendees < 1) return false;
    if (!formData.actorType) return false;
    if (!formData.termsAccepted) return false;
    
    return true;
  };

  const handleAddToCart = async () => {
    console.log('BookingForm: handleAddToCart called');

    try {
      // Check for conflicts first
      const conflictPromises = selectedSlots.map(slot => {
        const startTime = new Date(slot.date);
        const [hours, minutes] = slot.timeSlot.split(':').map(Number);
        startTime.setHours(hours, minutes, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + (slot.duration || 2));
        
        return checkForConflicts(slot.zoneId, startTime, endTime);
      });
      
      const conflictResults = await Promise.all(conflictPromises);
      const hasConflicts = conflictResults.some(result => result);
      
      if (hasConflicts) {
        setConflicts(['Booking conflicts detected']);
        toast({
          title: "Feil",
          description: "Det er konflikter med eksisterende bookinger. Vennligst velg andre tidspunkt.",
          variant: "destructive",
        });
        return;
      }
      
      // Process each selected slot
      for (const slot of selectedSlots) {
        const pricePerHour = 225; // Default price, should come from facility data
        const duration = slot.duration || 2;
        
        addItemToCart({
          facilityId,
          facilityName,
          zoneId: slot.zoneId,
          date: slot.date,
          timeSlot: slot.timeSlot,
          duration,
          pricePerHour,
          purpose: formData.purpose,
          eventType: convertActivityToEventType(formData.activityType),
          expectedAttendees: formData.attendees,
          organizationType: convertActorType(formData.actorType),
          specialRequirements: formData.additionalInfo || undefined,
          additionalServices: [],
          timeSlots: [slot],
          customerInfo: {
            name: '', // Will be filled later in checkout
            email: '',
            phone: '',
            organization: ''
          },
          pricing: {
            baseFacilityPrice: pricePerHour * duration,
            servicesPrice: 0,
            discounts: 0,
            vatAmount: 0,
            totalPrice: pricePerHour * duration
          }
        });
      }

      toast({
        title: "Lagt til i handlekurv",
        description: `${selectedSlots.length} tidspunkt lagt til i handlekurv`,
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
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke legge til i handlekurv",
        variant: "destructive",
      });
    }
  };

  const handleCompleteBooking = async () => {
    console.log('BookingForm: handleCompleteBooking called');

    try {
      // Check for conflicts first
      const conflictPromises = selectedSlots.map(slot => {
        const startTime = new Date(slot.date);
        const [hours, minutes] = slot.timeSlot.split(':').map(Number);
        startTime.setHours(hours, minutes, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + (slot.duration || 2));
        
        return checkForConflicts(slot.zoneId, startTime, endTime);
      });
      
      const conflictResults = await Promise.all(conflictPromises);
      const hasConflicts = conflictResults.some(result => result);
      
      if (hasConflicts) {
        setConflicts(['Booking conflicts detected']);
        toast({
          title: "Feil",
          description: "Det er konflikter med eksisterende bookinger. Vennligst velg andre tidspunkt.",
          variant: "destructive",
        });
        return;
      }
      
      // Create bookings for each selected slot
      const bookingPromises = selectedSlots.map(slot => {
        const startTime = new Date(slot.date);
        const [hours, minutes] = slot.timeSlot.split(':').map(Number);
        startTime.setHours(hours, minutes, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + (slot.duration || 2));
        
        return create({
          facility_id: facilityId,
          zone_id: slot.zoneId,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          purpose: formData.purpose,
          event_type: convertActivityToEventType(formData.activityType),
          expected_attendees: formData.attendees,
          special_requirements: formData.additionalInfo || undefined,
          status: 'pending'
        });
      });
      
      await Promise.all(bookingPromises);

      toast({
        title: "Reservasjon opprettet",
        description: `Booking opprettet for ${selectedSlots.length} tidspunkt`,
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
      console.error('Error completing booking:', error);
      toast({
        title: "Feil",
        description: "Kunne ikke opprette booking",
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
