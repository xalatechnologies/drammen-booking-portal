
import { useLanguage } from '@/contexts/LanguageContext';
import { enumTranslations } from '../translations/enums';
import { enumService } from '@/services/EnumService';
import { EnumType } from '@/types/enum';

export function useEnumTranslation() {
  const { language } = useLanguage();

  const translateEnum = async (enumType: EnumType, key: string): Promise<string> => {
    try {
      // Try to get from enum service first (database)
      const label = await enumService.getEnumLabel(enumType, key, language);
      if (label !== key) {
        return label;
      }
    } catch (error) {
      console.warn('Failed to get enum translation from service:', error);
    }

    // Fallback to static translations
    return enumTranslations[language][key] || key;
  };

  const translateEnumSync = (key: string): string => {
    return enumTranslations[language][key] || key;
  };

  return {
    translateEnum,
    translateEnumSync,
    language
  };
}
