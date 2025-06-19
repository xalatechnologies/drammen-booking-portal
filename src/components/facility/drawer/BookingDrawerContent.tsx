
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType as PricingActorType, BookingType } from '@/types/pricing';
import { ActorType as CartActorType } from '@/types/cart';
import { Zone } from '@/components/booking/types';
import { BookingActivityStep } from './BookingActivityStep';
import { BookingPricingStep } from './BookingPricingStep';
import { BookingDetailsStep } from './BookingDetailsStep';

interface FormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  purpose: string;
  notes: string;
}

interface BookingDrawerContentProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones?: Zone[];
  onSlotsCleared?: () => void;
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

const convertToDialerFormat = (cartType: CartActorType): PricingActorType => {
  switch (cartType) {
    case 'private': return 'private-person';
    case 'business': return 'private-firma';
    case 'organization': return 'lag-foreninger';
    default: return 'private-person';
  }
};

export function BookingDrawerContent({
  selectedSlots,
  facilityId,
  facilityName,
  zones = [],
  onSlotsCleared
}: BookingDrawerContentProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'activity' | 'pricing' | 'details'>('activity');
  const [pricingActorType, setPricingActorType] = useState<PricingActorType>('private-person');
  const [activityType, setActivityType] = useState<string>('');
  const [attendees, setAttendees] = useState<number>(1);
  const [purpose, setPurpose] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    purpose: '',
    notes: ''
  });

  // Log selected slots for debugging
  useEffect(() => {
    console.log('BookingDrawerContent - Received selected slots:', selectedSlots);
  }, [selectedSlots]);

  // Auto-determine booking type based on selected slots
  const bookingType: BookingType = useMemo(() => {
    if (selectedSlots.length <= 1) {
      return 'engangs';
    }
    
    // Check if slots are recurring pattern or just multiple single bookings
    return selectedSlots.length > 3 ? 'fastlan' : 'engangs';
  }, [selectedSlots]);

  // Reset form state to initial values
  const resetFormState = () => {
    setStep('activity');
    setPricingActorType('private-person');
    setActivityType('');
    setAttendees(1);
    setPurpose('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      organization: '',
      purpose: '',
      notes: ''
    });
  };

  const handleSubmit = () => {
    // Validate that we have selected slots
    if (selectedSlots.length === 0) {
      console.error('No slots selected for booking');
      return;
    }

    // Convert actor type for navigation state
    const cartActorType = convertActorType(pricingActorType);

    // Navigate to booking confirmation
    navigate(`/booking/${facilityId}/confirm`, {
      state: {
        selectedSlots,
        formData: {
          ...formData,
          purpose
        },
        actorType: cartActorType,
        bookingType,
        requiresApproval: ['lag-foreninger', 'paraply'].includes(pricingActorType)
      }
    });
  };

  const handleAddToCart = () => {
    // Reset form state after adding to cart
    resetFormState();
    
    // Clear selected slots in parent component if callback provided
    if (onSlotsCleared) {
      onSlotsCleared();
    }

    console.log('Added slots to cart and reset state');
  };

  // Show message if no slots are selected
  if (selectedSlots.length === 0) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Ingen tidspunkt valgt
        </h3>
        <p className="text-gray-600">
          Velg tidspunkt i kalenderen først for å starte booking prosessen.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {step === 'activity' ? (
        <BookingActivityStep
          selectedSlots={selectedSlots}
          facilityName={facilityName}
          zones={zones}
          activityType={activityType}
          onActivityTypeChange={setActivityType}
          attendees={attendees}
          onAttendeesChange={setAttendees}
          purpose={purpose}
          onPurposeChange={setPurpose}
          onNext={() => setStep('pricing')}
        />
      ) : step === 'pricing' ? (
        <BookingPricingStep
          selectedSlots={selectedSlots}
          facilityId={facilityId}
          facilityName={facilityName}
          zones={zones}
          actorType={pricingActorType}
          onActorTypeChange={setPricingActorType}
          bookingType={bookingType}
          onBack={() => setStep('activity')}
          onComplete={handleSubmit}
          onAddToCart={handleAddToCart}
        />
      ) : (
        <BookingDetailsStep
          formData={formData}
          onFormDataChange={setFormData}
          onBack={() => setStep('pricing')}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
