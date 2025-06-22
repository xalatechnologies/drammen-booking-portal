/**
 * Localization Context
 * 
 * Provides React context for localization access throughout the application
 * following the Dependency Inversion Principle and Single Responsibility Principle.
 */

import React, { createContext, useContext, ReactNode, useState, useCallback, useMemo } from 'react';
import { ILocalizationService } from './interfaces/ILocalizationService';
import { container } from '../di/container';
import { LOCALIZATION_SERVICE_TOKEN } from './implementations/LocalizationService';

// Context interface to expose localization functionality to components
interface LocalizationContextType {
  // Core translation function
  t: (key: string, params?: Record<string, any>) => string;
  
  // Language management
  currentLanguage: string;
  setLanguage: (language: string) => void;
  availableLanguages: string[];
  
  // Utility functions
  hasTranslation: (key: string) => boolean;
}

// Create context with default values
const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

interface LocalizationProviderProps {
  children: ReactNode;
  localizationService?: ILocalizationService;
}

/**
 * Provider component that makes localization available to any
 * nested components that need to access it.
 */
export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  children,
  localizationService
}) => {
  // Get service from DI container if not provided
  const service = localizationService || container.resolve<ILocalizationService>(LOCALIZATION_SERVICE_TOKEN);
  
  // State to track language changes and trigger re-renders
  const [currentLanguage, setCurrentLanguageState] = useState<string>(service.getCurrentLanguage());
  
  // Wrapper function to update both service and state
  const setLanguage = useCallback((language: string) => {
    service.setLanguage(language);
    setCurrentLanguageState(service.getCurrentLanguage());
  }, [service]);
  
  // Memoize the available languages to prevent unnecessary re-renders
  const availableLanguages = useMemo(() => service.getAvailableLanguages(), [service]);
  
  // Create a stable reference to the translation function
  const translate = useCallback((key: string, params?: Record<string, any>) => {
    return service.translate(key, params);
  }, [service, currentLanguage]); // Include currentLanguage to re-render when language changes
  
  // Create a stable reference to the hasTranslation function
  const hasTranslation = useCallback((key: string) => {
    return service.hasTranslation(key);
  }, [service, currentLanguage]); // Include currentLanguage to re-render when language changes
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    t: translate,
    currentLanguage,
    setLanguage,
    availableLanguages,
    hasTranslation
  }), [translate, currentLanguage, setLanguage, availableLanguages, hasTranslation]);
  
  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
};

/**
 * Hook that lets components easily access localization
 * following the Dependency Inversion Principle.
 */
export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  
  return context;
};

/**
 * Higher-order component for wrapping components that need localization
 * This allows easier testing and dependency injection.
 */
export function withLocalization<P extends object>(
  Component: React.ComponentType<P & { t: (key: string, params?: Record<string, any>) => string }>
): React.FC<P> {
  return (props: P) => {
    const { t } = useLocalization();
    return <Component {...props} t={t} />;
  };
}
