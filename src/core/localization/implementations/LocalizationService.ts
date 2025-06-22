/**
 * Localization Service Implementation
 * 
 * Implementation of ILocalizationService following SOLID principles
 * - Single Responsibility: Only handles localization
 * - Open/Closed: Can be extended without modification
 * - Liskov Substitution: Follows interface contract
 * - Interface Segregation: Focused on localization only
 * - Dependency Inversion: Depends on abstractions
 */

import { ILocalizationService } from '../interfaces/ILocalizationService';
import { IConfig } from '../../config/interfaces/IConfig';

// Define token for DI container
export const LOCALIZATION_SERVICE_TOKEN = 'ILocalizationService';

/**
 * Localization service implementation
 */
export class LocalizationService implements ILocalizationService {
  private currentLanguage: string;
  private translations: Record<string, Record<string, Record<string, string>>> = {};
  private availableLanguages: string[] = [];
  
  /**
   * Constructor with dependency injection
   * @param config Application configuration with localization settings
   * @param initialTranslations Optional initial translations to load
   */
  constructor(
    private readonly config: IConfig,
    initialTranslations?: Record<string, Record<string, Record<string, string>>>
  ) {
    this.currentLanguage = config.localization.defaultLanguage;
    this.availableLanguages = config.localization.supportedLanguages;
    
    if (initialTranslations) {
      this.translations = initialTranslations;
    }
  }
  
  /**
   * Add translations for a specific language and namespace
   * @param language The language code
   * @param namespace The namespace for the translations
   * @param translations The translations to add
   */
  public addTranslations(
    language: string, 
    namespace: string, 
    translations: Record<string, string>
  ): void {
    if (!this.translations[language]) {
      this.translations[language] = {};
    }
    
    this.translations[language][namespace] = {
      ...this.translations[language][namespace],
      ...translations
    };
    
    // Add language to available languages if not already present
    if (!this.availableLanguages.includes(language)) {
      this.availableLanguages.push(language);
    }
  }
  
  /**
   * Get a localized string by key
   * @param key The translation key in format 'namespace:key'
   * @param params Optional parameters to substitute in the translation
   * @returns The localized string or the key if not found
   */
  translate(key: string, params?: Record<string, any>): string {
    const [namespace, translationKey] = key.split(':');
    
    if (!namespace || !translationKey) {
      return key; // Invalid key format
    }
    
    // Try to get the translation
    const translation = this.translations[this.currentLanguage]?.[namespace]?.[translationKey];
    
    if (!translation) {
      // Fallback to default language
      const fallback = this.translations[this.config.localization.defaultLanguage]?.[namespace]?.[translationKey];
      
      if (!fallback) {
        return key; // No translation found in any language
      }
      
      return this.interpolateParams(fallback, params);
    }
    
    return this.interpolateParams(translation, params);
  }
  
  /**
   * Get the current language code
   */
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }
  
  /**
   * Set the current language
   * @param language The language code to set
   */
  setLanguage(language: string): void {
    if (this.availableLanguages.includes(language)) {
      this.currentLanguage = language;
    }
  }
  
  /**
   * Get all available languages
   */
  getAvailableLanguages(): string[] {
    return [...this.availableLanguages];
  }
  
  /**
   * Check if a key exists in the current language
   * @param key The translation key to check
   */
  hasTranslation(key: string): boolean {
    const [namespace, translationKey] = key.split(':');
    
    if (!namespace || !translationKey) {
      return false; // Invalid key format
    }
    
    return Boolean(this.translations[this.currentLanguage]?.[namespace]?.[translationKey]);
  }
  
  /**
   * Get all translations for a specific namespace
   * @param namespace The namespace to get translations for
   */
  getNamespace(namespace: string): Record<string, string> {
    return this.translations[this.currentLanguage]?.[namespace] || {};
  }
  
  /**
   * Replace parameters in a translation string
   * @param text The text with parameter placeholders
   * @param params The parameters to substitute
   */
  private interpolateParams(text: string, params?: Record<string, any>): string {
    if (!params) {
      return text;
    }
    
    let result = text;
    
    // Replace {{paramName}} with the actual value
    Object.entries(params).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value));
    });
    
    return result;
  }
}
