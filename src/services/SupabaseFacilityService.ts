import { supabase } from '@/integrations/supabase/client';
import { Facility, FacilityFilters } from '@/types/facility';
import { PaginationParams, ApiResponse, PaginatedResponse } from '@/types/api';
import { transformDatabaseFacility } from '@/utils/facilityTransformer';

export class SupabaseFacilityService {
  private static readonly BASE_URL = 'https://szpdoihoxzlivothoyva.supabase.co/functions/v1';
  private static readonly ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cGRvaWhveHpsaXZvdGhveXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0Mzk5MzksImV4cCI6MjA2NjAxNTkzOX0.4j3PYVkUpQZce-631weYhyICrUKfBk3LV5drs_tYExc';

  private static transformCoreFacilityToFacility(coreFacility: any): Facility {
    console.log('SupabaseFacilityService - Raw facility data from API:', coreFacility);
    
    // Ensure we have valid data before processing
    if (!coreFacility || typeof coreFacility !== 'object') {
      console.error('SupabaseFacilityService - Invalid facility data:', coreFacility);
      throw new Error('Invalid facility data received from API');
    }

    // Extract address fields directly - they should be simple strings
    const addressStreet = coreFacility.address_street;
    const addressCity = coreFacility.address_city;
    const addressPostal = coreFacility.address_postal_code;
    
    console.log('SupabaseFacilityService - Raw address fields:', {
      address_street: typeof addressStreet + ': ' + JSON.stringify(addressStreet),
      address_city: typeof addressCity + ': ' + JSON.stringify(addressCity),
      address_postal_code: typeof addressPostal + ': ' + JSON.stringify(addressPostal)
    });

    // Compute the address from individual fields with better null checks
    const addressParts = [addressStreet, addressCity, addressPostal].filter(part => 
      part && 
      typeof part === 'string' && 
      part.trim() !== '' && 
      part !== 'null' && 
      part !== 'undefined' &&
      part.toLowerCase() !== 'undefined'
    );
    
    const computedAddress = addressParts.length > 0 
      ? addressParts.join(', ') 
      : '';

    console.log('SupabaseFacilityService - Address computation result:', {
      addressParts,
      computedAddress
    });

    // Get image URL - prioritize featured image first
    let imageUrl = '';
    
    console.log('SupabaseFacilityService - Image data processing:', {
      featuredImage: coreFacility.featuredImage,
      images: coreFacility.images,
      image_url: coreFacility.image_url
    });

    if (coreFacility.featuredImage?.image_url) {
      imageUrl = coreFacility.featuredImage.image_url;
      console.log('SupabaseFacilityService - Using featured image:', imageUrl);
    } else if (coreFacility.images && Array.isArray(coreFacility.images) && coreFacility.images.length > 0) {
      // Find featured image in array or use first image
      const featured = coreFacility.images.find(img => img.is_featured);
      imageUrl = featured ? featured.image_url : coreFacility.images[0].image_url;
      console.log('SupabaseFacilityService - Using image from array:', imageUrl);
    } else if (coreFacility.image_url) {
      imageUrl = coreFacility.image_url;
      console.log('SupabaseFacilityService - Using direct image_url:', imageUrl);
    }
    
    // Only use fallback if no image found
    if (!imageUrl) {
      imageUrl = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop';
      console.log('SupabaseFacilityService - Using fallback image');
    }

    const transformedFacility = {
      // Core facility properties
      ...coreFacility,
      
      // Add missing Facility properties with defaults
      name: coreFacility.name || 'Unnamed Facility',
      description: coreFacility.description || '',
      suitableFor: coreFacility.suitableFor || [],
      equipment: coreFacility.equipment || [],
      amenities: coreFacility.amenities || coreFacility.accessibility_features || [],
      
      // Computed properties for backwards compatibility
      address: computedAddress,
      image: imageUrl,
      pricePerHour: coreFacility.price_per_hour || 450,
      accessibility: coreFacility.accessibility_features || [],
      hasAutoApproval: coreFacility.has_auto_approval || false,
      nextAvailable: coreFacility.next_available || '',
      timeSlotDuration: coreFacility.time_slot_duration as 1 | 2 || 1,
      season: {
        from: coreFacility.season_from || '2024-01-01',
        to: coreFacility.season_to || '2024-12-31'
      },
      
      // Add image data
      featuredImage: coreFacility.featuredImage,
      images: coreFacility.images || []
    };

    console.log('SupabaseFacilityService - Final transformed facility:', {
      id: transformedFacility.id,
      name: transformedFacility.name,
      address: transformedFacility.address,
      image: transformedFacility.image
    });

    return transformedFacility;
  }

  static async getFacilities(
    pagination?: PaginationParams,
    filters?: FacilityFilters,
    sort?: any
  ): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    try {
      console.log('SupabaseFacilityService.getFacilities - Calling edge function with:', { pagination, filters, sort });

      const params = new URLSearchParams();
      
      if (pagination?.page) params.append('page', pagination.page.toString());
      if (pagination?.limit) params.append('limit', pagination.limit.toString());
      if (filters?.searchTerm) params.append('search', filters.searchTerm);
      if (filters?.facilityType) params.append('type', filters.facilityType);
      if (filters?.location) params.append('area', filters.location);
      if (sort?.field) params.append('sort_by', sort.field);
      if (sort?.direction) params.append('sort_direction', sort.direction);

      const url = `${this.BASE_URL}/facilities?${params.toString()}`;
      console.log('SupabaseFacilityService.getFacilities - Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('SupabaseFacilityService.getFacilities - HTTP error:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('SupabaseFacilityService.getFacilities - Raw response:', result);

      if (result.success && result.data && Array.isArray(result.data.data)) {
        // Transform each facility from database format to frontend format
        const transformedFacilities = result.data.data.map((facility: any) => 
          this.transformCoreFacilityToFacility(facility)
        );
        
        console.log('SupabaseFacilityService.getFacilities - Transformed facilities:', transformedFacilities.slice(0, 2));

        return {
          success: true,
          data: {
            data: transformedFacilities,
            pagination: result.data.pagination
          }
        };
      }

      return {
        success: false,
        error: { message: 'Invalid response format from facilities endpoint' }
      };
    } catch (error) {
      console.error('SupabaseFacilityService.getFacilities - Error:', error);
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error occurred' }
      };
    }
  }

  static async getFacilityById(id: number): Promise<ApiResponse<Facility>> {
    try {
      console.log('SupabaseFacilityService.getFacilityById - Calling edge function with ID:', id);

      const url = `${this.BASE_URL}/facilities/${id}`;
      console.log('SupabaseFacilityService.getFacilityById - Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('SupabaseFacilityService.getFacilityById - HTTP error:', response.status, response.statusText);
        
        if (response.status === 404) {
          return {
            success: false,
            error: { message: 'Facility not found' }
          };
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('SupabaseFacilityService.getFacilityById - Raw response:', result);

      if (result.success && result.data) {
        // Transform facility from database format to frontend format
        const transformedFacility = this.transformCoreFacilityToFacility(result.data);
        console.log('SupabaseFacilityService.getFacilityById - Transformed facility:', transformedFacility);

        return {
          success: true,
          data: transformedFacility
        };
      }

      return {
        success: false,
        error: result.error || { message: 'Invalid response format from facility endpoint' }
      };
    } catch (error) {
      console.error('SupabaseFacilityService.getFacilityById - Error:', error);
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error occurred' }
      };
    }
  }

  static async createFacility(facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    try {
      const response = await fetch(`${this.BASE_URL}/facilities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facilityData),
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          success: true,
          data: this.transformCoreFacilityToFacility(result.data)
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error occurred' }
      };
    }
  }

  static async updateFacility(id: number, facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    try {
      const response = await fetch(`${this.BASE_URL}/facilities/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facilityData),
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          success: true,
          data: this.transformCoreFacilityToFacility(result.data)
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error occurred' }
      };
    }
  }

  static async deleteFacility(id: number): Promise<ApiResponse<Facility>> {
    try {
      const response = await fetch(`${this.BASE_URL}/facilities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error occurred' }
      };
    }
  }

  static async getFacilityZones(id: number): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${this.BASE_URL}/facilities/${id}/zones`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Unknown error occurred' }
      };
    }
  }
}
