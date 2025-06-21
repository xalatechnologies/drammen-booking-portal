
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import { useCart } from '@/contexts/CartContext';
import { useAuthStore } from '@/stores/useAuthStore';
import { CheckoutHeader } from '@/components/checkout/CheckoutHeader';
import { ProgressIndicator } from '@/components/checkout/ProgressIndicator';
import { EmptyCart } from '@/components/checkout/EmptyCart';
import { ReviewStep } from '@/components/checkout/ReviewStep';
import { LoginStep } from '@/components/checkout/LoginStep';
import { ConfirmationStep } from '@/components/checkout/ConfirmationStep';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuthStore();
  const [step, setStep] = useState<'review' | 'login' | 'confirm'>('review');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    purpose: '',
    notes: '',
    customerType: 'private' as 'private' | 'business' | 'organization'
  });

  const handleEditReservation = (reservationId: string) => {
    const reservation = items.find(item => item.id === reservationId);
    if (reservation) {
      sessionStorage.setItem('editing_reservation', JSON.stringify(reservation));
      navigate(`/facility/${reservation.facilityId}`);
    }
  };

  const handleRemoveReservation = (reservationId: string) => {
    removeFromCart(reservationId);
  };

  const handleSubmit = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    clearCart();
    navigate('/bookings');
  };

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleContinueFromReview = () => {
    if (isAuthenticated) {
      setStep('confirm');
    } else {
      setStep('login');
    }
  };

  const handleContinueFromLogin = () => {
    setStep('confirm');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <GlobalHeader />
        <div className="flex-grow flex items-center justify-center">
          <EmptyCart onNavigateHome={() => navigate('/')} />
        </div>
        <GlobalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GlobalHeader />
      <div className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <CheckoutHeader onBack={() => navigate(-1)} />
          <ProgressIndicator currentStep={step} isAuthenticated={isAuthenticated} />

          <div className="w-full">
            {step === 'review' && (
              <ReviewStep
                items={items}
                onEditReservation={handleEditReservation}
                onRemoveReservation={handleRemoveReservation}
                onContinue={handleContinueFromReview}
              />
            )}

            {step === 'login' && !isAuthenticated && (
              <LoginStep
                onBack={() => setStep('review')}
                onContinue={handleContinueFromLogin}
              />
            )}

            {step === 'confirm' && (
              <ConfirmationStep
                formData={formData}
                onBack={() => isAuthenticated ? setStep('review') : setStep('login')}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default CheckoutPage;
