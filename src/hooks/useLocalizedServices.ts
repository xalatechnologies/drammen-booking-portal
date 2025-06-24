
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LocalizedFacilityService } from '@/services/LocalizedFacilityService';
import { LocalizedAdditionalServiceRepository } from '@/dal/repositories/LocalizedAdditionalServiceRepository';

// Create singleton instance for additional services
const localizedAdditionalServiceRepository = new LocalizedAdditionalServiceRepository();

export function useLocalizedServices() {
  const { language } = useLanguage();

  useEffect(() => {
    // Language effect - services handle their own language context
    console.log('Language changed to:', language);
  }, [language]);

  return {
    facilityService: LocalizedFacilityService,
    additionalServiceRepository: localizedAdditionalServiceRepository
  };
}
