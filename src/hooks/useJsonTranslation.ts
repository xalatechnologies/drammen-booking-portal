
import { useLanguage } from '@/contexts/LanguageContext';
import { useMemo } from 'react';

// Import JSON translation files
import enTranslations from '@/i18n/locales/en.json';
import noTranslations from '@/i18n/locales/no.json';

type TranslationKey = string;
type TranslationParams = Record<string, string | number>;

const translations = {
  'EN': enTranslations,
  'NO': noTranslations
};

export function useJsonTranslation() {
  const { language } = useLanguage();

  const currentTranslations = useMemo(() => {
    return translations[language] || translations['NO'];
  }, [language]);

  const t = (key: TranslationKey, params?: TranslationParams, defaultValue?: string): string => {
    try {
      const keys = key.split('.');
      let value: any = currentTranslations;

      for (const k of keys) {
        value = value?.[k];
      }

      if (typeof value === 'string') {
        // Handle parameter substitution
        if (params) {
          return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
            return str.replace(`{{${paramKey}}}`, String(paramValue));
          }, value);
        }
        return value;
      }

      return defaultValue || key;
    } catch (error) {
      console.warn(`Translation not found for key: ${key}`);
      return defaultValue || key;
    }
  };

  // Add tSync alias for backward compatibility
  const tSync = t;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(language === 'NO' ? 'nb-NO' : 'en-US', {
      style: 'currency',
      currency: 'NOK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(language === 'NO' ? 'nb-NO' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat(language === 'NO' ? 'nb-NO' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  };

  return {
    t,
    tSync,
    language,
    formatCurrency,
    formatDate,
    formatTime,
  };
}
