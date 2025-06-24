
import { supabase } from '@/integrations/supabase/client';
import { facilityTranslationService } from '@/services/FacilityTranslationService';
import { translationService } from '@/services/TranslationService';
import { coreFacilities } from '@/data/coreFacilities';
import { Language } from '@/i18n/types';

export class FacilityMigrationHelper {
  async migrateFacilityToDatabase(facilityData: any) {
    console.log('Migrating facility to database:', facilityData.id);

    // 1. Insert the core facility data if it doesn't exist
    const { data: existingFacility } = await supabase
      .from('app_locations')
      .select('id')
      .eq('id', facilityData.id)
      .single();

    if (!existingFacility) {
      const { error: facilityError } = await supabase
        .from('app_locations')
        .insert({
          id: facilityData.id,
          name: facilityData.name.EN || facilityData.name.NO || `Facility ${facilityData.id}`,
          address: facilityData.address_street,
          code: facilityData.code || `FAC${facilityData.id}`,
          location_type: facilityData.type,
          status: facilityData.status,
          capacity: facilityData.capacity,
          price_per_hour: facilityData.price_per_hour,
          has_auto_approval: facilityData.has_auto_approval,
          time_slot_duration: facilityData.time_slot_duration,
          latitude: facilityData.latitude,
          longitude: facilityData.longitude,
          rating: facilityData.rating,
          review_count: facilityData.review_count,
          accessibility_features: facilityData.accessibility_features,
          allowed_booking_types: facilityData.allowed_booking_types,
          season_from: facilityData.season_from,
          season_to: facilityData.season_to,
          booking_lead_time_hours: facilityData.booking_lead_time_hours,
          max_advance_booking_days: facilityData.max_advance_booking_days,
          cancellation_deadline_hours: facilityData.cancellation_deadline_hours,
          is_featured: facilityData.is_featured,
          is_published: true
        });

      if (facilityError) {
        console.error('Error inserting facility:', facilityError);
        return;
      }
    }

    // 2. Create translation keys and content for translatable fields
    await this.createFacilityTranslations(facilityData);
  }

  private async createFacilityTranslations(facilityData: any) {
    const facilityId = facilityData.id;

    // Create content keys for each translatable field
    const contentTypes = ['name', 'description', 'suitableFor', 'equipment', 'amenities'];

    for (const contentType of contentTypes) {
      const contentKey = `facility.${facilityId}.${contentType}`;

      // Set the facility content key
      await facilityTranslationService.setFacilityContentKey(facilityId, contentType, contentKey);

      // Add translation key
      await translationService.addTranslationKey(contentKey, 'facility', `${contentType} for facility ${facilityId}`);

      // Add translations for each language
      const languages: Language[] = ['NO', 'EN'];
      
      for (const lang of languages) {
        let value = '';

        switch (contentType) {
          case 'name':
            value = facilityData.name?.[lang] || facilityData.name?.NO || `Facility ${facilityId}`;
            break;
          case 'description':
            value = facilityData.description?.[lang] || '';
            break;
          case 'suitableFor':
            value = JSON.stringify(facilityData.suitableFor?.[lang] || []);
            break;
          case 'equipment':
            value = JSON.stringify(facilityData.equipment?.[lang] || []);
            break;
          case 'amenities':
            value = JSON.stringify(facilityData.amenities?.[lang] || []);
            break;
        }

        if (value) {
          await translationService.setTranslation(contentKey, lang, value);
        }
      }
    }
  }

  async migrateAllCoreFacilities() {
    console.log('Starting migration of all core facilities...');
    
    for (const facility of coreFacilities) {
      await this.migrateFacilityToDatabase(facility);
    }
    
    console.log('Migration completed!');
  }
}

export const facilityMigrationHelper = new FacilityMigrationHelper();
