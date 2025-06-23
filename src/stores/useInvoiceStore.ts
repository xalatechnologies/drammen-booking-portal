import { create } from 'zustand';
import { InvoiceApi } from './api/invoiceApi';
import { createGenericStore } from './createGenericStore';
import { Invoice, InvoiceFilter, InvoiceCreateInput, InvoiceUpdateInput } from '../types/models';

// Create an instance of the invoice API
const invoiceApi = new InvoiceApi();

// Create the base invoice store using the generic store creator
const baseInvoiceStore = createGenericStore<
  Invoice, 
  InvoiceFilter, 
  InvoiceCreateInput, 
  InvoiceUpdateInput
>(invoiceApi);

// Extended invoice store with additional methods
interface InvoiceStoreExtensions {
  // Additional state
  isProcessingPayment: boolean;
  isSendingInvoice: boolean;
  
  // Additional actions
  markAsPaid: (id: string, paymentDetails?: Record<string, any>) => Promise<Invoice | null>;
  cancelInvoice: (id: string, reason?: string) => Promise<Invoice | null>;
  sendInvoice: (id: string) => Promise<Invoice | null>;
}

// Create and export the extended invoice store
export const useInvoiceStore = create<ReturnType<typeof baseInvoiceStore.getState> & InvoiceStoreExtensions>(
  (set, get) => ({
    // Include all state and actions from the base store
    ...baseInvoiceStore.getState(),
    
    // Additional state
    isProcessingPayment: false,
    isSendingInvoice: false,
    
    // Additional actions
    markAsPaid: async (id: string, paymentDetails?: Record<string, any>) => {
      set({ isProcessingPayment: true });
      
      try {
        const response = await invoiceApi.markAsPaid(id, paymentDetails);
        
        if (response.data) {
          // Update the invoice in the items array
          set(state => {
            const updatedItems = state.items.map(item =>
              item.id === id ? response.data as Invoice : item
            );
            
            return {
              items: updatedItems,
              selectedItem: state.selectedItem?.id === id ? response.data as Invoice : state.selectedItem,
              isProcessingPayment: false
            };
          });
          
          return response.data;
        } else {
          set({ 
            error: response.error || 'Failed to mark invoice as paid',
            isProcessingPayment: false 
          });
          return null;
        }
      } catch (error) {
        set({ 
          error: (error as Error).message || 'An unexpected error occurred',
          isProcessingPayment: false 
        });
        return null;
      }
    },
    
    cancelInvoice: async (id: string, reason?: string) => {
      set({ isLoading: true });
      
      try {
        const response = await invoiceApi.cancelInvoice(id, reason);
        
        if (response.data) {
          // Update the invoice in the items array
          set(state => {
            const updatedItems = state.items.map(item =>
              item.id === id ? response.data as Invoice : item
            );
            
            return {
              items: updatedItems,
              selectedItem: state.selectedItem?.id === id ? response.data as Invoice : state.selectedItem,
              isLoading: false
            };
          });
          
          return response.data;
        } else {
          set({ 
            error: response.error || 'Failed to cancel invoice',
            isLoading: false 
          });
          return null;
        }
      } catch (error) {
        set({ 
          error: (error as Error).message || 'An unexpected error occurred',
          isLoading: false 
        });
        return null;
      }
    },
    
    sendInvoice: async (id: string) => {
      set({ isSendingInvoice: true });
      
      try {
        const response = await invoiceApi.sendInvoice(id);
        
        if (response.data) {
          // Update the invoice in the items array
          set(state => {
            const updatedItems = state.items.map(item =>
              item.id === id ? response.data as Invoice : item
            );
            
            return {
              items: updatedItems,
              selectedItem: state.selectedItem?.id === id ? response.data as Invoice : state.selectedItem,
              isSendingInvoice: false
            };
          });
          
          return response.data;
        } else {
          set({ 
            error: response.error || 'Failed to send invoice',
            isSendingInvoice: false 
          });
          return null;
        }
      } catch (error) {
        set({ 
          error: (error as Error).message || 'An unexpected error occurred',
          isSendingInvoice: false 
        });
        return null;
      }
    }
  })
);
