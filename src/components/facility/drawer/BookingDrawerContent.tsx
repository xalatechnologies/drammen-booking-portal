
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
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
  const [purpose, setPurpose] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    purpose: '',
    notes: ''
  });

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
          onBookingTypeChange={() => {}} // No longer needed as it's auto-determined
          purpose={purpose}
          onPurposeChange={setPurpose}
          calculation={null} // Will be calculated in IntegratedPriceCalculation
          totalPrice={0} // Will be calculated in IntegratedPriceCalculation
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
