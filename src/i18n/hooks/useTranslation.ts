import { useLanguage } from '@/contexts/LanguageContext';
import { bookingTranslations } from '../translations/booking';
import { commonTranslations } from '../translations/common';
import { facilityTranslations } from '../translations/facility';
import { errorTranslations } from '../translations/errors';
import { navigationTranslations } from '../translations/navigation';
import { adminTranslations } from '../translations/admin';
import { enumTranslations } from '../translations/enums';
import { modelTranslations } from '../translations/models';
import { serviceTranslations } from '../translations/services';
import { formsTranslations } from '../translations/forms';
import { validationTranslations } from '../translations/validation';
import { accessibilityTranslations } from '../translations/accessibility';
import { paymentTranslations } from '../translations/payment';
import { searchTranslations } from '../translations/search';
import { heroTranslations } from '../translations/hero';
import { TranslationParams, TranslationFunction } from '../types';

type TranslationPath = string;

export function useTranslation() {
  const { language } = useLanguage();

  const translations = {
    booking: bookingTranslations[language],
    common: commonTranslations[language],
    facility: facilityTranslations[language],
    error: errorTranslations[language],
    navigation: navigationTranslations[language],
    admin: adminTranslations[language],
    enum: enumTranslations[language],
    models: modelTranslations[language],
    services: serviceTranslations[language],
    forms: formsTranslations[language],
    validation: validationTranslations[language],
    accessibility: accessibilityTranslations[language],
    payment: paymentTranslations[language],
    search: searchTranslations[language],
    hero: heroTranslations[language]
  };

  const t: TranslationFunction = (path: TranslationPath, params?: TranslationParams, defaultValue?: string): string => {
    try {
      const pathParts = path.split('.');
      let value: any = null;

      // Handle enum translations specially
      if (pathParts[0] === 'enum' && pathParts.length === 2) {
        value = enumTranslations[language][pathParts[1]];
      } else if (pathParts.length >= 2) {
        const namespace = pathParts[0];
        const translationObj = translations[namespace as keyof typeof translations];
        
        if (translationObj) {
          value = translationObj;
          for (let i = 1; i < pathParts.length; i++) {
            value = value?.[pathParts[i]];
          }
        }
      }

      // Ensure we return a string, never an object
      if (typeof value === 'object' && value !== null) {
        console.warn(`Translation path "${path}" returned an object instead of a string. This will cause React rendering errors.`);
        return defaultValue || path;
      }

      // Handle parameter substitution
      if (typeof value === 'string' && params) {
        Object.entries(params).forEach(([key, val]) => {
          value = value.replace(`{${key}}`, String(val));
        });
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
      hour12: false, // Use 24-hour format for Norwegian
    }).format(date);
  };

  const formatDateTime = (date: Date): string => {
    return new Intl.DateTimeFormat(language === 'NO' ? 'nb-NO' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  };

  const formatNumber = (number: number): string => {
    return new Intl.NumberFormat(language === 'NO' ? 'nb-NO' : 'en-US').format(number);
  };

  const formatPercent = (number: number): string => {
    return new Intl.NumberFormat(language === 'NO' ? 'nb-NO' : 'en-US', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(number / 100);
  };

  return {
    t,
    language,
    formatCurrency,
    formatDate,
    formatTime,
    formatDateTime,
    formatNumber,
    formatPercent,
  };
}
