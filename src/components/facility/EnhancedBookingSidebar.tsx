
import React, { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useBookingState } from "@/contexts/BookingStateContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";
import { SelectedSlotsSection } from "./sidebar/SelectedSlotsSection";
import { BookingDetailsSection } from "./sidebar/BookingDetailsSection";
import { ReservationCartSection } from "./sidebar/ReservationCartSection";

interface EnhancedBookingSidebarProps {
  facilityName: string;
  facilityId: string;
  selectedSlots?: SelectedTimeSlot[];
  onClearSlots?: () => void;
}

export function EnhancedBookingSidebar({
  facilityName,
  facilityId,
  selectedSlots = [],
  onClearSlots
}: EnhancedBookingSidebarProps) {
  const { items, removeFromCart, getTotalPrice, getItemCount } = useCart();
  const { state, actions, businessLogic } = useBookingState();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Sync external selectedSlots with internal state
  useEffect(() => {
    if (selectedSlots.length > 0) {
      actions.setSelectedSlots(selectedSlots);
    }
  }, [selectedSlots, actions]);

  const facilityCartItems = items.filter(item => item.facilityId === facilityId);
  const hasSelectedSlots = state.selectedSlots.length > 0;
  const hasCartItems = facilityCartItems.length > 0;

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const handleBookSlots = () => {
    if (hasSelectedSlots) {
      actions.setCurrentStep('booking');
    } else {
      actions.addBookingError('Velg minst ett tidspunkt før booking');
    }
  };

  const handleContinueBooking = () => {
    actions.setBookingInProgress(true);
    
    try {
      const success = actions.addToCartAndContinue(facilityId, facilityName);
      
      if (success) {
        if (onClearSlots) {
          onClearSlots();
        }
        actions.saveToStorage();
      }
    } catch (error) {
      actions.addBookingError('Feil ved opprettelse av booking');
    } finally {
      actions.setBookingInProgress(false);
    }
  };

  const handleClearSlots = () => {
    actions.clearSelectedSlots();
    if (onClearSlots) {
      onClearSlots();
    }
  };

  const handleFormFieldChange = (field: string, value: string) => {
    actions.updateFormData({ [field]: value });
  };

  const handleRemoveSelectedSlot = (zoneId: string, date: string, timeSlot: string) => {
    actions.removeSelectedSlot(zoneId, date, timeSlot);
  };

  return (
    <div className="space-y-4">
      {/* Auto-save indicator */}
      {state.isDirty && (
        <div className="text-xs text-gray-500 flex items-center gap-1 animate-fade-in">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          Lagrer automatisk...
        </div>
      )}

      {/* Selected Time Slots Section */}
      <SelectedSlotsSection
        selectedSlots={state.selectedSlots}
        isOpen={state.currentStep === 'selection'}
        onToggle={(open) => open ? actions.setCurrentStep('selection') : null}
        onRemoveSlot={handleRemoveSelectedSlot}
        onBookSlots={handleBookSlots}
        onClearSlots={handleClearSlots}
        totalPrice={businessLogic.calculateTotalPrice()}
        requiresApproval={businessLogic.requiresApproval()}
        canProceed={businessLogic.canProceedToNextStep()}
      />

      {/* Booking Details Section */}
      <BookingDetailsSection
        isOpen={state.currentStep === 'booking'}
        onToggle={(open) => open ? actions.setCurrentStep('booking') : null}
        formData={state.formData}
        validationErrors={state.validationErrors}
        bookingErrors={state.bookingErrors}
        onFormFieldChange={handleFormFieldChange}
        onContinueBooking={handleContinueBooking}
        onResetBooking={actions.resetBookingState}
        isBookingInProgress={state.isBookingInProgress}
        canProceed={businessLogic.canProceedToNextStep()}
        requiresApproval={businessLogic.requiresApproval()}
        isFormValid={businessLogic.isFormValid()}
      />

      {/* Cart Section */}
      <ReservationCartSection
        isOpen={state.currentStep === 'cart'}
        onToggle={(open) => open ? actions.setCurrentStep('cart') : null}
        cartItems={facilityCartItems}
        itemCount={getItemCount()}
        totalPrice={getTotalPrice()}
        onRemoveItem={removeFromCart}
        onProceedToCheckout={handleProceedToCheckout}
      />
    </div>
  );
}
