
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';
import { Facility, FacilityFilters } from '@/types/facility';

export class SupabaseFacilityService {
  private static readonly EDGE_FUNCTION_URL = 'https://szpdoihoxzlivothoyva.supabase.co/functions/v1/facilities';

  static async getFacilities(
    pagination?: PaginationParams,
    filters?: FacilityFilters
  ): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    try {
      const params = new URLSearchParams();
      
      if (pagination) {
        params.append('page', pagination.page.toString());
        params.append('limit', pagination.limit.toString());
      }
      
      if (filters) {
        if (filters.searchTerm) params.append('search', filters.searchTerm);
        if (filters.facilityType) params.append('type', filters.facilityType);
        if (filters.location) params.append('location', filters.location);
        if (filters.accessibility) params.append('accessibility', filters.accessibility);
        if (filters.availableNow) params.append('availableNow', 'true');
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${this.EDGE_FUNCTION_URL}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${supabase.supabaseKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch facilities:', error);
      return {
        success: false,
        error: {
          message: 'Failed to fetch facilities',
          details: error
        }
      };
    }
  }

  static async getFacilityById(id: number): Promise<ApiResponse<Facility>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${this.EDGE_FUNCTION_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${supabase.supabaseKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch facility:', error);
      return {
        success: false,
        error: {
          message: 'Failed to fetch facility',
          details: error
        }
      };
    }
  }

  static async createFacility(facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(this.EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify(facilityData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create facility:', error);
      return {
        success: false,
        error: {
          message: 'Failed to create facility',
          details: error
        }
      };
    }
  }

  static async updateFacility(id: number, facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${this.EDGE_FUNCTION_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify(facilityData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update facility:', error);
      return {
        success: false,
        error: {
          message: 'Failed to update facility',
          details: error
        }
      };
    }
  }

  static async deleteFacility(id: number): Promise<ApiResponse<Facility>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${this.EDGE_FUNCTION_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${supabase.supabaseKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to delete facility:', error);
      return {
        success: false,
        error: {
          message: 'Failed to delete facility',
          details: error
        }
      };
    }
  }

  static async getFacilityZones(id: number): Promise<ApiResponse<any[]>> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${this.EDGE_FUNCTION_URL}/${id}/zones`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${supabase.supabaseKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch facility zones:', error);
      return {
        success: false,
        error: {
          message: 'Failed to fetch facility zones',
          details: error
        }
      };
    }
  }
}
