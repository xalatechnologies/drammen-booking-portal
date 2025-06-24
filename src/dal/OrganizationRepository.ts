
import { supabase } from "@/integrations/supabase/client";

export interface Organization {
  id: string;
  name: string;
  type: string;
  verification_level: string;
  contact_info: any;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export type VerificationLevel = 'unverified' | 'pending' | 'verified' | 'rejected';

export class OrganizationRepository {
  static async getAll(): Promise<Organization[]> {
    // Use the new app_actors table instead of organizations
    const { data, error } = await supabase
      .from('app_actors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform app_actors to match Organization interface
    return (data || []).map(actor => ({
      id: actor.id,
      name: typeof actor.name === 'object' ? actor.name.NO || actor.name.EN || 'Unknown' : String(actor.name),
      type: actor.type,
      verification_level: 'verified', // Default for now
      contact_info: actor.contact_info || {},
      metadata: actor.metadata || {},
      created_at: actor.created_at,
      updated_at: actor.updated_at
    }));
  }

  static async getById(id: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from('app_actors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    if (!data) return null;

    return {
      id: data.id,
      name: typeof data.name === 'object' ? data.name.NO || data.name.EN || 'Unknown' : String(data.name),
      type: data.type,
      verification_level: 'verified', // Default for now
      contact_info: data.contact_info || {},
      metadata: data.metadata || {},
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  static async updateVerificationLevel(id: string, level: VerificationLevel): Promise<void> {
    // For now, we'll update the metadata to store verification level
    const { error } = await supabase
      .from('app_actors')
      .update({ 
        metadata: { verification_level: level },
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) throw error;
  }

  static async create(organization: Partial<Organization>): Promise<Organization> {
    const { data, error } = await supabase
      .from('app_actors')
      .insert({
        type: organization.type || 'private-firma',
        name: { NO: organization.name || 'New Organization' },
        contact_info: organization.contact_info || {},
        metadata: { 
          verification_level: organization.verification_level || 'unverified',
          ...organization.metadata 
        }
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: typeof data.name === 'object' ? data.name.NO || data.name.EN || 'Unknown' : String(data.name),
      type: data.type,
      verification_level: data.metadata?.verification_level || 'unverified',
      contact_info: data.contact_info || {},
      metadata: data.metadata || {},
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }
}
