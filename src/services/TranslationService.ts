
import { Language } from '@/i18n/types';

class TranslationService {
  public cache = new Map<string, Map<Language, string>>();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    // Initialize with existing translation files
    try {
      const { bookingTranslations } = await import('@/i18n/translations/booking');
      const { commonTranslations } = await import('@/i18n/translations/common');
      const { facilityTranslations } = await import('@/i18n/translations/facility');
      const { navigationTranslations } = await import('@/i18n/translations/navigation');
      
      // Load translations into cache
      this.loadTranslationsIntoCache('booking', bookingTranslations);
      this.loadTranslationsIntoCache('common', commonTranslations);
      this.loadTranslationsIntoCache('facility', facilityTranslations);
      this.loadTranslationsIntoCache('navigation', navigationTranslations);
      
      console.log('Translation service initialized with JSON files');
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to load translation files:', error);
      this.isInitialized = true; // Still mark as initialized to avoid infinite loops
    }
  }

  private loadTranslationsIntoCache(namespace: string, translations: Record<Language, any>) {
    for (const [language, content] of Object.entries(translations)) {
      this.loadNestedTranslations(namespace, content, language as Language);
    }
  }

  private loadNestedTranslations(prefix: string, obj: any, language: Language, path: string = '') {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      const fullKey = `${prefix}.${currentPath}`;
      
      if (typeof value === 'string') {
        if (!this.cache.has(fullKey)) {
          this.cache.set(fullKey, new Map());
        }
        this.cache.get(fullKey)!.set(language, value);
      } else if (typeof value === 'object' && value !== null) {
        this.loadNestedTranslations(prefix, value, language, currentPath);
      }
    }
  }

  async getTranslation(keyPath: string, language: Language, fallback?: string): Promise<string> {
    await this.initialize();
    
    const keyCache = this.cache.get(keyPath);
    if (keyCache) {
      return keyCache.get(language) || keyCache.get('NO') || fallback || keyPath;
    }
    
    return fallback || keyPath;
  }

  async getTranslations(keyPaths: string[], language: Language): Promise<Record<string, string>> {
    await this.initialize();
    
    const result: Record<string, string> = {};
    for (const keyPath of keyPaths) {
      result[keyPath] = await this.getTranslation(keyPath, language);
    }
    return result;
  }

  async addTranslationKey(keyPath: string, namespace: string, description?: string): Promise<void> {
    // For JSON-based translations, this would require file system access
    console.log('JSON-based translation: Adding key would require file modification', keyPath, namespace, description);
  }

  async setTranslation(keyPath: string, language: Language, value: string): Promise<void> {
    // Update cache
    if (!this.cache.has(keyPath)) {
      this.cache.set(keyPath, new Map());
    }
    this.cache.get(keyPath)!.set(language, value);
    console.log('JSON-based translation: Setting value in cache', keyPath, language, value);
  }

  clearCache(): void {
    this.cache.clear();
    this.isInitialized = false;
  }
}

export const translationService = new TranslationService();
