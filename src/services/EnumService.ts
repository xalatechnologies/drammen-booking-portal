
import { supabase } from '@/integrations/supabase/client';
import { EnumOption, EnumType } from '@/types/enum';

class EnumService {
  private cache = new Map<string, EnumOption[]>();

  async getEnumOptions(enumType: EnumType, language: 'NO' | 'EN' = 'NO'): Promise<EnumOption[]> {
    const cacheKey = `${enumType}_${language}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const { data: systemEnums, error } = await supabase
        .from('system_enums')
        .select(`
          id,
          enum_key,
          display_order,
          is_active,
          metadata,
          enum_translations!inner(
            label,
            description,
            short_label,
            language_code
          )
        `)
        .eq('enum_type', enumType)
        .eq('enum_translations.language_code', language)
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        console.error('Failed to fetch enum options:', error);
        return this.getFallbackOptions(enumType);
      }

      const options: EnumOption[] = (systemEnums || []).map(item => ({
        id: item.id,
        key: item.enum_key,
        label: item.enum_translations[0]?.label || item.enum_key,
        description: item.enum_translations[0]?.description,
        shortLabel: item.enum_translations[0]?.short_label,
        displayOrder: item.display_order,
        isActive: item.is_active,
        metadata: item.metadata as Record<string, any> || {}
      }));

      this.cache.set(cacheKey, options);
      return options;
    } catch (error) {
      console.error('Error fetching enum options:', error);
      return this.getFallbackOptions(enumType);
    }
  }

  async getEnumLabel(enumType: EnumType, key: string, language: 'NO' | 'EN' = 'NO'): Promise<string> {
    const options = await this.getEnumOptions(enumType, language);
    const option = options.find(opt => opt.key === key);
    return option?.label || key;
  }

  private getFallbackOptions(enumType: EnumType): EnumOption[] {
    const fallbacks = {
      'ActorType': [
        { id: '1', key: 'lag-foreninger', label: 'Lag og foreninger', displayOrder: 1, isActive: true },
        { id: '2', key: 'paraply', label: 'Paraplyorganisasjoner', displayOrder: 2, isActive: true },
        { id: '3', key: 'private-firma', label: 'Private firmaer', displayOrder: 3, isActive: true },
        { id: '4', key: 'kommunale-enheter', label: 'Kommunale enheter', displayOrder: 4, isActive: true },
        { id: '5', key: 'private-person', label: 'Private personer', displayOrder: 5, isActive: true }
      ],
      'BookingType': [
        { id: '1', key: 'engangs', label: 'Engangslån', displayOrder: 1, isActive: true },
        { id: '2', key: 'fastlån', label: 'Fastlån', displayOrder: 2, isActive: true },
        { id: '3', key: 'rammetid', label: 'Rammetid', displayOrder: 3, isActive: true },
        { id: '4', key: 'strøtimer', label: 'Strøtimer', displayOrder: 4, isActive: true }
      ]
    };

    return fallbacks[enumType] || [];
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const enumService = new EnumService();
