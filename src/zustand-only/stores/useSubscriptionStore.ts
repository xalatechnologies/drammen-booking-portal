import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Subscription, SubscriptionType } from '../types/models';

interface SubscriptionState {
  // State
  subscriptions: Subscription[];
  activeSubscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSubscriptions: (userId: string) => Promise<void>;
  fetchActiveSubscription: (userId: string) => Promise<Subscription | null>;
  createSubscription: (data: Partial<Subscription>) => Promise<Subscription | null>;
  cancelSubscription: (id: string) => Promise<boolean>;
  updatePaymentMethod: (subscriptionId: string, paymentMethodId: string) => Promise<boolean>;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  // Initial state
  subscriptions: [],
  activeSubscription: null,
  isLoading: false,
  error: null,
  
  // Actions
  fetchSubscriptions: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      
      set({ 
        subscriptions: data as Subscription[],
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      set({ 
        error: (error as Error).message || 'Failed to fetch subscriptions', 
        isLoading: false 
      });
    }
  },
  
  fetchActiveSubscription: async (userId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('userId', userId)
        .eq('status', 'active')
        .order('createdAt', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        throw error;
      }
      
      const activeSubscription = data as Subscription | null;
      
      set({ 
        activeSubscription,
        isLoading: false 
      });
      
      return activeSubscription;
    } catch (error) {
      console.error('Error fetching active subscription:', error);
      set({ 
        error: (error as Error).message || 'Failed to fetch active subscription', 
        isLoading: false 
      });
      return null;
    }
  },
  
  createSubscription: async (data: Partial<Subscription>) => {
    set({ isLoading: true, error: null });
    
    try {
      // Call subscription creation edge function
      const { data: subscriptionData, error } = await supabase.functions.invoke('create-subscription', {
        body: data
      });
      
      if (error) throw error;
      
      const newSubscription = subscriptionData.subscription as Subscription;
      
      set(state => ({
        subscriptions: [newSubscription, ...state.subscriptions],
        activeSubscription: newSubscription,
        isLoading: false
      }));
      
      return newSubscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      set({ 
        error: (error as Error).message || 'Failed to create subscription', 
        isLoading: false 
      });
      return null;
    }
  },
  
  cancelSubscription: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Call subscription cancellation edge function
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        body: { subscriptionId: id }
      });
      
      if (error) throw error;
      
      if (data.success) {
        // Update subscription in state
        set(state => {
          const updatedSubscriptions = state.subscriptions.map(sub =>
            sub.id === id ? { ...sub, status: 'cancelled', cancelledAt: new Date().toISOString() } : sub
          );
          
          return {
            subscriptions: updatedSubscriptions,
            activeSubscription: state.activeSubscription?.id === id ? null : state.activeSubscription,
            isLoading: false
          };
        });
        
        return true;
      } else {
        throw new Error(data.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      set({ 
        error: (error as Error).message || 'Failed to cancel subscription', 
        isLoading: false 
      });
      return false;
    }
  },
  
  updatePaymentMethod: async (subscriptionId: string, paymentMethodId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      // Call update payment method edge function
      const { data, error } = await supabase.functions.invoke('update-payment-method', {
        body: { 
          subscriptionId,
          paymentMethodId
        }
      });
      
      if (error) throw error;
      
      if (data.success) {
        // Refresh subscriptions to get updated data
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await get().fetchSubscriptions(session.user.id);
        }
        
        set({ isLoading: false });
        return true;
      } else {
        throw new Error(data.message || 'Failed to update payment method');
      }
    } catch (error) {
      console.error('Error updating payment method:', error);
      set({ 
        error: (error as Error).message || 'Failed to update payment method', 
        isLoading: false 
      });
      return false;
    }
  },
  
  clearError: () => {
    set({ error: null });
  }
}));

// Custom hook for subscription operations
export function useSubscription() {
  const subscriptionStore = useSubscriptionStore();
  const { subscriptions, activeSubscription } = subscriptionStore;
  
  // Initialize subscription data for current user
  React.useEffect(() => {
    const fetchUserSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await subscriptionStore.fetchActiveSubscription(session.user.id);
      }
    };
    
    fetchUserSubscription();
  }, []);
  
  // Check if user has an active subscription
  const hasActiveSubscription = activeSubscription !== null;
  
  // Check subscription type
  const hasSubscriptionType = (type: SubscriptionType): boolean => {
    return activeSubscription?.type === type;
  };
  
  // Check if subscription is about to expire
  const isSubscriptionExpiringSoon = (): boolean => {
    if (!activeSubscription || !activeSubscription.currentPeriodEnd) return false;
    
    const expiryDate = new Date(activeSubscription.currentPeriodEnd);
    const now = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysUntilExpiry <= 7; // Expiring within 7 days
  };
  
  // Get subscription history
  const subscriptionHistory = subscriptions.map(subscription => ({
    ...subscription,
    formattedStartDate: new Date(subscription.createdAt).toLocaleDateString(),
    formattedEndDate: subscription.cancelledAt 
      ? new Date(subscription.cancelledAt).toLocaleDateString() 
      : subscription.currentPeriodEnd 
        ? new Date(subscription.currentPeriodEnd).toLocaleDateString() 
        : 'Active'
  }));
  
  return {
    ...subscriptionStore,
    hasActiveSubscription,
    hasSubscriptionType,
    isSubscriptionExpiringSoon,
    subscriptionHistory,
    
    // Enhanced methods
    subscribe: async (type: SubscriptionType, paymentMethodId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'User not authenticated' };
      }
      
      const result = await subscriptionStore.createSubscription({
        userId: session.user.id,
        type,
        paymentMethodId,
        status: 'active'
      });
      
      return { 
        success: !!result, 
        subscription: result,
        error: result ? undefined : subscriptionStore.error
      };
    }
  };
}

// Import React at the top
import React from 'react';
