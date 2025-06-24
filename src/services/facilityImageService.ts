
import { FacilityImage } from '@/types/facility';

// Mock service for facility images - using app_location_images instead
export const facilityImageService = {
  async getFacilityImages(facilityId: string): Promise<FacilityImage[]> {
    // This should use app_location_images, but for now return empty array
    console.log('Mock: Getting facility images for facility', facilityId);
    return [];
  },

  async uploadFacilityImage(facilityId: string, imageFile: File): Promise<FacilityImage> {
    // Mock implementation
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
    
    console.log('Mock: Uploading facility image', mockImage);
    return mockImage;
  },

  async deleteFacilityImage(imageId: string): Promise<void> {
    console.log('Mock: Deleting facility image', imageId);
  },

  async setFeaturedImage(facilityId: string, imageId: string): Promise<void> {
    console.log('Mock: Setting featured image', facilityId, imageId);
  }
};

// Export for backward compatibility
export const FacilityImageService = facilityImageService;
