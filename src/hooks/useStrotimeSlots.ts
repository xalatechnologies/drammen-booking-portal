
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StrotimeSlot {
  id: string;
  facility_id: number;
  zone_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  price_per_slot: number;
  max_participants: number;
  current_participants: number;
  is_available: boolean;
  published_at: string;
  published_by: string | null;
  released_from_rammetid: boolean;
  original_booking_id: string | null;
  created_at: string;
}

export function useStrotimeSlots(facilityId?: number, date?: string) {
  return useQuery({
    queryKey: ['strotime-slots', facilityId, date],
    queryFn: async () => {
      let query = supabase
        .from('strotime_slots')
        .select('*')
        .eq('is_available', true)
        .order('slot_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (facilityId) {
        query = query.eq('facility_id', facilityId);
      }

      if (date) {
        query = query.eq('slot_date', date);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching strotime slots:', error);
        throw error;
      }

      return data || [];
    },
    enabled: true,
  });
}

export function useStrotimeSlotsByFacility(facilityId: number) {
  return useStrotimeSlots(facilityId);
}
