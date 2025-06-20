
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';
import { Facility, FacilityFilters } from '@/types/facility';

export class SupabaseFacilityService {
  private static readonly EDGE_FUNCTION_URL = 'https://szpdoihoxzlivothoyva.supabase.co/functions/v1/facilities';
  private static readonly ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cGRvaWhveHpsaXZvdGhveXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0Mzk5MzksImV4cCI6MjA2NjAxNTkzOX0.4j3PYVkUpQZce-631weYhyICrUKfBk3LV5drs_tYExc';

  static async getFacilities(
    pagination?: PaginationParams,
    filters?: FacilityFilters
  ): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    try {
      console.log('SupabaseFacilityService.getFacilities - Called with:', { pagination, filters });
      
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

      console.log('SupabaseFacilityService.getFacilities - Request params:', params.toString());

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${this.EDGE_FUNCTION_URL}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${this.ANON_KEY}`,
        },
      });

      console.log('SupabaseFacilityService.getFacilities - HTTP response status:', response.status);

      if (!response.ok) {
        console.error('SupabaseFacilityService.getFacilities - HTTP error:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('SupabaseFacilityService.getFacilities - Response data:', result);
      return result;
    } catch (error) {
      console.error('SupabaseFacilityService.getFacilities - Failed to fetch facilities:', error);
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
      console.log('SupabaseFacilityService.getFacilityById - Called with ID:', id);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${this.EDGE_FUNCTION_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${this.ANON_KEY}`,
        },
      });

      console.log('SupabaseFacilityService.getFacilityById - HTTP response status:', response.status);

      if (!response.ok) {
        console.error('SupabaseFacilityService.getFacilityById - HTTP error:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('SupabaseFacilityService.getFacilityById - Response data:', result);
      return result;
    } catch (error) {
      console.error('SupabaseFacilityService.getFacilityById - Failed to fetch facility:', error);
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
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${this.ANON_KEY}`,
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
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${this.ANON_KEY}`,
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
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${this.ANON_KEY}`,
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
      console.log('SupabaseFacilityService.getFacilityZones - Called with facility ID:', id);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${this.EDGE_FUNCTION_URL}/${id}/zones`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${this.ANON_KEY}`,
        },
      });

      console.log('SupabaseFacilityService.getFacilityZones - HTTP response status:', response.status);

      if (!response.ok) {
        console.error('SupabaseFacilityService.getFacilityZones - HTTP error:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('SupabaseFacilityService.getFacilityZones - Response data:', result);
      return result;
    } catch (error) {
      console.error('SupabaseFacilityService.getFacilityZones - Failed to fetch facility zones:', error);
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
