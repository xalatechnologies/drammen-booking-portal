
import { supabase } from "@/integrations/supabase/client";

export interface FacilityImage {
  id: string;
  location_id: string;
  image_url: string;
  alt_text?: string;
  caption?: string;
  display_order: number;
  is_featured: boolean;
  file_size?: number;
  uploaded_by?: string;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

export class FacilityImageService {
  static async getFacilityImages(facilityId: string | number): Promise<FacilityImage[]> {
    const { data, error } = await supabase
      .from('app_location_images')
      .select('*')
      .eq('location_id', facilityId)
      .order('display_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  static async getFeaturedImage(facilityId: string | number): Promise<FacilityImage | null> {
    const { data, error } = await supabase
      .from('app_location_images')
      .select('*')
      .eq('location_id', facilityId)
      .eq('is_featured', true)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  static async getFirstImage(facilityId: string | number): Promise<FacilityImage | null> {
    const { data, error } = await supabase
      .from('app_location_images')
      .select('*')
      .eq('location_id', facilityId)
      .order('display_order', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }
}
