
import { BaseRepository } from '../BaseRepository';
import { Zone, ZoneAvailabilityStatus } from '@/types/zone';
import { PaginationParams, ApiResponse, PaginatedResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

interface ZoneFilters {
  facilityId?: string;
  type?: string;
  capacity?: number;
  isMainZone?: boolean;
  bookableIndependently?: boolean;
}

interface ZoneCreateRequest {
  name: string;
  facility_id: number;
  type?: string;
  capacity?: number;
  description?: string;
  is_main_zone?: boolean;
  parent_zone_id?: string;
  bookable_independently?: boolean;
  area_sqm?: number;
  floor?: string;
  coordinates_x?: number;
  coordinates_y?: number;
  coordinates_width?: number;
  coordinates_height?: number;
  equipment?: string[];
  accessibility_features?: string[];
}

interface ZoneUpdateRequest extends Partial<ZoneCreateRequest> {}

export class ZoneRepository extends BaseRepository<Zone, ZoneFilters, ZoneCreateRequest, ZoneUpdateRequest> {
  private static readonly EDGE_FUNCTION_URL = 'https://szpdoihoxzlivothoyva.supabase.co/functions/v1/zones';

  constructor() {
    super([]); // No mock data needed
    console.log("ZoneRepository - Using Supabase backend");
  }

  protected getId(zone: Zone): string {
    return zone.id;
  }

  protected applyFilters(zones: Zone[], filters: ZoneFilters): Zone[] {
    // Filters are applied server-side
    return zones;
  }

  protected createEntity(request: ZoneCreateRequest): Zone {
    throw new Error('Use createAsync instead - now handled by Supabase');
  }

  protected updateEntity(existing: Zone, request: ZoneUpdateRequest): Zone {
    throw new Error('Use updateAsync instead - now handled by Supabase');
  }

  async getAll(pagination?: PaginationParams, filters?: ZoneFilters): Promise<ApiResponse<PaginatedResponse<Zone>>> {
    try {
      console.log("ZoneRepository.getAll - Called with:", { pagination, filters });
      
      const params = new URLSearchParams();
      
      if (pagination) {
        params.append('page', pagination.page.toString());
        params.append('limit', pagination.limit.toString());
      }
      
      if (filters) {
        if (filters.facilityId) params.append('facilityId', filters.facilityId);
        if (filters.type) params.append('type', filters.type);
        if (filters.capacity) params.append('capacity', filters.capacity.toString());
        if (filters.isMainZone !== undefined) params.append('isMainZone', filters.isMainZone.toString());
        if (filters.bookableIndependently !== undefined) params.append('bookableIndependently', filters.bookableIndependently.toString());
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${ZoneRepository.EDGE_FUNCTION_URL}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("ZoneRepository.getAll - Response:", result);
      return result;
    } catch (error) {
      console.error('ZoneRepository.getAll - Error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to fetch zones',
          details: error
        }
      };
    }
  }

  async getById(id: string): Promise<ApiResponse<Zone>> {
    try {
      console.log("ZoneRepository.getById - Called with ID:", id);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${ZoneRepository.EDGE_FUNCTION_URL}/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("ZoneRepository.getById - Response:", result);
      return result;
    } catch (error) {
      console.error('ZoneRepository.getById - Error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to fetch zone',
          details: error
        }
      };
    }
  }

  async createAsync(zoneData: ZoneCreateRequest): Promise<ApiResponse<Zone>> {
    try {
      console.log("ZoneRepository.createAsync - Called with:", zoneData);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(ZoneRepository.EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(zoneData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("ZoneRepository.createAsync - Response:", result);
      return result;
    } catch (error) {
      console.error('ZoneRepository.createAsync - Error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to create zone',
          details: error
        }
      };
    }
  }

  async updateAsync(id: string, zoneData: ZoneUpdateRequest): Promise<ApiResponse<Zone>> {
    try {
      console.log("ZoneRepository.updateAsync - Called with:", { id, zoneData });
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${ZoneRepository.EDGE_FUNCTION_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(zoneData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("ZoneRepository.updateAsync - Response:", result);
      return result;
    } catch (error) {
      console.error('ZoneRepository.updateAsync - Error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to update zone',
          details: error
        }
      };
    }
  }

  async deleteAsync(id: string): Promise<ApiResponse<Zone>> {
    try {
      console.log("ZoneRepository.deleteAsync - Called with ID:", id);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${ZoneRepository.EDGE_FUNCTION_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("ZoneRepository.deleteAsync - Response:", result);
      return result;
    } catch (error) {
      console.error('ZoneRepository.deleteAsync - Error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to delete zone',
          details: error
        }
      };
    }
  }

  async checkZoneConflicts(
    zoneId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<ApiResponse<{ hasConflicts: boolean; conflicts: any[]; rules: any[] }>> {
    try {
      console.log("ZoneRepository.checkZoneConflicts - Called with:", { zoneId, startDate, endDate });
      
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${ZoneRepository.EDGE_FUNCTION_URL}/${zoneId}/conflicts?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("ZoneRepository.checkZoneConflicts - Response:", result);
      return result;
    } catch (error) {
      console.error('ZoneRepository.checkZoneConflicts - Error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to check zone conflicts',
          details: error
        }
      };
    }
  }

  async getZonesByFacility(facilityId: string): Promise<ApiResponse<Zone[]>> {
    const result = await this.getAll({ page: 1, limit: 100 }, { facilityId });
    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.data
      };
    }
    return {
      success: false,
      error: result.error || { message: 'Failed to fetch zones by facility' }
    };
  }
}

// Export singleton instance
export const zoneRepository = new ZoneRepository();
