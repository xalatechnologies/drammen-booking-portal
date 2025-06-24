
import { SupabaseRepository } from '../SupabaseRepository';
import { Facility, FacilityFilters, OpeningHours } from '@/types/facility';
import { PaginationParams, ApiResponse, PaginatedResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

interface FacilityCreateRequest {
  name: string;
  address: string;
  type: string;
  area: string;
  description: string;
  capacity: number;
  accessibility: string[];
  suitableFor: string[];
  equipment: string[];
  openingHours: OpeningHours[];
  image: string;
}

interface FacilityUpdateRequest extends Partial<FacilityCreateRequest> {
  nextAvailable?: string;
  rating?: number;
  reviewCount?: number;
  pricePerHour?: number;
  amenities?: string[];
  hasAutoApproval?: boolean;
}

const getLocalizedText = (value: any, fallback: string = 'Unknown'): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value !== null) {
    return value.no || value.en || value.nb || fallback;
  }
  return fallback;
};

export class FacilityRepository extends SupabaseRepository<Facility> {
  protected tableName = 'app_locations';

  constructor() {
    super();
    console.log("FacilityRepository - Using Supabase backend");
  }

  async getAll(pagination?: PaginationParams, filters?: FacilityFilters): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    try {
      let query = supabase
        .from('app_locations')
        .select(`
          *,
          app_location_images (
            id,
            image_url,
            alt_text,
            is_featured
          )
        `, { count: 'exact' })
        .eq('is_published', true);

      // Apply filters
      if (filters?.facilityType && filters.facilityType !== 'all') {
        query = query.eq('location_type', filters.facilityType);
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);
      }

      query = query.order('name');

      const { data, error, count } = await query;

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch facilities',
            details: error
          }
        };
      }

      const facilities = (data || []).map((location: any) => ({
        id: location.id,
        name: getLocalizedText(location.name, 'Unknown Facility'),
        type: location.location_type || 'facility',
        area: location.address || '',
        description: getLocalizedText(location.description, ''),
        capacity: location.capacity || 0,
        price_per_hour: location.price_per_hour || 450,
        address_street: location.address || '',
        address_city: '',
        address_postal_code: '',
        equipment: location.equipment || [],
        amenities: location.amenities || [],
        accessibility_features: location.accessibility_features || [],
        is_featured: location.is_featured || false,
        status: location.status || 'active',
        facility_images: location.app_location_images || []
      }));

      const totalPages = pagination ? Math.ceil((count || 0) / pagination.limit) : 1;

      return {
        success: true,
        data: {
          data: facilities,
          pagination: {
            page: pagination?.page || 1,
            limit: pagination?.limit || facilities.length || 0,
            total: count || 0,
            totalPages,
            hasNext: pagination ? pagination.page < totalPages : false,
            hasPrev: pagination ? pagination.page > 1 : false
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch facilities',
          details: error
        }
      };
    }
  }

  async getById(id: string): Promise<ApiResponse<Facility>> {
    try {
      const { data, error } = await supabase
        .from('app_locations')
        .select(`
          *,
          app_location_images (
            id,
            image_url,
            alt_text,
            is_featured
          )
        `)
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch facility',
            details: error
          }
        };
      }

      const facility = {
        id: data.id,
        name: getLocalizedText(data.name, 'Unknown Facility'),
        type: data.location_type || 'facility',
        area: data.address || '',
        description: getLocalizedText(data.description, ''),
        capacity: data.capacity || 0,
        price_per_hour: data.price_per_hour || 450,
        address_street: data.address || '',
        address_city: '',
        address_postal_code: '',
        equipment: data.equipment || [],
        amenities: data.amenities || [],
        accessibility_features: data.accessibility_features || [],
        is_featured: data.is_featured || false,
        status: data.status || 'active',
        facility_images: data.app_location_images || []
      };

      return {
        success: true,
        data: facility
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch facility',
          details: error
        }
      };
    }
  }

  async createAsync(facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    // Implementation for creating facilities would go here
    return {
      success: false,
      error: {
        message: 'Create functionality not implemented yet'
      }
    };
  }

  async updateAsync(id: string, facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    // Implementation for updating facilities would go here
    return {
      success: false,
      error: {
        message: 'Update functionality not implemented yet'
      }
    };
  }

  async deleteAsync(id: string): Promise<ApiResponse<Facility>> {
    // Implementation for deleting facilities would go here
    return {
      success: false,
      error: {
        message: 'Delete functionality not implemented yet'
      }
    };
  }

  async getFacilitiesByType(type: string) {
    return this.getAll(undefined, { facilityType: type });
  }

  async getFacilitiesByArea(area: string) {
    // Implementation for getting facilities by area would go here
    return {
      success: false,
      error: {
        message: 'Get by area functionality not implemented yet'
      }
    };
  }

  async getFacilityZones(id: string) {
    // Implementation for getting facility zones would go here
    return {
      success: false,
      error: {
        message: 'Get zones functionality not implemented yet'
      }
    };
  }
}

// Export singleton instance
export const facilityRepository = new FacilityRepository();
