
import { useAuthStore } from '@/stores/useAuthStore';
import { useCartStore } from '@/stores/useCartStore';
import { useBookingStore } from '@/stores/useBookingStore';
import { useFacilityStore } from '@/stores/useFacilityStore';
import { useUIStore } from '@/stores/useUIStore';
import { useZoneStore } from '@/stores/useZoneStore';
import { useAdditionalServicesStore } from '@/stores/useAdditionalServicesStore';

export function useGlobalState() {
  const auth = useAuthStore();
  const cart = useCartStore();
  const booking = useBookingStore();
  const facility = useFacilityStore();
  const ui = useUIStore();
  const zone = useZoneStore();
  const additionalServices = useAdditionalServicesStore();

  // Global reset function
  const resetAllStores = () => {
    auth.logout();
    cart.clearCart();
    booking.resetBooking();
    facility.reset();
    zone.reset();
    additionalServices.reset();
    ui.clearNotifications();
  };

  // Global loading state
  const isGlobalLoading = ui.globalLoading || facility.isLoading || booking.isSubmitting || zone.isLoading || additionalServices.isLoading;

  return {
    // Store instances
    auth,
    cart,
    booking,
    facility,
    ui,
    zone,
    additionalServices,
    
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
    currentZone: zone.currentZone,
    notifications: ui.notifications
  };
}
