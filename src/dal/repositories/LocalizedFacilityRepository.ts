
import { supabase } from '@/integrations/supabase/client';

export class LocalizedFacilityRepository {
  async getFacilities(language: string = 'en') {
    try {
      // Use app_locations instead of facilities
      const { data, error } = await supabase
        .from('app_locations')
        .select(`
          *,
          app_location_images (
            id,
            image_url,
            alt_text,
            is_featured,
            display_order
          ),
          app_zones (
            id,
            code,
            name,
            capacity,
            interval
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching localized facilities:', error);
        return [];
      }

      // Transform data to match expected format
      return (data || []).map(location => ({
        id: location.id,
        name: this.getLocalizedValue(location.name, language),
        description: this.getLocalizedValue(location.description, language),
        type: location.location_type,
        area: location.address,
        capacity: location.capacity,
        images: location.app_location_images || [],
        zones: location.app_zones || []
      }));
    } catch (error) {
      console.error('Localized facility fetch error:', error);
      return [];
    }
  }

  async getFacilityById(id: string, language: string = 'en') {
    try {
      const { data, error } = await supabase
        .from('app_locations')
        .select(`
          *,
          app_location_images (
            id,
            image_url,
            alt_text,
            is_featured,
            display_order
          ),
          app_zones (
            id,
            code,
            name,
            capacity,
            interval
          )
        `)
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) {
        console.error('Error fetching localized facility:', error);
        return null;
      }

      // Transform data to match expected format
      return {
        id: data.id,
        name: this.getLocalizedValue(data.name, language),
        description: this.getLocalizedValue(data.description, language),
        type: data.location_type,
        area: data.address,
        capacity: data.capacity,
        images: data.app_location_images || [],
        zones: data.app_zones || []
      };
    } catch (error) {
      console.error('Localized facility fetch error:', error);
      return null;
    }
  }

  private getLocalizedValue(value: any, language: string): string {
    if (typeof value === 'string') {
      return value;
    }
    
    if (typeof value === 'object' && value !== null) {
      return value[language] || value['en'] || value['no'] || 'Unknown';
    }
    
    return 'Unknown';
  }

  async getZonesByFacilityId(facilityId: string, language: string = 'en') {
    try {
      const { data, error } = await supabase
        .from('app_zones')
        .select('*')
        .eq('location_id', facilityId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching zones:', error);
        return [];
      }

      return (data || []).map(zone => ({
        id: zone.id,
        name: this.getLocalizedValue(zone.name, language),
        code: zone.code,
        capacity: zone.capacity,
        interval: zone.interval
      }));
    } catch (error) {
      console.error('Zone fetch error:', error);
      return [];
    }
  }
}

export const localizedFacilityRepository = new LocalizedFacilityRepository();
