import { create } from 'zustand';
import { BookingApi } from './api/bookingApi';
import { createGenericStore } from './createGenericStore';
import { Booking, BookingCreateRequest, BookingUpdateRequest } from '@/types/models';
import { combineMiddleware, createLogger, createPerformanceMonitor } from '../middleware';

// Create the base booking store using the generic store creator
const createBaseBookingStore = () => {
  const api = new BookingApi();
  return createGenericStore<Booking, BookingCreateRequest, BookingUpdateRequest>(api);
};

// Define additional booking-specific state and actions
interface BookingStoreExtensions {
  // Additional state
  recurringBookings: Record<string, Booking[]>;
  conflictingBookings: Booking[];
  availableAlternatives: any[];
  calendarView: 'day' | 'week' | 'month';
  selectedDate: Date;
  
  // Additional actions
  approveBooking: (id: string, adminNotes?: string) => Promise<Booking>;
  rejectBooking: (id: string, reason: string) => Promise<Booking>;
  cancelBooking: (id: string, reason?: string) => Promise<Booking>;
  checkInBooking: (id: string) => Promise<Booking>;
  createRecurringBooking: (booking: BookingCreateRequest, recurrencePattern: any) => Promise<Booking[]>;
  getUserBookings: (userId: string) => Promise<void>;
  getFacilityBookings: (facilityId: string) => Promise<void>;
  getZoneBookings: (zoneId: string) => Promise<void>;
  getBookingsInDateRange: (startDate: Date, endDate: Date) => Promise<void>;
  checkForConflicts: (zoneId: string, startTime: Date, endTime: Date) => Promise<boolean>;
  setCalendarView: (view: 'day' | 'week' | 'month') => void;
  setSelectedDate: (date: Date) => void;
}

// Create the extended booking store with additional functionality
export const useBookingStore = create<
  ReturnType<typeof createBaseBookingStore> & BookingStoreExtensions
>(
  // Apply middleware for development tools
  combineMiddleware(
    createLogger('BookingStore'),
    createPerformanceMonitor({ storeName: 'BookingStore' })
  )(
    (set, get) => ({
      // Include all base store functionality
      ...createBaseBookingStore(),
      
      // Additional state
      recurringBookings: {},
      conflictingBookings: [],
      availableAlternatives: [],
      calendarView: 'week',
      selectedDate: new Date(),
      
      // Additional actions
      approveBooking: async (id: string, adminNotes?: string) => {
        const api = new BookingApi();
        try {
          set({ isLoading: true, error: null });
          const booking = await api.approveBooking(id, adminNotes);
          
          // Update the item in the items array
          const items = get().items;
          const updatedItems = items.map(item => 
            item.id === booking.id ? booking : item
          );
          
          set({ items: updatedItems, isLoading: false });
          return booking;
        } catch (error) {
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },
      
      rejectBooking: async (id: string, reason: string) => {
        const api = new BookingApi();
        try {
          set({ isLoading: true, error: null });
          const booking = await api.rejectBooking(id, reason);
          
          // Update the item in the items array
          const items = get().items;
          const updatedItems = items.map(item => 
            item.id === booking.id ? booking : item
          );
          
          set({ items: updatedItems, isLoading: false });
          return booking;
        } catch (error) {
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },
      
      cancelBooking: async (id: string, reason?: string) => {
        const api = new BookingApi();
        try {
          set({ isLoading: true, error: null });
          const booking = await api.cancelBooking(id, reason);
          
          // Update the item in the items array
          const items = get().items;
          const updatedItems = items.map(item => 
            item.id === booking.id ? booking : item
          );
          
          set({ items: updatedItems, isLoading: false });
          return booking;
        } catch (error) {
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },
      
      checkInBooking: async (id: string) => {
        const api = new BookingApi();
        try {
          set({ isLoading: true, error: null });
          const booking = await api.checkInBooking(id);
          
          // Update the item in the items array
          const items = get().items;
          const updatedItems = items.map(item => 
            item.id === booking.id ? booking : item
          );
          
          set({ items: updatedItems, isLoading: false });
          return booking;
        } catch (error) {
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },
      
      createRecurringBooking: async (booking: BookingCreateRequest, recurrencePattern: any) => {
        const api = new BookingApi();
        try {
          set({ isLoading: true, error: null });
          const bookings = await api.createRecurringBooking(booking, recurrencePattern);
          
          // Add the new bookings to the items array
          const items = get().items;
          const updatedItems = [...items, ...bookings];
          
          // Store recurring bookings by group ID for easy access
          const recurringBookings = { ...get().recurringBookings };
          if (bookings.length > 0 && bookings[0].recurrence_group_id) {
            recurringBookings[bookings[0].recurrence_group_id] = bookings;
          }
          
          set({ 
            items: updatedItems, 
            recurringBookings,
            isLoading: false 
          });
          
          return bookings;
        } catch (error) {
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },
      
      getUserBookings: async (userId: string) => {
        const api = new BookingApi();
        try {
          set({ isLoading: true, error: null });
          const result = await api.getUserBookings(userId);
          set({ 
            items: result.items, 
            total: result.total,
            page: result.page,
            isLoading: false 
          });
        } catch (error) {
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },
      
      getFacilityBookings: async (facilityId: string) => {
        const api = new BookingApi();
        try {
          set({ isLoading: true, error: null });
          const result = await api.getFacilityBookings(facilityId);
          set({ 
            items: result.items, 
            total: result.total,
            page: result.page,
            isLoading: false 
          });
        } catch (error) {
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },
      
      getZoneBookings: async (zoneId: string) => {
        const api = new BookingApi();
        try {
          set({ isLoading: true, error: null });
          const result = await api.getZoneBookings(zoneId);
          set({ 
            items: result.items, 
            total: result.total,
            page: result.page,
            isLoading: false 
          });
        } catch (error) {
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },
      
      getBookingsInDateRange: async (startDate: Date, endDate: Date) => {
        const api = new BookingApi();
        try {
          set({ isLoading: true, error: null });
          const result = await api.getBookingsInDateRange(startDate, endDate);
          set({ 
            items: result.items, 
            total: result.total,
            page: result.page,
            isLoading: false 
          });
        } catch (error) {
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },
      
      checkForConflicts: async (zoneId: string, startTime: Date, endTime: Date) => {
        const api = new BookingApi();
        try {
          set({ isLoading: true, error: null });
          const hasConflicts = await api.checkForConflicts(zoneId, startTime, endTime);
          set({ isLoading: false });
          return hasConflicts;
        } catch (error) {
          set({ error: error as Error, isLoading: false });
          throw error;
        }
      },
      
      setCalendarView: (view: 'day' | 'week' | 'month') => {
        set({ calendarView: view });
      },
      
      setSelectedDate: (date: Date) => {
        set({ selectedDate: date });
      }
    })
  )
);