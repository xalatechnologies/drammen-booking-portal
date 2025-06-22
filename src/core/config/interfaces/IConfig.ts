/**
 * Configuration Interface
 * 
 * Defines the contract for all configuration implementations
 * following Interface Segregation and Dependency Inversion principles.
 */

export interface IConfig {
  /**
   * API configuration
   */
  api: {
    baseUrl: string;
    timeout: number;
  };
  
  /**
   * Database configuration
   */
  db: {
    url: string;
    schema: string;
  };
  
  /**
   * Authentication configuration
   */
  auth: {
    tokenExpiryMinutes: number;
    refreshTokenExpiryDays: number;
  };
  
  /**
   * Feature flags
   */
  features: {
    enableNewBookingFlow: boolean;
    enableAdvancedSearch: boolean;
    enableNotifications: boolean;
  };
  
  /**
   * Localization settings
   */
  localization: {
    defaultLanguage: string;
    supportedLanguages: string[];
  };
  
  /**
   * Get a specific configuration value by path
   * @param path Dot notation path (e.g. 'api.baseUrl')
   * @param defaultValue Optional default value if path not found
   */
  get<T>(path: string, defaultValue?: T): T;
}
