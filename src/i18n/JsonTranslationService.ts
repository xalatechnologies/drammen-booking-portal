import { Language } from './types';

// Define the nested structure of our translation files
type NestedTranslations = {
  [key: string]: string | NestedTranslations;
};

/**
 * JSON-based Translation Service
 * 
 * This service manages translations from JSON files instead of database entries.
 * It provides a more efficient and maintainable way to handle translations.
 */
class JsonTranslationService {
  private translations: Record<Language, Record<string, NestedTranslations>> = {
    'NO': {},
    'EN': {}
  };
  private isInitialized = false;

  /**
   * Initialize the translation service by loading all translation files
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Load admin translations
      this.translations['NO']['admin'] = await import('./locales/no/admin.json');
      this.translations['EN']['admin'] = await import('./locales/en/admin.json');
      
      // Add more translation files as needed
      // this.translations['NO']['public'] = await import('./locales/no/public.json');
      // this.translations['EN']['public'] = await import('./locales/en/public.json');
      
      this.isInitialized = true;
      console.log('JSON Translation service initialized');
    } catch (error) {
      console.error('Failed to initialize JsonTranslationService:', error);
    }
  }

  /**
   * Get a translation by key path
   * @param keyPath The dot-notation path to the translation (e.g. 'admin.sidebar.overview')
   * @param language The language to get the translation for
   * @param fallback Optional fallback text if translation is not found
   */
  async getTranslation(keyPath: string, language: Language, fallback?: string): Promise<string> {
    await this.initialize();
    return this.getTranslationSync(keyPath, language, fallback);
  }

  /**
   * Get a translation synchronously (from already loaded translations)
   * @param keyPath The dot-notation path to the translation
   * @param language The language to get the translation for
   * @param fallback Optional fallback text if translation is not found
   */
  getTranslationSync(keyPath: string, language: Language, fallback?: string): string {
    if (!this.isInitialized) return fallback || keyPath;
    
    const segments = keyPath.split('.');
    if (segments.length < 2) {
      return fallback || keyPath;
    }
    
    const namespace = segments[0];
    const path = segments.slice(1);
    
    // Get the namespace translations
    const namespaceTranslations = this.translations[language][namespace];
    if (!namespaceTranslations) {
      // Try fallback to Norwegian if English is not found
      if (language === 'EN') {
        return this.getTranslationSync(keyPath, 'NO', fallback);
      }
      return fallback || keyPath;
    }
    
    // Navigate through the nested structure
    let current: any = namespaceTranslations;
    for (const segment of path) {
      if (current[segment] === undefined) {
        // Try fallback to Norwegian if English is not found
        if (language === 'EN') {
          return this.getTranslationSync(keyPath, 'NO', fallback);
        }
        return fallback || keyPath;
      }
      current = current[segment];
    }
    
    if (typeof current === 'string') {
      return current;
    }
    
    // If we reached a non-string value (object), return the fallback
    return fallback || keyPath;
  }

  /**
   * Add or update translations at runtime
   * @param language The language to update
   * @param namespace The namespace (e.g. 'admin')
   * @param translations The translations to add or update
   */
  addTranslations(language: Language, namespace: string, translations: NestedTranslations): void {
    if (!this.translations[language]) {
      this.translations[language] = {};
    }
    
    this.translations[language][namespace] = {
      ...this.translations[language][namespace],
      ...translations
    };
  }
}

export const jsonTranslationService = new JsonTranslationService();
