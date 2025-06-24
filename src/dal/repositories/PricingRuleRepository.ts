import { SupabaseRepository } from '../SupabaseRepository';
import { supabase } from '@/integrations/supabase/client';
import { RepositoryResponse } from '@/types/api';

// Import the type for a pricing rule row from Supabase
import { Database } from '@/integrations/supabase/types';

type PricingRuleRow = Database['public']['Tables']['pricing_rules']['Row'];

type PricingRuleCreateRequest = Omit<Database['public']['Tables']['pricing_rules']['Insert'], 'id' | 'created_at' | 'updated_at'>;
type PricingRuleUpdateRequest = Partial<Omit<Database['public']['Tables']['pricing_rules']['Update'], 'id' | 'created_at'>>;

export class PricingRuleRepository extends SupabaseRepository<PricingRuleRow> {
  protected tableName = 'pricing_rules';

  constructor() {
    super();
  }

  async findByFacilityId(facilityId: number): Promise<RepositoryResponse<PricingRuleRow[]>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .eq('facility_id', facilityId);
      if (error) {
        return { data: [], error: error.message };
      }
      return { data: (data as unknown as PricingRuleRow[]) || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  async findByZoneId(zoneId: string): Promise<RepositoryResponse<PricingRuleRow[]>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName as any)
        .select('*')
        .eq('zone_id', zoneId);
      if (error) {
        return { data: [], error: error.message };
      }
      return { data: (data as unknown as PricingRuleRow[]) || [] };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  }

  async createPricingRule(data: PricingRuleCreateRequest): Promise<RepositoryResponse<PricingRuleRow | null>> {
    // Ensure description is always present
    const payload = {
      ...data,
      description: data.description ?? null,
    };
    return this.create(payload as any);
  }

  async updatePricingRule(id: string, data: PricingRuleUpdateRequest): Promise<RepositoryResponse<PricingRuleRow | null>> {
    return this.update(id, data);
  }

  async deletePricingRule(id: string): Promise<RepositoryResponse<boolean>> {
    return this.delete(id);
  }

  async getAllPricingRules(): Promise<RepositoryResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('pricing_rules')
        .select('*')
        .eq('is_active', true);

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

  async getPricingRulesByFacility(facilityId: number): Promise<RepositoryResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('pricing_rules')
        .select('*')
        .eq('facility_id', facilityId)
        .eq('is_active', true);

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

export const pricingRuleRepository = new PricingRuleRepository();
