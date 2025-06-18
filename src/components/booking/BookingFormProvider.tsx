
import React, { createContext, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingFormSchema, BookingFormValues } from './formSchema';
import { BookingStep } from './types';

interface BookingFormContextType {
  form: ReturnType<typeof useForm<BookingFormValues>>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
}

const BookingFormContext = createContext<BookingFormContextType | null>(null);

export const useBookingForm = () => {
  const context = useContext(BookingFormContext);
  if (!context) {
    throw new Error('useBookingForm must be used within BookingFormProvider');
  }
  return context;
};

interface BookingFormProviderProps {
  children: React.ReactNode;
}

export function BookingFormProvider({ children }: BookingFormProviderProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      bookingMode: 'one-time',
      customerType: 'private',
      date: new Date(),
      timeSlot: "",
      zoneId: "",
      purpose: "",
      eventType: 'other',
      attendees: 1,
      ageGroup: 'mixed',
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      organization: "",
      specialServices: []
    },
    mode: 'onChange'
  });

  const value = {
    form,
    currentStep,
    setCurrentStep,
    isSubmitting,
    setIsSubmitting,
    termsAccepted,
    setTermsAccepted
  };

  return (
    <BookingFormContext.Provider value={value}>
      {children}
    </BookingFormContext.Provider>
  );
}
