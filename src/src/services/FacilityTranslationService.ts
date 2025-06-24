
import { supabase } from '@/integrations/supabase/client';
import { Language } from '@/i18n/types';
import { CoreFacility, FacilityView, FacilityContentKey } from '@/types/translation';
import { translationService } from './TranslationService';

class FacilityTranslationService {
  private facilityContentCache = new Map<number, Map<string, string>>();

  async getFacilityContentKey(facilityId: number, contentType: string): Promise<string | null> {
    // Check cache first
    const facilityCache = this.facilityContentCache.get(facilityId);
    if (facilityCache?.has(contentType)) {
      return facilityCache.get(contentType) || null;
    }

    try {
      const { data, error } = await supabase
        .from('facility_content_keys')
        .select('content_key')
        .eq('facility_id', facilityId)
        .eq('content_type', contentType)
        .single();

      if (error || !data) return null;

      // Update cache
      if (!this.facilityContentCache.has(facilityId)) {
        this.facilityContentCache.set(facilityId, new Map());
      }
      this.facilityContentCache.get(facilityId)!.set(contentType, data.content_key);

      return data.content_key;
    } catch {
      return null;
    }
  }

  async setFacilityContentKey(facilityId: number, contentType: string, contentKey: string): Promise<void> {
    const { error } = await supabase
      .from('facility_content_keys')
      .upsert({
        facility_id: facilityId,
        content_type: contentType,
        content_key: contentKey
      });

    if (error) throw error;

    // Update cache
    if (!this.facilityContentCache.has(facilityId)) {
      this.facilityContentCache.set(facilityId, new Map());
    }
    this.facilityContentCache.get(facilityId)!.set(contentType, contentKey);
  }

  async translateFacility(coreFacility: CoreFacility, language: Language): Promise<FacilityView> {
    // Get content keys for this facility
    const nameKey = await this.getFacilityContentKey(coreFacility.id, 'name');
    const descriptionKey = await this.getFacilityContentKey(coreFacility.id, 'description');
    const suitableForKey = await this.getFacilityContentKey(coreFacility.id, 'suitableFor');
    const equipmentKey = await this.getFacilityContentKey(coreFacility.id, 'equipment');
    const amenitiesKey = await this.getFacilityContentKey(coreFacility.id, 'amenities');

    // Get translations
    const translations = await Promise.all([
      nameKey ? translationService.getTranslation(nameKey, language, `Facility ${coreFacility.id}`) : Promise.resolve(`Facility ${coreFacility.id}`),
      descriptionKey ? translationService.getTranslation(descriptionKey, language, '') : Promise.resolve(''),
      suitableForKey ? translationService.getTranslation(suitableForKey, language, '[]') : Promise.resolve('[]'),
      equipmentKey ? translationService.getTranslation(equipmentKey, language, '[]') : Promise.resolve('[]'),
      amenitiesKey ? translationService.getTranslation(amenitiesKey, language, '[]') : Promise.resolve('[]'),
    ]);

    const [name, description, suitableForStr, equipmentStr, amenitiesStr] = translations;

    // Parse arrays safely
    const parseArray = (str: string): string[] => {
      try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return str ? [str] : [];
      }
    };

    const facilityView: FacilityView = {
      ...coreFacility,
      // Translated fields
      name,
      description,
      suitableFor: parseArray(suitableForStr),
      equipment: parseArray(equipmentStr),
      amenities: parseArray(amenitiesStr),
      
      // Computed fields for backwards compatibility
      address: `${coreFacility.address_street}, ${coreFacility.address_city}`,
      image: coreFacility.image_url || "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
      pricePerHour: coreFacility.price_per_hour,
      accessibility: coreFacility.accessibility_features || [],
      hasAutoApproval: coreFacility.has_auto_approval,
      nextAvailable: coreFacility.next_available || "Not available",
      timeSlotDuration: (coreFacility.time_slot_duration || 1) as 1 | 2,
      season: {
        from: coreFacility.season_from || "2024-01-01",
        to: coreFacility.season_to || "2024-12-31"
      }
    };

    return facilityView;
  }

  clearCache(): void {
    this.facilityContentCache.clear();
  }
}

export const facilityTranslationService = new FacilityTranslationService();
