
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
import { ActorType, BookingType } from '@/types/pricing';
import { Zone } from '@/components/booking/types';
import { BookingSummaryStep } from './BookingSummaryStep';
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
  const [step, setStep] = useState<'summary' | 'details'>('summary');
  const [actorType, setActorType] = useState<ActorType>('private-person');
  const [bookingType, setBookingType] = useState<BookingType>('engangs');
  const [purpose, setPurpose] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    purpose: '',
    notes: ''
  });

  // Calculate pricing for all selected slots with current actor and booking type
  const { calculation } = usePriceCalculation({
    facilityId,
    zoneId: selectedSlots[0]?.zoneId,
    startDate: selectedSlots[0]?.date,
    customerType: actorType as any, // For backwards compatibility
    timeSlot: selectedSlots[0]?.timeSlot
  });

  const totalPrice = calculation ? calculation.finalPrice * selectedSlots.length : 0;

  const handleSubmit = () => {
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
        totalPrice,
        requiresApproval: calculation?.requiresApproval
      }
    });
  };

  return (
    <div className="p-6 space-y-8">
      {step === 'summary' ? (
        <BookingSummaryStep
          selectedSlots={selectedSlots}
          facilityName={facilityName}
          zones={zones}
          actorType={actorType}
          onActorTypeChange={setActorType}
          bookingType={bookingType}
          onBookingTypeChange={setBookingType}
          purpose={purpose}
          onPurposeChange={setPurpose}
          calculation={calculation}
          totalPrice={totalPrice}
          onContinue={() => setStep('details')}
        />
      ) : (
        <BookingDetailsStep
          formData={formData}
          onFormDataChange={setFormData}
          onBack={() => setStep('summary')}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
