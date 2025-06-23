import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { Notification, NotificationType } from '../types/models';
import { RealtimeChannel } from '@supabase/supabase-js';

interface NotificationState {
  // State
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  subscription: RealtimeChannel | null;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  startRealTimeSubscription: () => void;
  stopRealTimeSubscription: () => void;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      subscription: null,
      
      // Actions
      fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Get current user
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            throw new Error('User not authenticated');
          }
          
          // Get user's notifications
          const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('userId', session.user.id)
            .order('createdAt', { ascending: false });
          
          if (error) throw error;
          
          const notifications = data as Notification[];
          const unreadCount = notifications.filter(n => !n.readAt).length;
          
          set({ 
            notifications,
            unreadCount,
            isLoading: false 
          });
        } catch (error) {
          console.error('Error fetching notifications:', error);
          set({ 
            error: (error as Error).message || 'Failed to fetch notifications', 
            isLoading: false 
          });
        }
      },
      
      markAsRead: async (id) => {
        try {
          const { error } = await supabase
            .from('notifications')
            .update({ 
              readAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
            .eq('id', id);
          
          if (error) throw error;
          
          set(state => {
            const updatedNotifications = state.notifications.map(notification =>
              notification.id === id 
                ? { ...notification, readAt: new Date().toISOString() } 
                : notification
            );
            
            return {
              notifications: updatedNotifications,
              unreadCount: updatedNotifications.filter(n => !n.readAt).length
            };
          });
        } catch (error) {
          console.error('Error marking notification as read:', error);
          set({ error: (error as Error).message || 'Failed to mark notification as read' });
        }
      },
      
      markAllAsRead: async () => {
        try {
          // Get current user
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            throw new Error('User not authenticated');
          }
          
          const { error } = await supabase
            .from('notifications')
            .update({ 
              readAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
            .eq('userId', session.user.id)
            .is('readAt', null);
          
          if (error) throw error;
          
          set(state => {
            const updatedNotifications = state.notifications.map(notification =>
              notification.readAt ? notification : { ...notification, readAt: new Date().toISOString() }
            );
            
            return {
              notifications: updatedNotifications,
              unreadCount: 0
            };
          });
        } catch (error) {
          console.error('Error marking all notifications as read:', error);
          set({ error: (error as Error).message || 'Failed to mark all notifications as read' });
        }
      },
      
      deleteNotification: async (id) => {
        try {
          const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);
          
          if (error) throw error;
          
          set(state => {
            const updatedNotifications = state.notifications.filter(
              notification => notification.id !== id
            );
            
            return {
              notifications: updatedNotifications,
              unreadCount: updatedNotifications.filter(n => !n.readAt).length
            };
          });
        } catch (error) {
          console.error('Error deleting notification:', error);
          set({ error: (error as Error).message || 'Failed to delete notification' });
        }
      },
      
      startRealTimeSubscription: () => {
        // Stop any existing subscription
        get().stopRealTimeSubscription();
        
        try {
          // Get current user
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
              throw new Error('User not authenticated');
            }
            
            // Create a new subscription
            const subscription = supabase
              .channel('notifications')
              .on(
                'postgres_changes',
                {
                  event: 'INSERT',
                  schema: 'public',
                  table: 'notifications',
                  filter: `userId=eq.${session.user.id}`
                },
                (payload) => {
                  // Handle new notification
                  const newNotification = payload.new as Notification;
                  
                  set(state => ({
                    notifications: [newNotification, ...state.notifications],
                    unreadCount: state.unreadCount + 1
                  }));
                }
              )
              .on(
                'postgres_changes',
                {
                  event: 'UPDATE',
                  schema: 'public',
                  table: 'notifications',
                  filter: `userId=eq.${session.user.id}`
                },
                (payload) => {
                  // Handle updated notification
                  const updatedNotification = payload.new as Notification;
                  
                  set(state => {
                    const updatedNotifications = state.notifications.map(notification =>
                      notification.id === updatedNotification.id 
                        ? updatedNotification 
                        : notification
                    );
                    
                    return {
                      notifications: updatedNotifications,
                      unreadCount: updatedNotifications.filter(n => !n.readAt).length
                    };
                  });
                }
              )
              .on(
                'postgres_changes',
                {
                  event: 'DELETE',
                  schema: 'public',
                  table: 'notifications',
                  filter: `userId=eq.${session.user.id}`
                },
                (payload) => {
                  // Handle deleted notification
                  const deletedId = payload.old.id;
                  
                  set(state => {
                    const updatedNotifications = state.notifications.filter(
                      notification => notification.id !== deletedId
                    );
                    
                    return {
                      notifications: updatedNotifications,
                      unreadCount: updatedNotifications.filter(n => !n.readAt).length
                    };
                  });
                }
              )
              .subscribe();
            
            set({ subscription });
          }).catch(error => {
            console.error('Error starting real-time subscription:', error);
            set({ error: (error as Error).message || 'Failed to start real-time subscription' });
          });
        } catch (error) {
          console.error('Error starting real-time subscription:', error);
          set({ error: (error as Error).message || 'Failed to start real-time subscription' });
        }
      },
      
      stopRealTimeSubscription: () => {
        const { subscription } = get();
        
        if (subscription) {
          subscription.unsubscribe();
          set({ subscription: null });
        }
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({ 
        notifications: state.notifications.filter(n => !n.readAt).slice(0, 10)
      })
    }
  )
);

// Custom hook for notification operations
export function useNotifications() {
  const store = useNotificationStore();
  
  // Group notifications by type
  const notificationsByType = store.notifications.reduce<Record<NotificationType, Notification[]>>(
    (acc, notification) => {
      const type = notification.type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(notification);
      return acc;
    },
    {} as Record<NotificationType, Notification[]>
  );
  
  // Get notifications by priority (high to low)
  const notificationsByPriority = [...store.notifications].sort((a, b) => {
    // Define priority order
    const priorityOrder: Record<NotificationType, number> = {
      SYSTEM: 1,
      BOOKING_CONFIRMATION: 2,
      BOOKING_CANCELLATION: 3,
      BOOKING_REMINDER: 4,
      PAYMENT: 5,
      MESSAGE: 6
    };
    
    return (priorityOrder[a.type] || 99) - (priorityOrder[b.type] || 99);
  });
  
  return {
    ...store,
    notificationsByType,
    notificationsByPriority,
    
    // Enhanced methods
    getNotificationsByDate: () => {
      const result: Record<string, Notification[]> = {};
      
      store.notifications.forEach(notification => {
        const date = new Date(notification.createdAt).toLocaleDateString();
        if (!result[date]) {
          result[date] = [];
        }
        result[date].push(notification);
      });
      
      return result;
    }
  };
}
