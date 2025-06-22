/**
 * Configuration Implementation
 * 
 * SOLID implementation of the IConfig interface:
 * - Single Responsibility: Only manages configuration values
 * - Open/Closed: Can be extended without modification of core functionality
 * - Liskov Substitution: Fully implements the IConfig interface
 * - Interface Segregation: Uses specific interfaces for specific needs
 * - Dependency Inversion: Other components depend on IConfig interface, not this implementation
 */

import { IConfig } from '../interfaces/IConfig';
import { get as lodashGet } from 'lodash';

export class Config implements IConfig {
  // Default configuration values
  private config = {
    api: {
      baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
      timeout: 30000
    },
    
    db: {
      url: process.env.REACT_APP_DB_URL || '',
      schema: process.env.REACT_APP_DB_SCHEMA || 'public'
    },
    
    auth: {
      tokenExpiryMinutes: 60,
      refreshTokenExpiryDays: 7
    },
    
    features: {
      enableNewBookingFlow: true,
      enableAdvancedSearch: true,
      enableNotifications: false
    },
    
    localization: {
      defaultLanguage: 'en',
      supportedLanguages: ['en', 'no']
    }
  };

  constructor(customConfig?: Partial<IConfig>) {
    if (customConfig) {
      this.config = { ...this.config, ...customConfig };
    }
  }

  get api() {
    return this.config.api;
  }

  get db() {
    return this.config.db;
  }
  
  get auth() {
    return this.config.auth;
  }
  
  get features() {
    return this.config.features;
  }

  get localization() {
    return this.config.localization;
  }

  /**
   * Get a configuration value by path using dot notation
   * @param path The path to the config value
   * @param defaultValue Default value if path not found
   * @returns The config value or default value
   */
  get<T>(path: string, defaultValue?: T): T {
    return lodashGet(this.config, path, defaultValue) as T;
  }
}

// Create and export a singleton instance
export const config = new Config();

// Token for dependency injection
export const CONFIG_TOKEN = 'IConfig';
