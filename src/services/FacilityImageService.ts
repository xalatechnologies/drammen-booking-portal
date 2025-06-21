
import { supabase } from '@/integrations/supabase/client';

export class FacilityImageService {
  static async getFeaturedImage(facilityId: number) {
    console.log('FacilityImageService.getFeaturedImage - Fetching for facility:', facilityId);
    
    const { data, error } = await supabase
      .from('facility_images')
      .select('*')
      .eq('facility_id', facilityId)
      .eq('is_featured', true)
      .single();
    
    console.log('FacilityImageService.getFeaturedImage - Result:', { data, error });
    return data;
  }

  static async getFirstImage(facilityId: number) {
    console.log('FacilityImageService.getFirstImage - Fetching for facility:', facilityId);
    
    const { data, error } = await supabase
      .from('facility_images')
      .select('*')
      .eq('facility_id', facilityId)
      .order('display_order', { ascending: true })
      .limit(1)
      .single();
    
    console.log('FacilityImageService.getFirstImage - Result:', { data, error });
    return data;
  }

  static async getAllImages(facilityId: number) {
    console.log('FacilityImageService.getAllImages - Fetching for facility:', facilityId);
    
    const { data, error } = await supabase
      .from('facility_images')
      .select('*')
      .eq('facility_id', facilityId)
      .order('display_order', { ascending: true });
    
    console.log('FacilityImageService.getAllImages - Result:', { data, error });
    return data || [];
  }
}
