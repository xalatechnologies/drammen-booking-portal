
import React, { createContext, useContext } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Facility } from '@/types/facility';

interface LocalizationContextType {
  getLocalizedFacility: (facility: any) => Facility;
  language: 'NO' | 'EN';
}

const LocalizationContextInstance = createContext<LocalizationContextType | undefined>(undefined);

export const useLocalization = () => {
  const context = useContext(LocalizationContextInstance);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

interface LocalizationProviderProps {
  children: React.ReactNode;
}

export function LocalizationProvider({ children }: LocalizationProviderProps) {
  const { language } = useLanguage();

  const getLocalizedFacility = (facility: any): Facility => {
    // If facility is already localized (has string properties), return as is
    if (typeof facility.name === 'string') {
      return facility as Facility;
    }

    // If facility has localized properties (objects with NO/EN keys), extract for current language
    return {
      ...facility,
      name: facility.name?.[language] || facility.name?.NO || '',
      description: facility.description?.[language] || facility.description?.NO || '',
      suitableFor: facility.suitableFor?.[language] || facility.suitableFor?.NO || [],
      // Keep other properties as they are
    };
  };

  const value = {
    getLocalizedFacility,
    language,
  };

  return (
    <LocalizationContextInstance.Provider value={value}>
      {children}
    </LocalizationContextInstance.Provider>
  );
}

// Keep the old component name for backward compatibility but mark as deprecated
export function LocalizationContext({ children }: LocalizationProviderProps) {
  return <LocalizationProvider>{children}</LocalizationProvider>;
}
