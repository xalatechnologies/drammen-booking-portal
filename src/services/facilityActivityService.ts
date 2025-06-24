
import { supabase } from '@/integrations/supabase/client';

export class FacilityActivityService {
  static async getFacilitySuitableActivities(facilityId: number | string, languageCode: 'NO' | 'EN' = 'NO'): Promise<string[]> {
    try {
      // Since the facility_suitable_activities table doesn't exist,
      // we'll return activities based on the facilities array in app_locations
      const { data, error } = await supabase
        .from('app_locations')
        .select('facilities')
        .eq('id', String(facilityId))
        .maybeSingle();

      if (error) {
        console.error('Error fetching facility activities:', error);
        return [];
      }

      return data?.facilities || [];
    } catch (error) {
      console.error('Error in getFacilitySuitableActivities:', error);
      return [];
    }
  }
}
