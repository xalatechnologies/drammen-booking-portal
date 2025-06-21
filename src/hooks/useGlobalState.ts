
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import { useBookingStore } from '@/stores/useBookingStore';
import { useFacilityStore } from '@/stores/useFacilityStore';
import { useUIStore } from '@/stores/useUIStore';

export function useGlobalState() {
  const auth = useAuthStore();
  const cart = useCartStore();
  const booking = useBookingStore();
  const facility = useFacilityStore();
  const ui = useUIStore();

  // Global reset function
  const resetAllStores = () => {
    auth.logout();
    cart.clearCart();
    booking.resetBooking();
    facility.reset();
    ui.clearNotifications();
  };

  // Global loading state
  const isGlobalLoading = ui.globalLoading || facility.isLoading || booking.isSubmitting;

  return {
    // Store instances
    auth,
    cart,
    booking,
    facility,
    ui,
    
    // Global actions
    resetAllStores,
    isGlobalLoading,
    
    // Quick access to common states
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    cartItems: cart.items,
    cartTotal: cart.totalPrice,
    selectedSlots: booking.selectedSlots,
    currentFacility: facility.currentFacility,
    notifications: ui.notifications
  };
}
