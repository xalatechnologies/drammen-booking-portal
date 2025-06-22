/**
 * Dependency Injection Container
 * 
 * This file provides a simple dependency injection container for registering
 * and resolving dependencies throughout the application.
 * 
 * Following SOLID principles:
 * - Single Responsibility: Container only handles dependency registration and resolution
 * - Open/Closed: New dependencies can be added without modifying existing code
 * - Dependency Inversion: High-level modules depend on abstractions
 */

type Constructor<T> = new (...args: any[]) => T;
type Factory<T> = () => T;

export class DIContainer {
  private static instance: DIContainer;
  private dependencies: Map<string, any> = new Map();
  private factories: Map<string, Factory<any>> = new Map();
  
  private constructor() {}
  
  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  /**
   * Register a singleton instance for an interface
   */
  public register<T>(token: string, instance: T): void {
    this.dependencies.set(token, instance);
  }
  
  /**
   * Register a class for an interface that will be instantiated on first resolve
   */
  public registerSingleton<T>(token: string, ctor: Constructor<T>): void {
    this.factories.set(token, () => {
      const instance = new ctor();
      this.register(token, instance);
      return instance;
    });
  }
  
  /**
   * Register a factory function for an interface
   */
  public registerFactory<T>(token: string, factory: Factory<T>): void {
    this.factories.set(token, factory);
  }
  
  /**
   * Resolve an interface to its implementation
   */
  public resolve<T>(token: string): T {
    // Check if we have an instance
    if (this.dependencies.has(token)) {
      return this.dependencies.get(token) as T;
    }
    
    // Check if we have a factory
    if (this.factories.has(token)) {
      return this.factories.get(token)() as T;
    }
    
    throw new Error(`No dependency registered for ${token}`);
  }
  
  /**
   * Clear all registrations (mainly for testing)
   */
  public clear(): void {
    this.dependencies.clear();
    this.factories.clear();
  }
}

// Export a singleton instance
export const container = DIContainer.getInstance();
