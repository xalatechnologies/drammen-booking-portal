import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { jsonTranslationService } from '@/i18n/JsonTranslationService';

/**
 * Hook for accessing translations from JSON files
 * 
 * This hook provides access to the JSON-based translation system,
 * which is more efficient and maintainable than the database-driven approach.
 */
export const useJsonTranslation = () => {
  const { language } = useLanguage();

  const { data: isInitialized } = useQuery({
    queryKey: ['json-translation-service-init'],
    queryFn: async () => {
      await jsonTranslationService.initialize();
      return true;
    },
    staleTime: Infinity,
  });

  /**
   * Get a translation asynchronously
   * @param key The translation key in dot notation (e.g. 'admin.sidebar.overview')
   * @param fallback Optional fallback text if translation is not found
   */
  const t = async (key: string, fallback?: string): Promise<string> => {
    return await jsonTranslationService.getTranslation(key, language, fallback);
  };

  /**
   * Get a translation synchronously
   * @param key The translation key in dot notation (e.g. 'admin.sidebar.overview')
   * @param fallback Optional fallback text if translation is not found
   */
  const tSync = (key: string, fallback?: string): string => {
    if (!isInitialized) return fallback || key;
    return jsonTranslationService.getTranslationSync(key, language, fallback);
  };

  return {
    t,
    tSync,
    language,
    isInitialized: !!isInitialized
  };
};
