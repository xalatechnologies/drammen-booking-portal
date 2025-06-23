import { create } from 'zustand';
import { MessageApi } from './api/messageApi';
import { createGenericStore } from './createGenericStore';
import { Message, MessageFilter, MessageCreateInput, MessageUpdateInput } from '../types/models';
import { supabase } from '@/integrations/supabase/client';

// Create an instance of the message API
const messageApi = new MessageApi();

// Create the base message store using the generic store creator
const baseMessageStore = createGenericStore<
  Message, 
  MessageFilter, 
  MessageCreateInput, 
  MessageUpdateInput
>(messageApi);

// Extended message store with additional methods
interface MessageStoreExtensions {
  // Additional state
  conversations: any[];
  isLoadingConversations: boolean;
  activeConversationId: string | null;
  unreadCount: number;
  subscription: any | null;
  
  // Additional actions
  fetchConversations: (userId: string) => Promise<void>;
  setActiveConversation: (conversationId: string | null) => void;
  markAsRead: (messageId: string) => Promise<Message | null>;
  markConversationAsRead: (conversationId: string, userId: string) => Promise<void>;
  getUnreadCount: (userId: string) => Promise<number>;
  setupRealtimeSubscription: (userId: string) => Promise<void>;
  removeRealtimeSubscription: () => void;
}

// Create and export the extended message store
export const useMessageStore = create<ReturnType<typeof baseMessageStore.getState> & MessageStoreExtensions>(
  (set, get) => ({
    // Include all state and actions from the base store
    ...baseMessageStore.getState(),
    
    // Additional state
    conversations: [],
    isLoadingConversations: false,
    activeConversationId: null,
    unreadCount: 0,
    subscription: null,
    
    // Additional actions
    fetchConversations: async (userId: string) => {
      set({ isLoadingConversations: true });
      
      try {
        const response = await messageApi.getConversations(userId);
        
        if (response.data) {
          set({ 
            conversations: response.data,
            isLoadingConversations: false 
          });
        } else {
          set({ 
            error: response.error || 'Failed to fetch conversations',
            isLoadingConversations: false 
          });
        }
      } catch (error) {
        set({ 
          error: (error as Error).message || 'An unexpected error occurred',
          isLoadingConversations: false 
        });
      }
    },
    
    setActiveConversation: (conversationId: string | null) => {
      set({ activeConversationId: conversationId });
    },
    
    markAsRead: async (messageId: string) => {
      try {
        const response = await messageApi.markAsRead(messageId);
        
        if (response.data) {
          // Update the message in the items array
          set(state => {
            const updatedItems = state.items.map(item =>
              item.id === messageId ? { ...item, isRead: true } : item
            );
            
            return {
              items: updatedItems,
              selectedItem: state.selectedItem?.id === messageId 
                ? { ...state.selectedItem, isRead: true } 
                : state.selectedItem
            };
          });
          
          return response.data;
        } else {
          set({ error: response.error || 'Failed to mark message as read' });
          return null;
        }
      } catch (error) {
        set({ error: (error as Error).message || 'An unexpected error occurred' });
        return null;
      }
    },
    
    markConversationAsRead: async (conversationId: string, userId: string) => {
      try {
        const response = await messageApi.markConversationAsRead(conversationId, userId);
        
        if (response.data) {
          // Update messages in the items array
          set(state => {
            const updatedItems = state.items.map(item =>
              item.conversationId === conversationId && item.recipientId === userId
                ? { ...item, isRead: true }
                : item
            );
            
            return { items: updatedItems };
          });
          
          // Update unread count
          await get().getUnreadCount(userId);
          
        } else {
          set({ error: response.error || 'Failed to mark conversation as read' });
        }
      } catch (error) {
        set({ error: (error as Error).message || 'An unexpected error occurred' });
      }
    },
    
    getUnreadCount: async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('id', { count: 'exact' })
          .eq('recipientId', userId)
          .eq('isRead', false);
        
        if (error) throw error;
        
        const count = data?.length || 0;
        set({ unreadCount: count });
        
        return count;
      } catch (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }
    },
    
    setupRealtimeSubscription: async (userId: string) => {
      try {
        // Remove any existing subscription
        get().removeRealtimeSubscription();
        
        // Create a new subscription for messages where the user is the recipient
        const channel = supabase
          .channel(`messages-${userId}`)
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'messages',
              filter: `recipientId=eq.${userId}`
            }, 
            async (payload) => {
              console.log('Realtime message update:', payload);
              
              // Handle different events
              if (payload.eventType === 'INSERT') {
                const newMessage = payload.new as Message;
                
                // Add the new message to the items array if it's for the active conversation
                if (newMessage.conversationId === get().activeConversationId) {
                  // Fetch the complete message with related data
                  const { data } = await messageApi.getById(newMessage.id);
                  
                  if (data) {
                    set(state => ({
                      items: [...state.items, data]
                    }));
                  }
                }
                
                // Update unread count
                await get().getUnreadCount(userId);
                
                // Refresh conversations
                await get().fetchConversations(userId);
              }
              
              if (payload.eventType === 'UPDATE') {
                const updatedMessage = payload.new as Message;
                
                // Update the message in the items array
                set(state => {
                  const updatedItems = state.items.map(item =>
                    item.id === updatedMessage.id ? { ...item, ...updatedMessage } : item
                  );
                  
                  return { items: updatedItems };
                });
                
                // Update unread count if read status changed
                if ('isRead' in payload.new) {
                  await get().getUnreadCount(userId);
                }
              }
              
              if (payload.eventType === 'DELETE') {
                const deletedMessageId = payload.old.id;
                
                // Remove the message from the items array
                set(state => ({
                  items: state.items.filter(item => item.id !== deletedMessageId)
                }));
              }
            }
          )
          .subscribe();
        
        set({ subscription: channel });
      } catch (error) {
        console.error('Error setting up realtime subscription:', error);
      }
    },
    
    removeRealtimeSubscription: () => {
      const { subscription } = get();
      
      if (subscription) {
        supabase.removeChannel(subscription);
        set({ subscription: null });
      }
    }
  })
);

// Custom hook for message operations with cleanup
export function useMessages() {
  const messageStore = useMessageStore();
  
  // Setup and cleanup for realtime subscription
  React.useEffect(() => {
    const setupSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await messageStore.setupRealtimeSubscription(session.user.id);
      }
    };
    
    setupSubscription();
    
    return () => {
      messageStore.removeRealtimeSubscription();
    };
  }, []);
  
  return messageStore;
}

// Import React at the top
import React from 'react';
