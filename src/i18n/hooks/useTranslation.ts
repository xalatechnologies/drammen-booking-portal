
import { useLanguage } from '@/contexts/LanguageContext';
import { bookingTranslations } from '../translations/booking';
import { commonTranslations } from '../translations/common';

type TranslationPath = string;

export function useTranslation() {
  const { language } = useLanguage();

  const t = (path: TranslationPath, defaultValue?: string): string => {
    try {
      const pathParts = path.split('.');
      let value: any = null;

      // Check in different translation namespaces
      if (pathParts[0] === 'booking') {
        value = bookingTranslations[language];
        for (let i = 1; i < pathParts.length; i++) {
          value = value?.[pathParts[i]];
        }
      } else if (pathParts[0] === 'common') {
        value = commonTranslations[language];
        for (let i = 1; i < pathParts.length; i++) {
          value = value?.[pathParts[i]];
        }
      }

      return value || defaultValue || path;
    } catch (error) {
      console.warn(`Translation not found for path: ${path}`);
      return defaultValue || path;
    }
  };

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
    }).format(date);
  };

  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat(language === 'NO' ? 'nb-NO' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return {
    t,
    language,
    formatCurrency,
    formatDate,
    formatTime,
    formatDateTime,
  };
}
