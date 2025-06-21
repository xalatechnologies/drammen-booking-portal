
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export class FacilityActivityService {
  static async getFacilitySuitableActivities(facilityId: number, languageCode: string = 'NO'): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('facility_suitable_activities')
        .select('activity_name')
        .eq('facility_id', facilityId)
        .eq('language_code', languageCode);

      if (error) {
        console.error('Error fetching facility activities:', error);
        return [];
      }

      return data?.map(item => item.activity_name) || [];
    } catch (error) {
      console.error('Error in getFacilitySuitableActivities:', error);
      return [];
    }
  }
}
