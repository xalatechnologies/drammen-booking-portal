
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { translationService } from '@/services/TranslationService';

export const useTranslation = () => {
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
    // This is a synchronous version that uses cached data
    // Only use when you're sure the translation service is initialized
    if (!isInitialized) return fallback || key;
    
    // Return from cache or fallback
    return fallback || key; // Simplified for now
  };

  return {
    t,
    tSync,
    language,
    isInitialized: !!isInitialized
  };
};
