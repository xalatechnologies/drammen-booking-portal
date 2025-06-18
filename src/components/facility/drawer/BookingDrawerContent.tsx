
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { usePriceCalculation } from '@/hooks/usePriceCalculation';
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
}

export function BookingDrawerContent({
  selectedSlots,
  facilityId,
  facilityName
}: BookingDrawerContentProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'summary' | 'details'>('summary');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    purpose: '',
    notes: ''
  });

  // Calculate pricing for all selected slots
  const { calculation } = usePriceCalculation({
    facilityId,
    zoneId: selectedSlots[0]?.zoneId,
    startDate: selectedSlots[0]?.date,
    customerType: 'private',
    timeSlot: selectedSlots[0]?.timeSlot
  });

  const totalPrice = calculation ? calculation.finalPrice * selectedSlots.length : 0;

  const handleSubmit = () => {
    // Navigate to booking confirmation
    navigate(`/booking/${facilityId}/confirm`, {
      state: {
        selectedSlots,
        formData,
        totalPrice
      }
    });
  };

  return (
    <div className="p-4 space-y-6">
      {step === 'summary' ? (
        <BookingSummaryStep
          selectedSlots={selectedSlots}
          facilityName={facilityName}
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
