import { supabase } from '@/integrations/supabase/client';
import { GenericApi } from '@/zustand-only/types/api';
import { 
  Message, 
  MessageFilter, 
  MessageCreateInput, 
  MessageUpdateInput 
} from '@/zustand-only/types/models';

/**
 * API adapter for Message entity
 * Implements the GenericApi interface for messages
 */
export class MessageApi implements GenericApi<Message, MessageFilter, MessageCreateInput, MessageUpdateInput> {
  /**
   * Get a list of messages with optional filtering and pagination
   */
  async getList(params: {
    pagination?: { page: number; limit: number };
    filters?: MessageFilter;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }) {
    try {
      const { 
        pagination = { page: 1, limit: 20 }, 
        filters = {}, 
        orderBy = 'createdAt', 
        orderDirection = 'desc' 
      } = params;
      
      // Calculate range for pagination
      const from = (pagination.page - 1) * pagination.limit;
      const to = from + pagination.limit - 1;
      
      // Build query
      let query = supabase.from('messages');
      
      // Select with related data
      query = query.select(`
        *,
        sender:users!senderId(id, name, email, avatarUrl),
        recipient:users!recipientId(id, name, email, avatarUrl)
      `);
      
      // Apply filters
      if (filters.conversationId) {
        query = query.eq('conversationId', filters.conversationId);
      }
      
      if (filters.senderId) {
        query = query.eq('senderId', filters.senderId);
      }
      
      if (filters.recipientId) {
        query = query.eq('recipientId', filters.recipientId);
      }
      
      if (filters.bookingId) {
        query = query.eq('bookingId', filters.bookingId);
      }
      
      if (filters.isRead !== undefined) {
        query = query.eq('isRead', filters.isRead);
      }
      
      if (filters.fromDate) {
        query = query.gte('createdAt', filters.fromDate);
      }
      
      if (filters.toDate) {
        query = query.lte('createdAt', filters.toDate);
      }
      
      // Apply search
      if (filters.search) {
        query = query.ilike('content', `%${filters.search}%`);
      }
      
      // Apply ordering
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });
      
      // Apply pagination
      query = query.range(from, to);
      
      // Execute query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return {
        data: data as Message[],
        meta: {
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: count || 0,
            totalPages: count ? Math.ceil(count / pagination.limit) : 0
          }
        }
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      return {
        data: [],
        error: (error as Error).message,
        meta: {
          pagination: {
            page: params.pagination?.page || 1,
            limit: params.pagination?.limit || 20,
            total: 0,
            totalPages: 0
          }
        }
      };
    }
  }
  
  /**
   * Get a message by ID
   */
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!senderId(id, name, email, avatarUrl),
          recipient:users!recipientId(id, name, email, avatarUrl)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data: data as Message };
    } catch (error) {
      console.error('Error fetching message:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Create a new message
   */
  async create(input: MessageCreateInput) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          ...input,
          isRead: false,
          createdAt: new Date().toISOString()
        })
        .select(`
          *,
          sender:users!senderId(id, name, email, avatarUrl),
          recipient:users!recipientId(id, name, email, avatarUrl)
        `);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after creating message');
      }
      
      return { data: data[0] as Message };
    } catch (error) {
      console.error('Error creating message:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Update an existing message
   */
  async update(id: string, input: MessageUpdateInput) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({
          ...input,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          sender:users!senderId(id, name, email, avatarUrl),
          recipient:users!recipientId(id, name, email, avatarUrl)
        `);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after updating message');
      }
      
      return { data: data[0] as Message };
    } catch (error) {
      console.error('Error updating message:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Delete a message
   */
  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { data: true };
    } catch (error) {
      console.error('Error deleting message:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Mark message as read
   */
  async markAsRead(id: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({
          isRead: true,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after marking message as read');
      }
      
      return { data: data[0] as Message };
    } catch (error) {
      console.error('Error marking message as read:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Mark all messages in a conversation as read
   */
  async markConversationAsRead(conversationId: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({
          isRead: true,
          updatedAt: new Date().toISOString()
        })
        .eq('conversationId', conversationId)
        .eq('recipientId', userId)
        .eq('isRead', false)
        .select();
      
      if (error) throw error;
      
      return { data: data as Message[] };
    } catch (error) {
      console.error('Error marking conversation as read:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Get conversations for a user
   */
  async getConversations(userId: string) {
    try {
      // This is a more complex query that gets the latest message from each conversation
      // along with unread count for the user
      const { data, error } = await supabase.rpc('get_user_conversations', {
        user_id: userId
      });
      
      if (error) throw error;
      
      return { data };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return { error: (error as Error).message, data: [] };
    }
  }
}
