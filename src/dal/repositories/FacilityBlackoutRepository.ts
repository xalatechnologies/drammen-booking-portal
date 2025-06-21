
import { BaseRepository } from '../BaseRepository';
import { PaginationParams, ApiResponse, PaginatedResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

interface FacilityBlackout {
  id: string;
  facility_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  type: string;
  created_by: string;
  created_at: string;
  facility?: {
    id: number;
    name: string;
    type: string;
  };
}

interface FacilityBlackoutFilters {
  facilityId?: number;
  active?: boolean;
}

interface FacilityBlackoutCreateRequest {
  facility_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  type?: string;
}

interface FacilityBlackoutUpdateRequest extends Partial<FacilityBlackoutCreateRequest> {}

export class FacilityBlackoutRepository extends BaseRepository<FacilityBlackout, FacilityBlackoutFilters, FacilityBlackoutCreateRequest, FacilityBlackoutUpdateRequest> {
  private static readonly EDGE_FUNCTION_URL = 'https://szpdoihoxzlivothoyva.supabase.co/functions/v1/facility-blackouts';

  constructor() {
    super([]);
    console.log("FacilityBlackoutRepository - Using Supabase backend");
  }

  protected getId(blackout: FacilityBlackout): string {
    return blackout.id;
  }

  protected applyFilters(blackouts: FacilityBlackout[], filters: FacilityBlackoutFilters): FacilityBlackout[] {
    return blackouts;
  }

  protected createEntity(request: FacilityBlackoutCreateRequest): FacilityBlackout {
    throw new Error('Use createAsync instead');
  }

  protected updateEntity(existing: FacilityBlackout, request: FacilityBlackoutUpdateRequest): FacilityBlackout {
    throw new Error('Use updateAsync instead');
  }

  async getAll(pagination?: PaginationParams, filters?: FacilityBlackoutFilters): Promise<ApiResponse<PaginatedResponse<FacilityBlackout>>> {
    try {
      console.log("FacilityBlackoutRepository.getAll - Called with:", { pagination, filters });
      
      const params = new URLSearchParams();
      
      if (pagination) {
        params.append('page', pagination.page.toString());
        params.append('limit', pagination.limit.toString());
      }
      
      if (filters) {
        if (filters.facilityId) params.append('facilityId', filters.facilityId.toString());
        if (filters.active !== undefined) params.append('active', filters.active.toString());
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${FacilityBlackoutRepository.EDGE_FUNCTION_URL}?${params.toString()}`, {
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
      console.log("FacilityBlackoutRepository.getAll - Response:", result);
      return result;
    } catch (error) {
      console.error('FacilityBlackoutRepository.getAll - Error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to fetch blackout periods',
          details: error
        }
      };
    }
  }

  async getById(id: string): Promise<ApiResponse<FacilityBlackout>> {
    try {
      console.log("FacilityBlackoutRepository.getById - Called with ID:", id);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${FacilityBlackoutRepository.EDGE_FUNCTION_URL}/${id}`, {
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
      console.log("FacilityBlackoutRepository.getById - Response:", result);
      return result;
    } catch (error) {
      console.error('FacilityBlackoutRepository.getById - Error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to fetch blackout period',
          details: error
        }
      };
    }
  }

  async createAsync(blackoutData: FacilityBlackoutCreateRequest): Promise<ApiResponse<FacilityBlackout>> {
    try {
      console.log("FacilityBlackoutRepository.createAsync - Called with:", blackoutData);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(FacilityBlackoutRepository.EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(blackoutData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("FacilityBlackoutRepository.createAsync - Response:", result);
      return result;
    } catch (error) {
      console.error('FacilityBlackoutRepository.createAsync - Error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to create blackout period',
          details: error
        }
      };
    }
  }

  async updateAsync(id: string, blackoutData: FacilityBlackoutUpdateRequest): Promise<ApiResponse<FacilityBlackout>> {
    try {
      console.log("FacilityBlackoutRepository.updateAsync - Called with:", { id, blackoutData });
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${FacilityBlackoutRepository.EDGE_FUNCTION_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session ? `Bearer ${session.access_token}` : `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(blackoutData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("FacilityBlackoutRepository.updateAsync - Response:", result);
      return result;
    } catch (error) {
      console.error('FacilityBlackoutRepository.updateAsync - Error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to update blackout period',
          details: error
        }
      };
    }
  }

  async deleteAsync(id: string): Promise<ApiResponse<FacilityBlackout>> {
    try {
      console.log("FacilityBlackoutRepository.deleteAsync - Called with ID:", id);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${FacilityBlackoutRepository.EDGE_FUNCTION_URL}/${id}`, {
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
      console.log("FacilityBlackoutRepository.deleteAsync - Response:", result);
      return result;
    } catch (error) {
      console.error('FacilityBlackoutRepository.deleteAsync - Error:', error);
      return {
        success: false,
        error: {
          message: 'Failed to delete blackout period',
          details: error
        }
      };
    }
  }
}

export const facilityBlackoutRepository = new FacilityBlackoutRepository();
