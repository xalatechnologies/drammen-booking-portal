import { create } from 'zustand';
import { useUserStore } from './useUserStore';
import { useCartStore } from './useCartStore';
import { useLocationStore } from './useLocationStore';
import { useZoneStore } from './useZoneStore';
import { useNotificationStore } from './useNotificationStore';
import { useSettingsStore } from './useSettingsStore';
import { useActorStore } from './useActorStore';
import { useInvoiceStore } from './useInvoiceStore';
import { useMessageStore } from './useMessageStore';
import { useSubscriptionStore } from './useSubscriptionStore';
import { combineMiddleware, createLogger, createPerformanceMonitor } from '../middleware';

/**
 * Root store that combines all stores for easier access
 * Provides a single point of access for all stores in the application
 */
export const useRootStore = create<{
  // Store references
  userStore: ReturnType<typeof useUserStore.getState>;
  cartStore: ReturnType<typeof useCartStore.getState>;
  locationStore: ReturnType<typeof useLocationStore.getState>;
  zoneStore: ReturnType<typeof useZoneStore.getState>;
  notificationStore: ReturnType<typeof useNotificationStore.getState>;
  settingsStore: ReturnType<typeof useSettingsStore.getState>;
  actorStore: ReturnType<typeof useActorStore.getState>;
  invoiceStore: ReturnType<typeof useInvoiceStore.getState>;
  messageStore: ReturnType<typeof useMessageStore.getState>;
  subscriptionStore: ReturnType<typeof useSubscriptionStore.getState>;
  
  // Root store actions
  resetAllStores: () => void;
  hydrateAllStores: () => Promise<void>;
}>(
  // Apply middleware for development tools
  combineMiddleware(
    createLogger('RootStore'),
    createPerformanceMonitor({ storeName: 'RootStore' })
  )(
    (set, get) => ({
      // Store references
      userStore: useUserStore.getState(),
      cartStore: useCartStore.getState(),
      locationStore: useLocationStore.getState(),
      zoneStore: useZoneStore.getState(),
      notificationStore: useNotificationStore.getState(),
      settingsStore: useSettingsStore.getState(),
      actorStore: useActorStore.getState(),
      invoiceStore: useInvoiceStore.getState(),
      messageStore: useMessageStore.getState(),
      subscriptionStore: useSubscriptionStore.getState(),
      
      // Root store actions
      resetAllStores: () => {
        // Reset all stores to their initial state
        useUserStore.getState().reset();
        useCartStore.getState().reset();
        useLocationStore.getState().reset();
        useZoneStore.getState().reset();
        useNotificationStore.getState().reset();
        useActorStore.getState().reset();
        useInvoiceStore.getState().reset();
        useMessageStore.getState().reset();
        useSubscriptionStore.getState().reset();
        
        // Update root store references to the reset stores
        set({
          userStore: useUserStore.getState(),
          cartStore: useCartStore.getState(),
          locationStore: useLocationStore.getState(),
          zoneStore: useZoneStore.getState(),
          notificationStore: useNotificationStore.getState(),
          settingsStore: useSettingsStore.getState(),
          actorStore: useActorStore.getState(),
          invoiceStore: useInvoiceStore.getState(),
          messageStore: useMessageStore.getState(),
          subscriptionStore: useSubscriptionStore.getState(),
        });
      },
      
      hydrateAllStores: async () => {
        // Get current user session
        const { data: { session } } = await useUserStore.getState().getSession();
        
        if (session) {
          const userId = session.user.id;
          
          // Hydrate stores with user-specific data in parallel
          await Promise.all([
            useUserStore.getState().getCurrentUser(),
            useCartStore.getState().fetchCart(userId),
            useNotificationStore.getState().fetchNotifications(userId),
            useActorStore.getState().fetchUserActors(userId),
            useMessageStore.getState().getUnreadCount(userId),
            useSubscriptionStore.getState().fetchActiveSubscription(userId)
          ]);
          
          // Setup realtime subscriptions
          useNotificationStore.getState().setupRealtimeSubscription(userId);
          useMessageStore.getState().setupRealtimeSubscription(userId);
        }
        
        // Hydrate global stores (not user-specific)
        await Promise.all([
          useLocationStore.getState().fetchList(),
          useZoneStore.getState().fetchList(),
          useSettingsStore.getState().syncWithServer()
        ]);
        
        // Update root store references
        set({
          userStore: useUserStore.getState(),
          cartStore: useCartStore.getState(),
          locationStore: useLocationStore.getState(),
          zoneStore: useZoneStore.getState(),
          notificationStore: useNotificationStore.getState(),
          settingsStore: useSettingsStore.getState(),
          actorStore: useActorStore.getState(),
          invoiceStore: useInvoiceStore.getState(),
          messageStore: useMessageStore.getState(),
          subscriptionStore: useSubscriptionStore.getState(),
        });
      }
    })
  )
);

/**
 * Custom hook for accessing the root store
 * Provides type-safe access to all stores and their actions
 */
export function useStore() {
  const rootStore = useRootStore();
  
  // Initialize all stores on first mount
  React.useEffect(() => {
    rootStore.hydrateAllStores();
    
    // Cleanup function
    return () => {
      // Remove realtime subscriptions when component unmounts
      rootStore.notificationStore.removeRealtimeSubscription();
      rootStore.messageStore.removeRealtimeSubscription();
    };
  }, []);
  
  return rootStore;
}

// Import React at the top
import React from 'react';
