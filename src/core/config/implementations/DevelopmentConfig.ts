/**
 * Development Environment Configuration
 * 
 * Provides development-specific configuration values
 * following the Liskov Substitution principle.
 */

import { BaseConfig } from './BaseConfig';

export class DevelopmentConfig extends BaseConfig {
  constructor() {
    super();
    
    // Override base values with development-specific ones
    this.api = {
      ...this.api,
      baseUrl: 'http://localhost:3000/api',
    };
    
    this.db = {
      ...this.db,
      url: process.env.SUPABASE_URL || 'http://localhost:54321',
    };
    
    this.features = {
      ...this.features,
      enableNewBookingFlow: true,
      enableAdvancedSearch: true,
      enableNotifications: true,
    };
  }
}
