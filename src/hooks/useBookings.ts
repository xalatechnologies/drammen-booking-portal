import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBookings = (
  pagination = { page: 1, limit: 10 },
  filters?: any
) => {
  return useQuery({
    queryKey: ['bookings', pagination, filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      
      return data || [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useBooking = (bookingId?: string) => {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!bookingId) return null;
      
      const { data, error } = await supabase
        .from('app_bookings')
        .select('*')
        .eq('id', bookingId)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
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
      
      const { data, error } = await supabase
        .from('app_bookings')
        .select('*')
        .eq('location_id', facilityId)
        .order('start_date_time', { ascending: true });

      if (error) throw new Error(error.message);
      return data || [];
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
      
      const { data, error } = await supabase
        .from('app_bookings')
        .select('*')
        .eq('zone_id', zoneId)
        .order('start_date_time', { ascending: true });

      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!zoneId,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

export const useZoneAvailability = (
  zoneId?: string,
  date?: Date,
  timeSlot?: string
) => {
  return useQuery({
    queryKey: ['availability', zoneId, date?.toDateString(), timeSlot],
    queryFn: async () => {
      if (!zoneId || !date || !timeSlot) return { available: false };
      
      // Simple availability check - look for conflicting bookings
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const { data, error } = await supabase
        .from('app_bookings')
        .select('*')
        .eq('zone_id', zoneId)
        .gte('start_date_time', startOfDay.toISOString())
        .lte('end_date_time', endOfDay.toISOString());

      if (error) throw new Error(error.message);
      
      // Simple check - if no bookings found, it's available
      return { available: !data || data.length === 0 };
    },
    enabled: !!zoneId && !!date && !!timeSlot,
    staleTime: 1000 * 30, // 30 seconds
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
      
      const { data, error } = await supabase
        .from('app_bookings')
        .select('*')
        .eq('zone_id', zoneId)
        .gte('start_date_time', startDate.toISOString())
        .lte('end_date_time', endDate.toISOString());

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!zoneId && !!startDate && !!endDate,
    staleTime: 1000 * 30, // 30 seconds
  });
};

// Mutations for booking operations
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: any) => {
      const { data, error } = await supabase
        .from('app_bookings')
        .insert({
          user_id: request.userId,
          actor_id: request.actorId,
          location_id: request.facilityId,
          zone_id: request.zoneId,
          start_date_time: request.startDateTime,
          end_date_time: request.endDateTime,
          type: request.type || 'one-time',
          status: 'pending',
          price: request.price,
          metadata: request.metadata || {}
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'facility', data?.location_id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'zone', data?.zone_id] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, request }: { id: string; request: any }) => {
      const { data, error } = await supabase
        .from('app_bookings')
        .update(request)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['booking', data?.id], data);
      
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'facility', data?.location_id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'zone', data?.zone_id] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const { data, error } = await supabase
        .from('app_bookings')
        .update({ status: 'cancelled', reason })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['booking', data?.id], data);
      
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'facility', data?.location_id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'zone', data?.zone_id] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });
};

export const useApproveBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('app_bookings')
        .update({ status: 'approved', notes })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['booking', data?.id], data);
      
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'facility', data?.location_id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'zone', data?.zone_id] });
    },
  });
};

export const useRejectBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data, error } = await supabase
        .from('app_bookings')
        .update({ status: 'rejected', reason })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['booking', data?.id], data);
      
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'facility', data?.location_id] });
      queryClient.invalidateQueries({ queryKey: ['bookings', 'zone', data?.zone_id] });
    },
  });
};

export const useCreateRecurringBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ request, pattern }: { request: any; pattern: any }) => {
      const { data, error } = await supabase
        .from('app_bookings')
        .insert({
          user_id: request.userId,
          actor_id: request.actorId,
          location_id: request.facilityId,
          zone_id: request.zoneId,
          start_date_time: request.startDateTime,
          end_date_time: request.endDateTime,
          type: request.type || 'one-time',
          status: 'pending',
          price: request.price,
          metadata: request.metadata || {}
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      queryClient.invalidateQueries({ queryKey: ['conflicts'] });
      
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['bookings', 'facility', data.location_id] });
        queryClient.invalidateQueries({ queryKey: ['bookings', 'zone', data.zone_id] });
      }
    },
  });
};
