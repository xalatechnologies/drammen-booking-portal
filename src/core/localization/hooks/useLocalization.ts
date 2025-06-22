/**
 * Localization Hook
 * 
 * Custom hook for accessing localization functionality across the application,
 * following SOLID principles and providing type-safe localization.
 */

import { useContext, useCallback } from 'react';
import { LocalizationContext } from '@/core/localization/context/LocalizationContext';
import { ILocalizationService } from '@/core/localization/interfaces/ILocalizationService';

export interface UseLocalizationResult {
  localizationService: ILocalizationService;
  language: string;
  translate: (key: string, params?: Record<string, any>) => string;
  changeLanguage: (language: string) => void;
  availableLanguages: string[];
  hasTranslation: (key: string) => boolean;
}

/**
 * Hook for accessing localization functionality
 * 
 * @returns Localization methods and state
 */
export function useLocalization(): UseLocalizationResult {
  const context = useContext(LocalizationContext);
  
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  
  const { service, language, setLanguage, availableLanguages } = context;
  
  // Wrapper around translate method for convenience
  const translate = useCallback((key: string, params?: Record<string, any>) => {
    return service.translate(key, params);
  }, [service]);
  
  // Change language wrapper
  const changeLanguage = useCallback((newLanguage: string) => {
    if (availableLanguages.includes(newLanguage)) {
      setLanguage(newLanguage);
      service.setLanguage(newLanguage);
    } else {
      console.warn(`Language ${newLanguage} is not available`);
    }
  }, [service, setLanguage, availableLanguages]);
  
  // Check if a translation exists
  const hasTranslation = useCallback((key: string) => {
    return service.hasTranslation(key);
  }, [service]);
  
  return {
    localizationService: service,
    language,
    translate,
    changeLanguage,
    availableLanguages,
    hasTranslation
  };
}
