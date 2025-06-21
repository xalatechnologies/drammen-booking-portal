
import { SupabaseRepository } from './SupabaseRepository';
import { Organization, OrganizationType, OrganizationStatus, VerificationLevel } from '@/types/organization';
import { RepositoryResponse } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

interface OrganizationCreateRequest {
  name: string;
  type: OrganizationType;
  contact_email: string;
  contact_phone?: string;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  address_country?: string;
  org_number?: string;
}

interface OrganizationUpdateRequest extends Partial<OrganizationCreateRequest> {
  status?: OrganizationStatus;
  verification_level?: VerificationLevel;
  is_active?: boolean;
  description?: string;
}

export class OrganizationRepository extends SupabaseRepository<Organization> {
  protected tableName = 'organizations';

  constructor() {
    super();
  }

  // Organization-specific methods
  async findByOrgNumber(orgNumber: string): Promise<RepositoryResponse<Organization | null>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('org_number', orgNumber)
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data as Organization | null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  async findVerified(): Promise<RepositoryResponse<Organization[]>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .in('verification_level', ['document-verified', 'fully-verified']);

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      return {
        data: (data as Organization[]) || []
      };
    } catch (error: any) {
      return {
        data: [],
        error: error.message
      };
    }
  }

  async updateVerificationLevel(id: string, level: VerificationLevel): Promise<RepositoryResponse<Organization | null>> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update({
          verification_level: level,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        return {
          data: null,
          error: error.message
        };
      }

      return {
        data: data as Organization | null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const organizationRepository = new OrganizationRepository();
