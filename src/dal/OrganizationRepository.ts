
import { supabase } from '@/integrations/supabase/client';

export class OrganizationRepository {
  async getAllOrganizations() {
    try {
      // Use app_actors table instead of organizations
      const { data, error } = await supabase
        .from('app_actors')
        .select('*')
        .eq('is_paraply', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching organizations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Organization fetch error:', error);
      return [];
    }
  }

  async getOrganizationById(id: string) {
    try {
      const { data, error } = await supabase
        .from('app_actors')
        .select('*')
        .eq('id', id)
        .eq('is_paraply', true)
        .single();

      if (error) {
        console.error('Error fetching organization:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Organization fetch error:', error);
      return null;
    }
  }

  async createOrganization(organizationData: any) {
    try {
      const { data, error } = await supabase
        .from('app_actors')
        .insert([{
          ...organizationData,
          is_paraply: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating organization:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Organization creation error:', error);
      return null;
    }
  }
}

export const organizationRepository = new OrganizationRepository();
