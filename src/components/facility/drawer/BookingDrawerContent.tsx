
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType, BookingType } from '@/types/pricing';
import { Zone } from '@/components/booking/types';
import { useCart } from '@/contexts/CartContext';
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
}

export function BookingDrawerContent({
  selectedSlots,
  facilityId,
  facilityName,
  zones = []
}: BookingDrawerContentProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [step, setStep] = useState<'activity' | 'pricing' | 'details'>('activity');
  const [actorType, setActorType] = useState<ActorType>('private-person');
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
    // For now, if multiple slots, assume it's fastlån
    // TODO: Could be enhanced to detect actual recurring patterns
    return selectedSlots.length > 3 ? 'fastlan' : 'engangs';
  }, [selectedSlots]);

  const handleSubmit = () => {
    // Validate that we have selected slots
    if (selectedSlots.length === 0) {
      console.error('No slots selected for booking');
      return;
    }

    // Add selected slots to cart when booking is completed
    selectedSlots.forEach(slot => {
      const zone = zones.find(z => z.id === slot.zoneId);
      addToCart({
        facilityId,
        facilityName,
        zoneId: slot.zoneId,
        date: slot.date,
        timeSlot: slot.timeSlot,
        duration: slot.duration || 2, // Default to 2 hours if not specified
        pricePerHour: zone?.pricePerHour || 450 // Use zone price or default
      });
    });

    console.log('Added slots to cart:', selectedSlots);

    // Navigate to booking confirmation
    navigate(`/booking/${facilityId}/confirm`, {
      state: {
        selectedSlots,
        formData: {
          ...formData,
          purpose
        },
        actorType,
        bookingType,
        requiresApproval: ['lag-foreninger', 'paraply'].includes(actorType)
      }
    });
  };

  const handleAddToCart = () => {
    // Add selected slots to cart
    selectedSlots.forEach(slot => {
      const zone = zones.find(z => z.id === slot.zoneId);
      addToCart({
        facilityId,
        facilityName,
        zoneId: slot.zoneId,
        date: slot.date,
        timeSlot: slot.timeSlot,
        duration: slot.duration || 2,
        pricePerHour: zone?.pricePerHour || 450
      });
    });

    console.log('Added slots to cart:', selectedSlots);
    
    // Navigate to cart or show success message
    navigate('/checkout');
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
          actorType={actorType}
          onActorTypeChange={setActorType}
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
