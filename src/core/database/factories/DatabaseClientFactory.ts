/**
 * Database Client Factory
 * 
 * Factory for creating database client instances following SOLID principles.
 * - Single Responsibility: Only responsible for creating database clients
 * - Open/Closed: Can be extended with new client types without modifying the factory
 * - Liskov Substitution: All clients implement the same interface
 * - Interface Segregation: Uses focused interfaces
 * - Dependency Inversion: Depends on abstractions rather than concrete implementations
 */

import { IDatabaseClient } from '../interfaces/IDatabaseClient';
import { PrismaClient } from '../implementations/PrismaClient';
import { SupabaseClient } from '../implementations/SupabaseClient';
import { IDatabaseConfig } from '../config/DatabaseConfig';

/**
 * Abstract factory for creating database clients
 * This allows for extension without modification (Open/Closed Principle)
 */
export abstract class DatabaseClientFactory {
  abstract createClient(): IDatabaseClient;
}

/**
 * Concrete implementation that creates a client based on configuration
 */
export class ConfigDatabaseClientFactory extends DatabaseClientFactory {
  constructor(private readonly config: IDatabaseConfig) {
    super();
  }
  
  createClient(): IDatabaseClient {
    const provider = this.config.getProvider();
    
    switch (provider) {
      case 'prisma':
        return new PrismaClient();
      case 'supabase':
        return new SupabaseClient();
      default:
        throw new Error(`Unsupported database provider: ${provider}`);
    }
  }
}

/**
 * Creates a concrete database client based on the current configuration
 * This is a convenience function for use in DI containers
 */
export function createDatabaseClient(config: IDatabaseConfig): IDatabaseClient {
  const factory = new ConfigDatabaseClientFactory(config);
  return factory.createClient();
}
