/**
 * Localization Context
 * 
 * Provides localization functionality to the application using React Context API.
 * Following SOLID principles:
 * - Single Responsibility: Only handles localization state
 * - Open/Closed: Can be extended without modifying existing functionality
 * - Liskov Substitution: Works with any ILocalizationService implementation
 * - Interface Segregation: Only exposes necessary methods
 * - Dependency Inversion: Depends on ILocalizationService interface, not concrete implementations
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { ILocalizationService } from '@/core/localization/interfaces/ILocalizationService';

interface LocalizationContextProps {
  service: ILocalizationService;
  language: string;
  setLanguage: (language: string) => void;
  availableLanguages: string[];
}

// Create context with undefined initial value, will be populated in provider
export const LocalizationContext = createContext<LocalizationContextProps | undefined>(undefined);

interface LocalizationProviderProps {
  children: ReactNode;
  service: ILocalizationService;
  defaultLanguage?: string;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ 
  children, 
  service, 
  defaultLanguage = 'en'
}) => {
  const [language, setLanguage] = useState<string>(defaultLanguage);
  const availableLanguages = service.getAvailableLanguages();

  // Initialize localization service with default language
  useEffect(() => {
    if (!availableLanguages.includes(language)) {
      console.warn(`Language ${language} is not available, defaulting to ${availableLanguages[0] || 'en'}`);
      const fallbackLang = availableLanguages[0] || 'en';
      setLanguage(fallbackLang);
      service.setLanguage(fallbackLang);
    } else {
      service.setLanguage(language);
    }
  }, []);

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const contextValue: LocalizationContextProps = {
    service,
    language,
    setLanguage: handleLanguageChange,
    availableLanguages
  };

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
};
