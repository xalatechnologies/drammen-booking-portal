
// Re-export the new JSON-based translation hook for backward compatibility
export { useJsonTranslation as useTranslation } from './useJsonTranslation';

// Also provide the old service-based hook for components that still use it
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { translationService } from '@/services/TranslationService';

export const useServiceTranslation = () => {
  const { language } = useLanguage();

  const { data: isInitialized } = useQuery({
    queryKey: ['translation-service-init'],
    queryFn: async () => {
      await translationService.initialize();
      return true;
    },
    staleTime: Infinity,
  });

  const t = async (key: string, fallback?: string): Promise<string> => {
    return await translationService.getTranslation(key, language, fallback);
  };

  const tSync = (key: string, fallback?: string): string => {
    if (!isInitialized) return fallback || key;
    
    const keyCache = translationService['cache'].get(key);
    if (keyCache) {
      return keyCache.get(language) || keyCache.get('NO') || fallback || key;
    }
    
    return fallback || key;
  };

  return {
    t,
    tSync,
    language,
    isInitialized: !!isInitialized
  };
};
