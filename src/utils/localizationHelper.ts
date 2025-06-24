
import { Language } from '@/i18n/types';
import { LocalizedContent, LocalizationHelper } from '@/types/localization';

export const localizationHelper: LocalizationHelper = {
  getCurrentContent<T extends LocalizedContent[keyof LocalizedContent]>(
    content: T,
    language: Language,
    fallbackLanguage: Language = 'NO'
  ): string {
    return content[language] || content[fallbackLanguage] || Object.values(content)[0] || '';
  },

  getCurrentArray<T extends { [K in Language]: string[] }>(
    content: T,
    language: Language,
    fallbackLanguage: Language = 'NO'
  ): string[] {
    return content[language] || content[fallbackLanguage] || Object.values(content)[0] || [];
  }
};

// Helper function to get localized facility data
export const getLocalizedFacility = (facility: any, language: Language): any => {
  if (!facility.name || typeof facility.name === 'string') {
    // Already a regular facility, return as-is
    return facility;
  }

  // Convert localized facility to regular facility
  return {
    ...facility,
    name: localizationHelper.getCurrentContent(facility.name, language),
    description: localizationHelper.getCurrentContent(facility.description, language),
    suitableFor: localizationHelper.getCurrentArray(facility.suitableFor, language),
    equipment: localizationHelper.getCurrentArray(facility.equipment, language),
    amenities: facility.amenities ? localizationHelper.getCurrentArray(facility.amenities, language) : facility.amenities
  };
};

// Helper function to get localized service data
export const getLocalizedService = (service: any, language: Language): any => {
  if (!service.name || typeof service.name === 'string') {
    // Already a regular service, return as-is
    return service;
  }

  // Convert localized service to regular service
  return {
    ...service,
    name: localizationHelper.getCurrentContent(service.name, language),
    description: localizationHelper.getCurrentContent(service.description, language),
    shortDescription: service.shortDescription 
      ? localizationHelper.getCurrentContent(service.shortDescription, language)
      : service.shortDescription,
    metadata: {
      ...service.metadata,
      instructions: service.metadata.instructions
        ? localizationHelper.getCurrentContent(service.metadata.instructions, language)
        : service.metadata.instructions
    }
  };
};
