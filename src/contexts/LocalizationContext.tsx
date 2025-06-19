
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useLanguage } from './LanguageContext';
import { Language } from '@/i18n/types';
import { LocalizedFacility } from '@/types/localization';
import { localizationHelper } from '@/utils/localizationHelper';

interface LocalizationContextType {
  getLocalizedContent: <T extends { [K in Language]: string }>(content: T) => string;
  getLocalizedArray: <T extends { [K in Language]: string[] }>(content: T) => string[];
  getLocalizedFacility: (facility: LocalizedFacility) => any;
  language: Language;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage();

  const contextValue = useMemo(() => ({
    getLocalizedContent: <T extends { [K in Language]: string }>(content: T) => 
      localizationHelper.getCurrentContent(content, language),
    
    getLocalizedArray: <T extends { [K in Language]: string[] }>(content: T) => 
      localizationHelper.getCurrentArray(content, language),
    
    getLocalizedFacility: (facility: LocalizedFacility) => ({
      ...facility,
      name: localizationHelper.getCurrentContent(facility.name, language),
      description: localizationHelper.getCurrentContent(facility.description, language),
      suitableFor: localizationHelper.getCurrentArray(facility.suitableFor, language),
      equipment: localizationHelper.getCurrentArray(facility.equipment, language),
      amenities: facility.amenities ? localizationHelper.getCurrentArray(facility.amenities, language) : facility.amenities
    }),
    
    language
  }), [language]);

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}
