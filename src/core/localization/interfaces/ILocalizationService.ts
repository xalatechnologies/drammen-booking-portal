/**
 * Localization Service Interface
 * 
 * Defines the contract for localization services following
 * Interface Segregation and Dependency Inversion principles.
 */

export interface ILocalizationService {
  /**
   * Get a localized string by key
   * @param key The translation key
   * @param params Optional parameters to substitute in the translation
   * @returns The localized string
   */
  translate(key: string, params?: Record<string, any>): string;
  
  /**
   * Get the current language code
   * @returns The current language code (e.g., 'en', 'no')
   */
  getCurrentLanguage(): string;
  
  /**
   * Set the current language
   * @param language The language code to set
   */
  setLanguage(language: string): void;
  
  /**
   * Get all available languages
   * @returns Array of available language codes
   */
  getAvailableLanguages(): string[];
  
  /**
   * Check if a key exists in the current language
   * @param key The translation key to check
   * @returns True if the key exists
   */
  hasTranslation(key: string): boolean;
  
  /**
   * Get all translations for a specific namespace
   * @param namespace The namespace to get translations for
   * @returns Record of key/value pairs for the namespace
   */
  getNamespace(namespace: string): Record<string, string>;
}
