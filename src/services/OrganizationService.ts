
import { supabase } from '@/integrations/supabase/client';
import { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/api';
import { Database } from '@/types/database';

type OrganizationType = Database['public']['Enums']['organization_type'];
type OrganizationStatus = Database['public']['Enums']['organization_status'];

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  org_number?: string;
  contact_email: string;
  contact_phone?: string;
  website?: string;
  description?: string;
  address_street: string;
  address_city: string;
  address_postal_code: string;
  address_country: string;
  status: OrganizationStatus;
  verification_level: 'unverified' | 'email-verified' | 'document-verified' | 'fully-verified';
  parent_organization_id?: string;
  founded_year?: number;
  member_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationContact {
  id: string;
  organization_id: string;
  user_id: string;
  role: string;
  is_primary: boolean;
  can_make_bookings: boolean;
  can_approve_bookings: boolean;
  can_manage_members: boolean;
  created_at: string;
}

export class OrganizationService {
  static async getOrganizations(
    pagination?: PaginationParams,
    filters?: {
      type?: string;
      status?: string;
      search?: string;
    }
  ): Promise<ApiResponse<PaginatedResponse<Organization>>> {
    try {
      let query = supabase
        .from('organizations')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

      // Apply filters with proper type casting
      if (filters?.type) {
        query = query.eq('type', filters.type as OrganizationType);
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status as OrganizationStatus);
      }
      
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply pagination
      if (pagination) {
        const from = (pagination.page - 1) * pagination.limit;
        const to = from + pagination.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch organizations',
            details: error
          }
        };
      }

      const totalPages = pagination ? Math.ceil((count || 0) / pagination.limit) : 1;

      return {
        success: true,
        data: {
          data: data || [],
          pagination: {
            page: pagination?.page || 1,
            limit: pagination?.limit || data?.length || 0,
            total: count || 0,
            totalPages,
            hasNext: pagination ? pagination.page < totalPages : false,
            hasPrev: pagination ? pagination.page > 1 : false
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch organizations',
          details: error
        }
      };
    }
  }

  static async getOrganizationById(id: string): Promise<ApiResponse<Organization>> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch organization',
            details: error
          }
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch organization',
          details: error
        }
      };
    }
  }

  static async getUserOrganizations(userId?: string): Promise<ApiResponse<Organization[]>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const targetUserId = userId || user?.id;

      if (!targetUserId) {
        return {
          success: false,
          error: {
            message: 'User not authenticated',
            code: 'UNAUTHENTICATED'
          }
        };
      }

      const { data, error } = await supabase
        .from('organization_contacts')
        .select(`
          organization_id,
          role,
          is_primary,
          can_make_bookings,
          can_approve_bookings,
          organizations (*)
        `)
        .eq('user_id', targetUserId);

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to fetch user organizations',
            details: error
          }
        };
      }

      const organizations = data?.map(contact => contact.organizations).filter(Boolean) || [];

      return {
        success: true,
        data: organizations as Organization[]
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to fetch user organizations',
          details: error
        }
      };
    }
  }

  static async createOrganization(
    organizationData: Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'status' | 'verification_level' | 'is_active'>
  ): Promise<ApiResponse<Organization>> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .insert({
          ...organizationData,
          status: 'pending-verification' as OrganizationStatus,
          verification_level: 'unverified',
          is_active: true
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to create organization',
            details: error
          }
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to create organization',
          details: error
        }
      };
    }
  }

  static async updateOrganization(
    id: string,
    updates: Partial<Organization>
  ): Promise<ApiResponse<Organization>> {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: {
            message: 'Failed to update organization',
            details: error
          }
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Failed to update organization',
          details: error
        }
      };
    }
  }
}
