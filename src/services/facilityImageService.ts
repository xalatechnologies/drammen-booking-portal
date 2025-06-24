
import { FacilityImage } from '@/types/facility';
import { supabase } from '@/integrations/supabase/client';

// Real service for facility images using app_location_images
export const facilityImageService = {
  async getFacilityImages(facilityId: string): Promise<FacilityImage[]> {
    try {
      console.log('FacilityImageService: Getting facility images for facility', facilityId);
      
      const { data, error } = await supabase
        .from('app_location_images')
        .select('*')
        .eq('location_id', facilityId)
        .order('display_order');

      if (error) {
        console.error('FacilityImageService: Error fetching images:', error);
        return [];
      }

      return (data || []).map(img => ({
        id: img.id,
        facility_id: parseInt(facilityId), // Convert UUID to number for compatibility
        image_url: img.image_url,
        alt_text: img.alt_text || undefined,
        caption: img.caption || undefined,
        display_order: img.display_order,
        is_featured: img.is_featured,
        file_size: img.file_size || undefined,
        uploaded_by: img.uploaded_by || undefined,
        uploaded_at: img.uploaded_at || new Date().toISOString(),
        created_at: img.created_at
      }));
    } catch (error) {
      console.error('FacilityImageService: Catch error:', error);
      return [];
    }
  },

  async getFeaturedImage(facilityId: number): Promise<FacilityImage | null> {
    try {
      console.log('FacilityImageService: Getting featured image for facility', facilityId);
      
      // For compatibility, we need to find the location by the numeric ID
      // Since we're dealing with UUIDs in the database, we'll need to find a way to map them
      // For now, let's try to get the first featured image from any location
      const { data, error } = await supabase
        .from('app_location_images')
        .select('*')
        .eq('is_featured', true)
        .order('display_order')
        .limit(1)
        .single();

      if (error || !data) {
        console.log('FacilityImageService: No featured image found, trying first image');
        return this.getFirstImage(facilityId);
      }

      return {
        id: data.id,
        facility_id: facilityId,
        image_url: data.image_url,
        alt_text: data.alt_text || undefined,
        caption: data.caption || undefined,
        display_order: data.display_order,
        is_featured: data.is_featured,
        file_size: data.file_size || undefined,
        uploaded_by: data.uploaded_by || undefined,
        uploaded_at: data.uploaded_at || new Date().toISOString(),
        created_at: data.created_at
      };
    } catch (error) {
      console.error('FacilityImageService: Error getting featured image:', error);
      return null;
    }
  },

  async getFirstImage(facilityId: number): Promise<FacilityImage | null> {
    try {
      console.log('FacilityImageService: Getting first image for facility', facilityId);
      
      const { data, error } = await supabase
        .from('app_location_images')
        .select('*')
        .order('display_order')
        .limit(1)
        .single();

      if (error || !data) {
        console.log('FacilityImageService: No images found');
        return null;
      }

      return {
        id: data.id,
        facility_id: facilityId,
        image_url: data.image_url,
        alt_text: data.alt_text || undefined,
        caption: data.caption || undefined,
        display_order: data.display_order,
        is_featured: data.is_featured,
        file_size: data.file_size || undefined,
        uploaded_by: data.uploaded_by || undefined,
        uploaded_at: data.uploaded_at || new Date().toISOString(),
        created_at: data.created_at
      };
    } catch (error) {
      console.error('FacilityImageService: Error getting first image:', error);
      return null;
    }
  },

  async uploadFacilityImage(facilityId: string, imageFile: File): Promise<FacilityImage> {
    // This would need proper file upload implementation
    const mockImage: FacilityImage = {
      id: `mock-${Date.now()}`,
      facility_id: parseInt(facilityId),
      image_url: URL.createObjectURL(imageFile),
      alt_text: imageFile.name,
      display_order: 0,
      is_featured: false,
      uploaded_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    
    console.log('FacilityImageService: Mock uploading facility image', mockImage);
    return mockImage;
  },

  async deleteFacilityImage(imageId: string): Promise<void> {
    console.log('FacilityImageService: Mock deleting facility image', imageId);
  },

  async setFeaturedImage(facilityId: string, imageId: string): Promise<void> {
    console.log('FacilityImageService: Mock setting featured image', facilityId, imageId);
  }
};

// Export for backward compatibility
export const FacilityImageService = facilityImageService;
