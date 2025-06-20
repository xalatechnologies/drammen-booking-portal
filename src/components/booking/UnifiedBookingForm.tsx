
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BookingStepBasicInfo } from './unified-steps/BookingStepBasicInfo';
import { BookingStepPricingDetails } from './unified-steps/BookingStepPricingDetails';
import { BookingStepTermsActions } from './unified-steps/BookingStepTermsActions';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { Zone } from './types';
import { ActorType } from '@/types/pricing';

interface UnifiedBookingFormProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones?: Zone[];
  onAddToCart?: (bookingData: any) => void;
  onCompleteBooking?: (bookingData: any) => void;
  onSlotsCleared?: () => void;
}

interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: ActorType;
  termsAccepted: boolean;
}

export function UnifiedBookingForm({
  selectedSlots,
  facilityId,
  facilityName,
  zones = [],
  onAddToCart,
  onCompleteBooking,
  onSlotsCleared
}: UnifiedBookingFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<BookingFormData>({
    purpose: '',
    attendees: 1,
    activityType: '',
    additionalInfo: '',
    actorType: 'private-person',
    termsAccepted: false
  });

  const steps = [
    { title: 'Grunnleggende informasjon', component: 'basic' },
    { title: 'Detaljer og prising', component: 'pricing' },
    { title: 'Vilkår og handlinger', component: 'terms' }
  ];

  const updateFormData = (updates: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0:
        return formData.purpose.trim() && formData.attendees > 0 && formData.activityType;
      case 1:
        return formData.actorType;
      case 2:
        return formData.termsAccepted;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        selectedSlots,
        facilityId,
        facilityName,
        formData
      });
    }
    if (onSlotsCleared) {
      onSlotsCleared();
    }
  };

  const handleCompleteBooking = () => {
    if (onCompleteBooking) {
      onCompleteBooking({
        selectedSlots,
        facilityId,
        facilityName,
        formData
      });
    }
  };

  const renderCurrentStep = () => {
    const baseProps = {
      formData,
      updateFormData
    };

    switch (currentStep) {
      case 0:
        return <BookingStepBasicInfo {...baseProps} />;
      case 1:
        return (
          <BookingStepPricingDetails
            {...baseProps}
            selectedSlots={selectedSlots}
            facilityId={facilityId}
            facilityName={facilityName}
            zones={zones}
          />
        );
      case 2:
        return (
          <BookingStepTermsActions
            {...baseProps}
            onAddToCart={handleAddToCart}
            onCompleteBooking={handleCompleteBooking}
          />
        );
      default:
        return null;
    }
  };

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
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Step Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 text-center text-sm font-medium ${
                  index === currentStep
                    ? 'text-blue-600'
                    : index < currentStep
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                {step.title}
              </div>
            ))}
          </div>
          <div className="flex">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 mx-1 rounded ${
                  index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Tilbake
          </Button>

          {currentStep < steps.length - 1 && (
            <Button
              onClick={handleNext}
              disabled={!canProceedToNext()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Neste
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
