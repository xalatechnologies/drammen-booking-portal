
import { supabase } from "@/integrations/supabase/client";
import { FacilityImage } from "@/types/facility";

export const FacilityImageService = {
  async getFacilityImages(facilityId: number): Promise<FacilityImage[]> {
    const { data, error } = await supabase
      .from('facility_images')
      .select('*')
      .eq('facility_id', facilityId)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data as FacilityImage[];
  },

  async getFeaturedImage(facilityId: number): Promise<FacilityImage | null> {
    const { data, error } = await supabase
      .from('facility_images')
      .select('*')
      .eq('facility_id', facilityId)
      .eq('is_featured', true)
      .maybeSingle();
    
    if (error) throw error;
    return data as FacilityImage | null;
  },

  async getFirstImage(facilityId: number): Promise<FacilityImage | null> {
    const { data, error } = await supabase
      .from('facility_images')
      .select('*')
      .eq('facility_id', facilityId)
      .order('display_order', { ascending: true })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    return data as FacilityImage | null;
  },

  async uploadImage(file: File, facilityId: number): Promise<FacilityImage> {
    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `facility-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('facility-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from('facility-images')
      .getPublicUrl(filePath);

    // Save to database
    const { data: imageRecord, error: dbError } = await supabase
      .from('facility_images')
      .insert({
        facility_id: facilityId,
        image_url: data.publicUrl,
        alt_text: file.name,
        display_order: 0, // Will be updated by the calling code
        is_featured: false,
        file_size: file.size,
      })
      .select()
      .single();

    if (dbError) throw dbError;
    return imageRecord as FacilityImage;
  },

  async deleteImage(imageId: string): Promise<void> {
    const { error } = await supabase
      .from('facility_images')
      .delete()
      .eq('id', imageId);
    
    if (error) throw error;
  },

  async updateImage(imageId: string, updates: Partial<FacilityImage>): Promise<FacilityImage> {
    const { data, error } = await supabase
      .from('facility_images')
      .update(updates)
      .eq('id', imageId)
      .select()
      .single();
    
    if (error) throw error;
    return data as FacilityImage;
  },

  async setFeaturedImage(facilityId: number, imageId: string): Promise<void> {
    // First, remove featured status from all images for this facility
    await supabase
      .from('facility_images')
      .update({ is_featured: false })
      .eq('facility_id', facilityId);
    
    // Then set the selected image as featured
    const { error } = await supabase
      .from('facility_images')
      .update({ is_featured: true })
      .eq('id', imageId);
    
    if (error) throw error;
  }
};
