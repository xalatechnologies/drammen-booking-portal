import { supabase } from '@/integrations/supabase/client';
import { GenericApi } from '@/zustand-only/types/api';
import { 
  Invoice, 
  InvoiceFilter, 
  InvoiceCreateInput, 
  InvoiceUpdateInput,
  InvoiceStatus
} from '@/zustand-only/types/models';

/**
 * API adapter for Invoice entity
 * Implements the GenericApi interface for invoices
 */
export class InvoiceApi implements GenericApi<Invoice, InvoiceFilter, InvoiceCreateInput, InvoiceUpdateInput> {
  /**
   * Get a list of invoices with optional filtering and pagination
   */
  async getList(params: {
    pagination?: { page: number; limit: number };
    filters?: InvoiceFilter;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  }) {
    try {
      const { 
        pagination = { page: 1, limit: 10 }, 
        filters = {}, 
        orderBy = 'createdAt', 
        orderDirection = 'desc' 
      } = params;
      
      // Calculate range for pagination
      const from = (pagination.page - 1) * pagination.limit;
      const to = from + pagination.limit - 1;
      
      // Build query
      let query = supabase.from('invoices');
      
      // Select with related data
      query = query.select(`
        *,
        booking:bookings(*),
        user:users(id, name, email)
      `);
      
      // Apply filters
      if (filters.userId) {
        query = query.eq('userId', filters.userId);
      }
      
      if (filters.bookingId) {
        query = query.eq('bookingId', filters.bookingId);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.minAmount) {
        query = query.gte('amount', filters.minAmount);
      }
      
      if (filters.maxAmount) {
        query = query.lte('amount', filters.maxAmount);
      }
      
      if (filters.fromDate) {
        query = query.gte('createdAt', filters.fromDate);
      }
      
      if (filters.toDate) {
        query = query.lte('createdAt', filters.toDate);
      }
      
      // Apply ordering
      query = query.order(orderBy, { ascending: orderDirection === 'asc' });
      
      // Apply pagination
      query = query.range(from, to);
      
      // Execute query
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return {
        data: data as Invoice[],
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
      console.error('Error fetching invoices:', error);
      return {
        data: [],
        error: (error as Error).message,
        meta: {
          pagination: {
            page: params.pagination?.page || 1,
            limit: params.pagination?.limit || 10,
            total: 0,
            totalPages: 0
          }
        }
      };
    }
  }
  
  /**
   * Get an invoice by ID
   */
  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          booking:bookings(*),
          user:users(id, name, email)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data: data as Invoice };
    } catch (error) {
      console.error('Error fetching invoice:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Create a new invoice
   */
  async create(input: InvoiceCreateInput) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          ...input,
          status: input.status || 'PENDING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after creating invoice');
      }
      
      return { data: data[0] as Invoice };
    } catch (error) {
      console.error('Error creating invoice:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Update an existing invoice
   */
  async update(id: string, input: InvoiceUpdateInput) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({
          ...input,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after updating invoice');
      }
      
      return { data: data[0] as Invoice };
    } catch (error) {
      console.error('Error updating invoice:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Delete an invoice
   */
  async delete(id: string) {
    try {
      // Check if invoice can be deleted (only if it's in DRAFT or PENDING status)
      const { data: invoice, error: fetchError } = await supabase
        .from('invoices')
        .select('status')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (!invoice) {
        throw new Error('Invoice not found');
      }
      
      if (invoice.status !== 'DRAFT' && invoice.status !== 'PENDING') {
        return { error: 'Cannot delete invoice that is not in DRAFT or PENDING status' };
      }
      
      // Delete invoice
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { data: true };
    } catch (error) {
      console.error('Error deleting invoice:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Mark invoice as paid
   */
  async markAsPaid(id: string, paymentDetails?: Record<string, any>) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({
          status: 'PAID',
          paidAt: new Date().toISOString(),
          paymentDetails: paymentDetails || {},
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after marking invoice as paid');
      }
      
      return { data: data[0] as Invoice };
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Cancel invoice
   */
  async cancelInvoice(id: string, reason?: string) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({
          status: 'CANCELLED',
          cancelledAt: new Date().toISOString(),
          cancelReason: reason || '',
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after cancelling invoice');
      }
      
      return { data: data[0] as Invoice };
    } catch (error) {
      console.error('Error cancelling invoice:', error);
      return { error: (error as Error).message };
    }
  }
  
  /**
   * Send invoice via email
   */
  async sendInvoice(id: string) {
    try {
      // Call send invoice edge function
      const { data, error } = await supabase.functions.invoke('send-invoice', {
        body: { invoiceId: id }
      });
      
      if (error) throw error;
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to send invoice');
      }
      
      // Update invoice sent status
      const { data: updatedInvoice, error: updateError } = await supabase
        .from('invoices')
        .update({
          sentAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      return { data: updatedInvoice as Invoice };
    } catch (error) {
      console.error('Error sending invoice:', error);
      return { error: (error as Error).message };
    }
  }
}
