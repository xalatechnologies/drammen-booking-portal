
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
    facilityName: item.facilityName,
    price: item.price,
    date: new Date(item.startTime),
    timeSlot: `${item.startTime} - ${item.endTime}`,
    pricePerHour: item.price
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

  const handleBack = () => {
    navigate(-1);
  };

  if (cartItems.length === 0 && currentStep !== 'confirmation') {
    return <EmptyCart onNavigateHome={handleBackToFacilities} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CheckoutHeader onBack={handleBack} />
      <CheckoutBreadcrumb currentStep={currentStep} />
      
      <div className="max-w-4xl mx-auto py-8 px-4">
        <ProgressIndicator currentStep={currentStep} />
        
        <div className="mt-8">
          {currentStep === 'contact' && (
            <ContactDetailsStep
              onNext={handleContactSubmit}
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
              reference={bookingReference}
              onBackToFacilities={handleBackToFacilities}
            />
          )}
        </div>
      </div>
    </div>
  );
}
