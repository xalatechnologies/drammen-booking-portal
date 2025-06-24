
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import { useCart } from '@/contexts/CartContext';
import { useAuthStore } from '@/stores/useAuthStore';
import { CheckoutHeader } from '@/components/checkout/CheckoutHeader';
import { EmptyCart } from '@/components/checkout/EmptyCart';
import { ReviewStep } from '@/components/checkout/ReviewStep';
import { LoginSelectionModal } from '@/components/auth/LoginSelectionModal';
import { useToast } from '@/hooks/use-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'individual' | 'all' | null>(null);

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

  const handleSendToApproval = (reservationId?: string) => {
    if (!isAuthenticated) {
      setPendingAction(reservationId ? 'individual' : 'all');
      setShowLoginModal(true);
      return;
    }

    // Simulate sending to approval
    const message = reservationId 
      ? 'Reservasjon sendt til godkjenning'
      : 'Alle reservasjoner sendt til godkjenning';
    
    toast({
      title: 'Sendt til godkjenning',
      description: message,
    });

    setTimeout(() => {
      navigate('/bookings');
    }, 1500);
  };

  const handleLoginMethodSelect = (method: 'id-porten' | 'feide' | 'municipal') => {
    console.log('Selected login method:', method);
    setShowLoginModal(false);
    // Here you would normally handle the actual login
    // For now, we'll just proceed with the approval action
    if (pendingAction) {
      handleSendToApproval(pendingAction === 'individual' ? items[0]?.id : undefined);
      setPendingAction(null);
    }
  };

  const handleEmptyCart = () => {
    clearCart();
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

          <div className="w-full">
            <ReviewStep
              items={items}
              onEditReservation={handleEditReservation}
              onRemoveReservation={handleRemoveReservation}
              onSendToApproval={handleSendToApproval}
              onEmptyCart={handleEmptyCart}
            />
          </div>
        </div>
      </div>
      <GlobalFooter />

      <LoginSelectionModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginMethodSelect={handleLoginMethodSelect}
      />
    </div>
  );
};

export default CheckoutPage;
