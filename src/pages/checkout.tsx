
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import { useCart } from '@/contexts/CartContext';
import { useAuthStore } from '@/stores/useAuthStore';
import { ProgressIndicator } from '@/components/checkout/ProgressIndicator';
import { EmptyCart } from '@/components/checkout/EmptyCart';
import { ReviewStep } from '@/components/checkout/ReviewStep';
import { LoginStep } from '@/components/checkout/LoginStep';
import { ConfirmationStep } from '@/components/checkout/ConfirmationStep';
import { OrderSummary } from '@/components/checkout/OrderSummary';

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <GlobalHeader />
        <div className="flex-grow flex items-center justify-center">
          <EmptyCart onNavigateHome={() => navigate('/')} />
        </div>
        <GlobalFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <GlobalHeader />
      <div className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Compact Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Fullfør reservasjon</h1>
            <p className="text-gray-600">
              Gjennomgå og bekreft dine reservasjoner
            </p>
          </div>

          <ProgressIndicator currentStep={step} isAuthenticated={isAuthenticated} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
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

            <div className="xl:col-span-1">
              <OrderSummary items={items} customerType={formData.customerType} />
            </div>
          </div>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
};

export default CheckoutPage;
