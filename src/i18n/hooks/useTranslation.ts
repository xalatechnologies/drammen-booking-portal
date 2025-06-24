
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationParams } from '../types';

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: string, params?: TranslationParams, defaultValue?: string): string => {
    // Simple implementation - return the key if no translation found
    // In a real implementation, this would look up translations from files
    return defaultValue || key;
  };

  // Sync version for compatibility
  const tSync = (key: string, defaultValue?: string, params?: TranslationParams): string => {
    return defaultValue || key;
  };

  const formatCurrency = (amount: number, currency: string = 'NOK'): string => {
    return new Intl.NumberFormat(language === 'NO' ? 'nb-NO' : 'en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return { t, tSync, language, formatCurrency };
}
