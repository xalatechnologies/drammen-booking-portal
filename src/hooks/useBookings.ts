
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Booking, BookingFilters, BookingCreateRequest, BookingUpdateRequest } from '@/types/booking';
import { PaginationParams } from '@/types/api';
import { BookingService } from '@/services/BookingService';

export const useBookings = (
  pagination: PaginationParams = { page: 1, limit: 10 },
  filters?: BookingFilters
) => {
  return useQuery({
    queryKey: ['bookings', pagination, filters],
    queryFn: async () => {
      const response = await BookingService.getBookings(pagination, filters);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch bookings');
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useBooking = (bookingId?: string) => {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      
      const response = await BookingService.getBookingById(bookingId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch booking');
      }
      return response.data;
    },
    enabled: !!bookingId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useBookingsByFacility = (facilityId?: string) => {
  return useQuery({
    queryKey: ['bookings', 'facility', facilityId],
    queryFn: async () => {
      if (!facilityId) return [];
      
      const response = await BookingService.getBookingsByFacility(facilityId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch facility bookings');
      }
      return response.data || [];
    },
    enabled: !!facilityId,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

export const useBookingsByZone = (zoneId?: string) => {
  return useQuery({
    queryKey: ['bookings', 'zone', zoneId],
    queryFn: async () => {
      if (!zoneId) return [];
      
      const response = await BookingService.getBookingsByZone(zoneId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch zone bookings');
      }
      return response.data || [];
    },
    enabled: !!zoneId,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

export const useZoneAvailability = (
  zoneId?: string,
  date?: Date,
  timeSlots: string[] = []
) => {
  return useQuery({
    queryKey: ['availability', zoneId, date?.toDateString(), timeSlots],
    queryFn: async () => {
      if (!zoneId || !date || timeSlots.length === 0) return {};
      
      const response = await BookingService.checkAvailability(zoneId, date, timeSlots);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to check availability');
      }
      return response.data || {};
    },
    enabled: !!zoneId && !!date && timeSlots.length > 0,
    staleTime: 1000 * 30, // 30 seconds (real-time availability)
  });
};

export const useBookingConflicts = (
  zoneId?: string,
  startDate?: Date,
  endDate?: Date
) => {
  return useQuery({
    queryKey: ['conflicts', zoneId, startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      if (!zoneId || !startDate || !endDate) return null;
      
      const response = await BookingService.getConflictingBookings(zoneId, startDate, endDate);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to check conflicts');
      }
      return response.data;
    },
    enabled: !!zoneId && !!startDate && !!endDate,
    staleTime: 1000 * 30, // 30 seconds
  });
};

// Mutations for booking operations
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: BookingCreateRequest) => {
      const response = await BookingService.createBooking(request);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to create booking');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'facility', data?.facilityId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'zone', data?.zoneId] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      queryClient.invalidateQueries({ queryKey: ['conflicts'] });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, request }: { id: string; request: BookingUpdateRequest }) => {
      const response = await BookingService.updateBooking(id, request);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to update booking');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Update the specific booking in cache
      queryClient.setQueryData(['booking', data?.id], data);
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'facility', data?.facilityId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'zone', data?.zoneId] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      queryClient.invalidateQueries({ queryKey: ['conflicts'] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const response = await BookingService.cancelBooking(id, reason);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to cancel booking');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Update the specific booking in cache
      queryClient.setQueryData(['booking', data?.id], data);
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'facility', data?.facilityId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'zone', data?.zoneId] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      queryClient.invalidateQueries({ queryKey: ['conflicts'] });
    },
  });
};

export const useApproveBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const response = await BookingService.approveBooking(id, notes);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to approve booking');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Update the specific booking in cache
      queryClient.setQueryData(['booking', data?.id], data);
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'facility', data?.facilityId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'zone', data?.zoneId] });
    },
  });
};

export const useRejectBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const response = await BookingService.rejectBooking(id, reason);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to reject booking');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Update the specific booking in cache
      queryClient.setQueryData(['booking', data?.id], data);
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'facility', data?.facilityId] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'zone', data?.zoneId] });
    },
  });
};

export const useCreateRecurringBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ request, pattern }: { request: BookingCreateRequest; pattern: any }) => {
      const response = await BookingService.createRecurringBooking(request, pattern);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to create recurring booking');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate all booking-related queries since we created multiple bookings
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      queryClient.invalidateQueries({ queryKey: ['conflicts'] });
      
      if (data && data.length > 0) {
        const facilityId = data[0].facilityId;
        const zoneId = data[0].zoneId;
        queryClient.invalidateQueries({ queryKey: ['bookings', 'facility', facilityId] });
        queryClient.invalidateQueries({ queryKey: ['bookings', 'zone', zoneId] });
      }
    },
  });
};
