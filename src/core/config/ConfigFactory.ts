/**
 * Configuration Factory
 * 
 * Provides the appropriate config implementation based on environment
 * following the Factory Pattern and Dependency Inversion Principle.
 */

import { IConfig } from './interfaces/IConfig';
import { DevelopmentConfig } from './implementations/DevelopmentConfig';
import { ProductionConfig } from './implementations/ProductionConfig';
import { container } from '../di/container';

/**
 * Token for DI container
 */
export const CONFIG_TOKEN = 'IConfig';

/**
 * Create and return the appropriate configuration based on environment
 */
export function createConfig(): IConfig {
  const environment = process.env.NODE_ENV || 'development';
  
  let config: IConfig;
  
  switch (environment) {
    case 'production':
      config = new ProductionConfig();
      break;
    case 'development':
    default:
      config = new DevelopmentConfig();
      break;
  }
  
  return config;
}

/**
 * Register the configuration in the DI container
 */
export function registerConfig(): void {
  const config = createConfig();
  container.register<IConfig>(CONFIG_TOKEN, config);
}

/**
 * Get the configuration from the DI container
 */
export function getConfig(): IConfig {
  return container.resolve<IConfig>(CONFIG_TOKEN);
}
