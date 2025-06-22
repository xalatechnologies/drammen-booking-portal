/**
 * Database Configuration Service
 * 
 * Responsible for managing database connection settings and provider selection.
 * Follows Single Responsibility Principle by focusing only on configuration.
 */

export interface IDatabaseConfig {
  /** The type of database provider to use */
  getProvider(): 'prisma' | 'supabase';
  
  /** Get the database URL for connection */
  getDatabaseUrl(): string;
  
  /** Get whether to enable query logging */
  getEnableLogging(): boolean;
}

/**
 * Implementation of database configuration that reads from environment variables
 * Follows Open/Closed principle - can be extended without modification
 */
export class EnvironmentDatabaseConfig implements IDatabaseConfig {
  getProvider(): 'prisma' | 'supabase' {
    const provider = process.env.REACT_APP_DATABASE_PROVIDER?.toLowerCase();
    return provider === 'supabase' ? 'supabase' : 'prisma';
  }
  
  getDatabaseUrl(): string {
    return process.env.DATABASE_URL || '';
  }
  
  getEnableLogging(): boolean {
    return process.env.REACT_APP_DATABASE_LOGGING === 'true';
  }
}

/**
 * Database configuration factory - creates the appropriate configuration instance
 * Follows Dependency Inversion by providing abstraction over concrete implementations
 */
export class DatabaseConfigFactory {
  static createConfig(): IDatabaseConfig {
    // We could have different implementations based on environment
    return new EnvironmentDatabaseConfig();
  }
}
