
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EnhancedBookingService, EnhancedBooking, BookingFilters } from '@/services/EnhancedBookingService';
import { PaginationParams } from '@/types/api';
import { toast } from 'sonner';

export function useEnhancedBookings(
  pagination?: PaginationParams,
  filters?: BookingFilters
) {
  return useQuery({
    queryKey: ['enhanced-bookings', pagination, filters],
    queryFn: async () => {
      const result = await EnhancedBookingService.getBookings(pagination, filters);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes (bookings change frequently)
  });
}

export function useEnhancedBooking(id: string) {
  return useQuery({
    queryKey: ['enhanced-booking', id],
    queryFn: async () => {
      const result = await EnhancedBookingService.getBookingById(id);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useUserEnhancedBookings(
  userId?: string,
  pagination?: PaginationParams
) {
  return useQuery({
    queryKey: ['user-enhanced-bookings', userId, pagination],
    queryFn: async () => {
      const result = await EnhancedBookingService.getUserBookings(userId, pagination);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useCreateEnhancedBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: Omit<EnhancedBooking, 'id' | 'booking_reference' | 'created_at' | 'updated_at'>) => {
      const result = await EnhancedBookingService.createBooking(bookingData);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['user-enhanced-bookings'] });
      toast.success('Booking created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create booking: ${error.message}`);
    },
  });
}

export function useUpdateEnhancedBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<EnhancedBooking> }) => {
      const result = await EnhancedBookingService.updateBooking(id, updates);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-booking', data.id] });
      queryClient.invalidateQueries({ queryKey: ['user-enhanced-bookings'] });
      toast.success('Booking updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update booking: ${error.message}`);
    },
  });
}

export function useCancelEnhancedBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const result = await EnhancedBookingService.cancelBooking(id, reason);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['user-enhanced-bookings'] });
      toast.success('Booking cancelled successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel booking: ${error.message}`);
    },
  });
}
