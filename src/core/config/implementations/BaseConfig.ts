/**
 * Base Configuration Implementation
 * 
 * Provides the core implementation of the IConfig interface
 * following the Open/Closed and Liskov Substitution principles.
 */

import { IConfig } from '../interfaces/IConfig';

/**
 * Abstract base configuration class that all environment-specific
 * configurations will extend.
 */
export abstract class BaseConfig implements IConfig {
  api = {
    baseUrl: '',
    timeout: 30000, // Default 30 seconds
  };
  
  db = {
    url: '',
    schema: 'public',
  };
  
  auth = {
    tokenExpiryMinutes: 60, // Default 1 hour
    refreshTokenExpiryDays: 7, // Default 7 days
  };
  
  features = {
    enableNewBookingFlow: false,
    enableAdvancedSearch: false,
    enableNotifications: false,
  };
  
  localization = {
    defaultLanguage: 'no',
    supportedLanguages: ['no', 'en'],
  };

  /**
   * Get a configuration value using dot notation path
   */
  get<T>(path: string, defaultValue?: T): T {
    const pathSegments = path.split('.');
    let current: any = this;
    
    for (const segment of pathSegments) {
      if (current === undefined || current === null) {
        return defaultValue as T;
      }
      current = current[segment];
    }
    
    return (current === undefined || current === null) ? (defaultValue as T) : current;
  }
}
