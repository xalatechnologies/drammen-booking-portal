import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, PaginatedResponse, PaginationParams, ServiceResponse } from '@/types/api';
import { Facility, FacilityFilters } from '@/types/facility';
import { Zone } from '@/types/zone';

export class SupabaseFacilityService {
  private static readonly EDGE_FUNCTION_URL = 'https://szpdoihoxzlivothoyva.supabase.co/functions/v1/facilities';
  private static readonly ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cGRvaWhveHpsaXZvdGhveXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0Mzk5MzksImV4cCI6MjA2NjAxNTkzOX0.4j3PYVkUpQZce-631weYhyICrUKfBk3LV5drs_tYExc';

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
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${this.ANON_KEY}`,
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
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${this.ANON_KEY}`,
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
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${this.EDGE_FUNCTION_URL}/${id}/zones`, {
        method: 'GET',
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

  static async getZonesByFacilityId(facilityId: string): Promise<ServiceResponse<Zone[]>> {
    try {
      const { data, error } = await supabase
        .from('zones')
        .select(`
          id,
          name,
          facility_id,
          capacity,
          description,
          is_main_zone,
          area_sqm,
          coordinates_x,
          coordinates_y,
          coordinates_width,
          coordinates_height,
          accessibility_features,
          equipment,
          is_active
        `)
        .eq('facility_id', parseInt(facilityId))
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching zones:', error);
        return {
          success: false,
          error: {
            message: `Failed to fetch zones: ${error.message}`,
            code: 'FETCH_ERROR'
          }
        };
      }

      const zones: Zone[] = (data || []).map(zone => ({
        id: zone.id,
        facilityId: zone.facility_id.toString(),
        name: zone.name,
        description: zone.description,
        isMainZone: zone.is_main_zone || false,
        capacity: zone.capacity || 30,
        area: zone.area_sqm || 0,
        coordinates: zone.coordinates_x && zone.coordinates_y ? {
          x: zone.coordinates_x,
          y: zone.coordinates_y,
          width: zone.coordinates_width || 100,
          height: zone.coordinates_height || 80
        } : undefined,
        equipment: zone.equipment || [],
        features: [], // Default empty array since features column doesn't exist
        accessibility: zone.accessibility_features || [],
        pricing: {
          basePrice: 450,
          currency: 'NOK',
          priceRules: [],
          minimumBookingDuration: 60,
          maximumBookingDuration: 480,
          cancellationPolicy: {
            freeUntilHours: 48,
            partialRefundUntilHours: 24,
            partialRefundPercentage: 50,
            noRefundAfterHours: 2
          }
        },
        availability: {
          openingHours: [],
          blackoutPeriods: [],
          maintenanceSchedule: [],
          recurringUnavailability: []
        },
        restrictions: {
          requiresSupervision: false,
          allowedActivities: [],
          prohibitedActivities: [],
          requiresTraining: false,
          alcoholPermitted: false,
          smokingPermitted: false,
          petsAllowed: false,
          cateringAllowed: true,
          decorationsAllowed: true,
          amplifiedSoundAllowed: true,
          commercialUseAllowed: true
        },
        isActive: zone.is_active,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      return { success: true, data: zones };
    } catch (error) {
      console.error('Unexpected error fetching zones:', error);
      return {
        success: false,
        error: {
          message: 'An unexpected error occurred while fetching zones',
          code: 'UNEXPECTED_ERROR'
        }
      };
    }
  }

  static async getZoneById(zoneId: string): Promise<ServiceResponse<Zone | null>> {
    try {
      const { data, error } = await supabase
        .from('zones')
        .select(`
          id,
          name,
          facility_id,
          capacity,
          description,
          is_main_zone,
          area_sqm,
          coordinates_x,
          coordinates_y,
          coordinates_width,
          coordinates_height,
          accessibility_features,
          equipment,
          is_active
        `)
        .eq('id', zoneId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return { success: true, data: null };
        }
        console.error('Error fetching zone:', error);
        return {
          success: false,
          error: {
            message: `Failed to fetch zone: ${error.message}`,
            code: 'FETCH_ERROR'
          }
        };
      }

      const zone: Zone = {
        id: data.id,
        facilityId: data.facility_id.toString(),
        name: data.name,
        description: data.description,
        isMainZone: data.is_main_zone || false,
        capacity: data.capacity || 30,
        area: data.area_sqm || 0,
        coordinates: data.coordinates_x && data.coordinates_y ? {
          x: data.coordinates_x,
          y: data.coordinates_y,
          width: data.coordinates_width || 100,
          height: data.coordinates_height || 80
        } : undefined,
        equipment: data.equipment || [],
        features: [], // Default empty array since features column doesn't exist
        accessibility: data.accessibility_features || [],
        pricing: {
          basePrice: 450,
          currency: 'NOK',
          priceRules: [],
          minimumBookingDuration: 60,
          maximumBookingDuration: 480,
          cancellationPolicy: {
            freeUntilHours: 48,
            partialRefundUntilHours: 24,
            partialRefundPercentage: 50,
            noRefundAfterHours: 2
          }
        },
        availability: {
          openingHours: [],
          blackoutPeriods: [],
          maintenanceSchedule: [],
          recurringUnavailability: []
        },
        restrictions: {
          requiresSupervision: false,
          allowedActivities: [],
          prohibitedActivities: [],
          requiresTraining: false,
          alcoholPermitted: false,
          smokingPermitted: false,
          petsAllowed: false,
          cateringAllowed: true,
          decorationsAllowed: true,
          amplifiedSoundAllowed: true,
          commercialUseAllowed: true
        },
        isActive: data.is_active,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return { success: true, data: zone };
    } catch (error) {
      console.error('Unexpected error fetching zone:', error);
      return {
        success: false,
        error: {
          message: 'An unexpected error occurred while fetching zone',
          code: 'UNEXPECTED_ERROR'
        }
      };
    }
  }
}
