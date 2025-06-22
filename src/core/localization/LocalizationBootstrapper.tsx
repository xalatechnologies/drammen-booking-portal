/**
 * Localization Bootstrapper
 * 
 * Component that initializes the localization system and provides it to the application.
 * Following SOLID principles:
 * - Single Responsibility: Only handles localization initialization
 * - Open/Closed: Can be extended without modifying this component
 * - Liskov Substitution: Works with any ILocalizationService implementation
 * - Interface Segregation: Uses focused interfaces
 * - Dependency Inversion: Depends on abstractions, not concrete implementations
 */

import React, { ReactNode, useState, useEffect } from 'react';
import { LocalizationContext, LocalizationProvider } from './context/LocalizationContext';
import { ILocalizationService } from './interfaces/ILocalizationService';
import { LocalizationService } from './implementations/LocalizationService';
import { config } from '../config/implementations/Config';

// English translations (default fallback)
import enCommon from './translations/en/common.json';
import enErrors from './translations/en/errors.json';
import enFacility from './translations/en/facility.json';
import enValidation from './translations/en/validation.json';

// Norwegian translations
import noCommon from './translations/no/common.json';
import noErrors from './translations/no/errors.json';
import noFacility from './translations/no/facility.json';
import noValidation from './translations/no/validation.json';

interface LocalizationBootstrapperProps {
  children: ReactNode;
  initialLanguage?: string;
}

/**
 * Localization bootstrapper component
 * Initializes the localization service and provides it via context
 */
export const LocalizationBootstrapper: React.FC<LocalizationBootstrapperProps> = ({
  children,
  initialLanguage
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [localizationService, setLocalizationService] = useState<ILocalizationService | null>(null);

  useEffect(() => {
    // Create the localization service
    const service = new LocalizationService(config);
    
    // Add translations for English
    service.addTranslations('en', 'common', enCommon);
    service.addTranslations('en', 'errors', enErrors);
    service.addTranslations('en', 'facility', enFacility);
    service.addTranslations('en', 'validation', enValidation);
    
    // Add translations for Norwegian
    service.addTranslations('no', 'common', noCommon);
    service.addTranslations('no', 'errors', noErrors);
    service.addTranslations('no', 'facility', noFacility);
    service.addTranslations('no', 'validation', noValidation);
    
    // Set initial language if provided
    if (initialLanguage) {
      service.setLanguage(initialLanguage);
    }
    
    // Set the service and mark as initialized
    setLocalizationService(service);
    setIsInitialized(true);
  }, [initialLanguage]);

  if (!isInitialized || !localizationService) {
    // Return loading state while initializing
    return <div>Loading localization system...</div>;
  }

  return (
    <LocalizationProvider service={localizationService} defaultLanguage={initialLanguage}>
      {children}
    </LocalizationProvider>
  );
};
