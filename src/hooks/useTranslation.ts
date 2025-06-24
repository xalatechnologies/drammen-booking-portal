
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationService } from '@/services/TranslationService';

export const useTranslation = () => {
  const { language } = useLanguage();

  const { data: isInitialized } = useQuery({
    queryKey: ['translation-service-init'],
    queryFn: async () => {
      // Initialize translation service (simplified)
      return true;
    },
    staleTime: Infinity,
  });

  const t = async (key: string, fallback?: string): Promise<string> => {
    return await TranslationService.getTranslation(key, language);
  };

  const tSync = (key: string, fallback?: string): string => {
    // This is a synchronous version that returns the fallback or key
    return fallback || key;
  };

  return {
    t,
    tSync,
    language,
    isInitialized: !!isInitialized
  };
};
