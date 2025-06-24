
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BlackoutPeriod {
  id: string;
  facility_id: number;
  start_date: string;
  end_date: string;
  type: string;
  reason: string;
  created_by: string | null;
  created_at: string;
}

export function useBlackoutPeriods(facilityId?: number) {
  return useQuery({
    queryKey: ['blackout-periods', facilityId],
    queryFn: async () => {
      let query = supabase
        .from('facility_blackout_periods')
        .select('*')
        .order('start_date');

      if (facilityId) {
        query = query.eq('facility_id', facilityId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching blackout periods:', error);
        throw error;
      }

      return data || [];
    },
    enabled: true,
  });
}

export function useBlackoutPeriodsByFacility(facilityId: number) {
  return useBlackoutPeriods(facilityId);
}
