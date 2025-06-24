
import React from 'react';
import { BookingForm } from './BookingForm';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from './types';

interface UnifiedBookingFormProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones?: Zone[];
  onAddToCart?: (bookingData: any) => void;
  onCompleteBooking?: (bookingData: any) => void;
  onSlotsCleared?: () => void;
}

export function UnifiedBookingForm(props: UnifiedBookingFormProps) {
  return <BookingForm {...props} />;
}
