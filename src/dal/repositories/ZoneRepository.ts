import { SupabaseRepository } from '../SupabaseRepository';
import { Zone } from '@/types/zone';
import { RepositoryResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

interface ZoneCreateRequest {
  name: string;
  facility_id: number;
  description?: string;
  capacity?: number;
  is_active?: boolean;
}

interface ZoneUpdateRequest extends Partial<ZoneCreateRequest> {
  status?: string;
}

export class ZoneRepository extends SupabaseRepository<Zone> {
  protected tableName = 'zones';

  constructor() {
    super();
  }

  async getAllZones(facilityId?: number): Promise<RepositoryResponse<Zone[]>> {
    try {
      let query = supabase.from('zones').select('*');
      
      if (facilityId) {
        query = query.eq('facility_id', facilityId);
      }

      const { data, error } = await query;

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      return {
        data: data || [],
        error: null
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async getZonesByFacility(facilityId: number): Promise<RepositoryResponse<Zone[]>> {
    try {
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .eq('facility_id', facilityId);

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      return {
        data: data || [],
        error: null
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const zoneRepository = new ZoneRepository();
