
import { supabase } from '@/integrations/supabase/client';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

class FilterOptionsService {
  async getFacilityTypes(): Promise<FilterOption[]> {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('type')
        .eq('status', 'active');

      if (error) {
        console.error('Failed to fetch facility types:', error);
        return this.getFallbackFacilityTypes();
      }

      const typeCounts = data.reduce((acc, facility) => {
        acc[facility.type] = (acc[facility.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(typeCounts).map(([type, count]) => ({
        value: type,
        label: this.formatFacilityTypeLabel(type),
        count
      }));
    } catch (error) {
      console.error('Error fetching facility types:', error);
      return this.getFallbackFacilityTypes();
    }
  }

  async getLocations(): Promise<FilterOption[]> {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('area, address_city')
        .eq('status', 'active');

      if (error) {
        console.error('Failed to fetch locations:', error);
        return this.getFallbackLocations();
      }

      const locationCounts = data.reduce((acc, facility) => {
        const location = facility.area || facility.address_city;
        if (location) {
          acc[location] = (acc[location] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(locationCounts).map(([location, count]) => ({
        value: location,
        label: location,
        count
      }));
    } catch (error) {
      console.error('Error fetching locations:', error);
      return this.getFallbackLocations();
    }
  }

  private formatFacilityTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'sports-hall': 'Idrettshall',
      'meeting-room': 'Møterom',
      'outdoor-field': 'Utendørs bane',
      'swimming-pool': 'Svømmehall',
      'gym': 'Treningsstudio',
      'auditorium': 'Auditorium'
    };
    return labels[type] || type;
  }

  private getFallbackFacilityTypes(): FilterOption[] {
    return [
      { value: 'sports-hall', label: 'Idrettshall' },
      { value: 'meeting-room', label: 'Møterom' },
      { value: 'outdoor-field', label: 'Utendørs bane' }
    ];
  }

  private getFallbackLocations(): FilterOption[] {
    return [
      { value: 'Drammen', label: 'Drammen' },
      { value: 'Konnerud', label: 'Konnerud' },
      { value: 'Åssiden', label: 'Åssiden' }
    ];
  }
}

export const filterOptionsService = new FilterOptionsService();
