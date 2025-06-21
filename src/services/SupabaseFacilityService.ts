import { supabase } from '@/integrations/supabase/client';
import { Facility, FacilityFilters } from '@/types/facility';
import { PaginationParams, ApiResponse, PaginatedResponse } from '@/types/api';
import { transformDatabaseFacility } from '@/utils/facilityTransformer';

export class SupabaseFacilityService {
  private static readonly BASE_URL = 'https://szpdoihoxzlivothoyva.supabase.co/functions/v1';

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
          'Authorization': `Bearer ${supabase.supabaseKey}`,
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
          transformDatabaseFacility(facility)
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
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('SupabaseFacilityService.getFacilityById - HTTP error:', response.status, response.statusText);
        
        if (response.status === 404) {
          return {
            success: false,
            error: { message: 'Facility not found', code: 'NOT_FOUND' }
          };
        }
        
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('SupabaseFacilityService.getFacilityById - Raw response:', result);

      if (result.success && result.data) {
        // Transform facility from database format to frontend format
        const transformedFacility = transformDatabaseFacility(result.data);
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
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facilityData),
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          success: true,
          data: transformDatabaseFacility(result.data)
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
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facilityData),
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          success: true,
          data: transformDatabaseFacility(result.data)
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
          'Authorization': `Bearer ${supabase.supabaseKey}`,
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
          'Authorization': `Bearer ${supabase.supabaseKey}`,
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
