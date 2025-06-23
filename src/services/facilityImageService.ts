
import { supabase } from '@/integrations/supabase/client';

export class FacilityImageService {
  static async getFeaturedImage(facilityId: number) {
    const { data, error } = await supabase
      .from('facility_images')
      .select('*')
      .eq('facility_id', facilityId)
      .eq('is_featured', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching featured image:', error);
      return null;
    }

    return data;
  }

  static async getFirstImage(facilityId: number) {
    const { data, error } = await supabase
      .from('facility_images')
      .select('*')
      .eq('facility_id', facilityId)
      .order('display_order')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching first image:', error);
      return null;
    }

    return data;
  }

  static async getAllImages(facilityId: number) {
    const { data, error } = await supabase
      .from('facility_images')
      .select('*')
      .eq('facility_id', facilityId)
      .order('display_order');

    if (error) {
      console.error('Error fetching facility images:', error);
      return [];
    }

    return data || [];
  }

  static async getFacilityImages(facilityId: number) {
    return this.getAllImages(facilityId);
  }
}
