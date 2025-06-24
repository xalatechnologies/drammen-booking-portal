
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutHeader } from '@/components/checkout/CheckoutHeader';
import { CheckoutBreadcrumb } from '@/components/checkout/CheckoutBreadcrumb';
import { ProgressIndicator } from '@/components/checkout/ProgressIndicator';
import { ContactDetailsStep } from '@/components/checkout/ContactDetailsStep';
import { ReviewStep } from '@/components/checkout/ReviewStep';
import { ConfirmationStep } from '@/components/checkout/ConfirmationStep';
import { EmptyCart } from '@/components/checkout/EmptyCart';
import { useCartStore } from '@/stores/useCartStore';

type CheckoutStep = 'contact' | 'review' | 'confirmation';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact');
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [bookingReference, setBookingReference] = useState<string>('');
  const navigate = useNavigate();

  // Convert cart items to match expected format
  const cartItems = items.map(item => ({
    id: item.id,
    facilityId: item.facilityId,
    facilityName: item.facilityName,
    zoneId: item.zoneId,
    startTime: item.startTime,
    endTime: item.endTime,
    duration: item.duration,
    price: item.price,
    purpose: item.purpose,
    expectedAttendees: item.expectedAttendees,
    actorType: item.actorType,
    eventType: item.eventType,
    ageGroup: item.ageGroup,
    contactName: item.contactName,
    contactEmail: item.contactEmail,
    contactPhone: item.contactPhone,
    // Add missing properties with defaults
    organizationType: 'individual' as const,
    additionalServices: [],
    timeSlots: [],
    pricing: {
      basePrice: item.price,
      totalPrice: item.price,
      currency: 'NOK'
    },
    specialRequirements: '',
    internalNotes: '',
    createdAt: new Date().toISOString()
  }));

  const handleContactSubmit = (data: typeof contactData) => {
    setContactData(data);
    setCurrentStep('review');
  };

  const handleReviewSubmit = async () => {
    try {
      // Generate booking reference
      const reference = `BOK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setBookingReference(reference);
      
      console.log('Processing booking:', {
        contactData,
        items: cartItems,
        reference
      });
      
      // Clear cart after successful booking
      clearCart();
      setCurrentStep('confirmation');
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  const handleBackToFacilities = () => {
    navigate('/');
  };

  if (cartItems.length === 0 && currentStep !== 'confirmation') {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutHeader />
      <CheckoutBreadcrumb currentStep={currentStep} />
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        <ProgressIndicator currentStep={currentStep} />
        
        <div className="mt-8">
          {currentStep === 'contact' && (
            <ContactDetailsStep
              onSubmit={handleContactSubmit}
              initialData={contactData}
            />
          )}
          
          {currentStep === 'review' && (
            <ReviewStep
              contactData={contactData}
              items={cartItems}
              onSubmit={handleReviewSubmit}
              onBack={() => setCurrentStep('contact')}
            />
          )}
          
          {currentStep === 'confirmation' && (
            <ConfirmationStep
              bookingReference={bookingReference}
              onBackToFacilities={handleBackToFacilities}
            />
          )}
        </div>
      </div>
    </div>
  );
}
