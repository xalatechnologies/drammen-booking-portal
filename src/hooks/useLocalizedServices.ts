
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LocalizedFacilityService } from '@/services/LocalizedFacilityService';
import { LocalizedAdditionalServiceRepository } from '@/dal/repositories/LocalizedAdditionalServiceRepository';

// Create singleton instance for additional services
const localizedAdditionalServiceRepository = new LocalizedAdditionalServiceRepository();

export function useLocalizedServices() {
  const { language } = useLanguage();

  useEffect(() => {
    // Update language for localized services when language changes
    localizedAdditionalServiceRepository.setLanguage(language);
  }, [language]);

  return {
    facilityService: LocalizedFacilityService,
    additionalServiceRepository: localizedAdditionalServiceRepository
  };
}
