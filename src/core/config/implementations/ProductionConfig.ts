/**
 * Production Environment Configuration
 * 
 * Provides production-specific configuration values
 * following the Liskov Substitution principle.
 */

import { BaseConfig } from './BaseConfig';

export class ProductionConfig extends BaseConfig {
  constructor() {
    super();
    
    // Override base values with production-specific ones
    this.api = {
      ...this.api,
      baseUrl: process.env.API_BASE_URL || 'https://api.drammen-booking.no/api',
      timeout: 15000, // Reduced timeout for production
    };
    
    this.db = {
      ...this.db,
      url: process.env.SUPABASE_URL || '',
    };
    
    this.features = {
      ...this.features,
      enableNewBookingFlow: process.env.FEATURE_NEW_BOOKING === 'true',
      enableAdvancedSearch: process.env.FEATURE_ADVANCED_SEARCH === 'true',
      enableNotifications: process.env.FEATURE_NOTIFICATIONS === 'true',
    };
  }
}
