
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
        .from('organizations')
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
        data: data ? this.mapToOrganization(data) : null
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
        .from('organizations')
        .select('*')
        .in('verification_level', ['document-verified', 'fully-verified']);

      if (error) {
        return {
          data: [],
          error: error.message
        };
      }

      return {
        data: data ? data.map(item => this.mapToOrganization(item)) : []
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
        .from('organizations')
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
        data: data ? this.mapToOrganization(data) : null
      };
    } catch (error: any) {
      return {
        data: null,
        error: error.message
      };
    }
  }

  private mapToOrganization(dbRow: any): Organization {
    return {
      id: dbRow.id,
      name: dbRow.name,
      type: dbRow.type,
      orgNumber: dbRow.org_number,
      contactEmail: dbRow.contact_email,
      contactPhone: dbRow.contact_phone,
      address: {
        street: dbRow.address_street,
        city: dbRow.address_city,
        postalCode: dbRow.address_postal_code,
        country: dbRow.address_country
      },
      status: dbRow.status,
      verificationLevel: dbRow.verification_level,
      // Remove vatNumber as it doesn't exist in Organization type
      bankAccount: dbRow.bank_account,
      parentOrganizationId: dbRow.parent_organization_id,
      foundedYear: dbRow.founded_year,
      memberCount: dbRow.member_count,
      isActive: dbRow.is_active,
      createdAt: new Date(dbRow.created_at),
      updatedAt: new Date(dbRow.updated_at)
    };
  }
}

// Export singleton instance
export const organizationRepository = new OrganizationRepository();
