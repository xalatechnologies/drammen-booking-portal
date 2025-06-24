
import { Language } from '@/i18n/types';

class TranslationService {
  public cache = new Map<string, Map<Language, string>>();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    // Mock implementation - in a real app this would connect to translation tables
    console.log('Translation service initialized (mock)');
    this.isInitialized = true;
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
    // Mock implementation
    console.log('Mock: Adding translation key', keyPath, namespace, description);
  }

  async setTranslation(keyPath: string, language: Language, value: string): Promise<void> {
    // Mock implementation - update cache
    if (!this.cache.has(keyPath)) {
      this.cache.set(keyPath, new Map());
    }
    this.cache.get(keyPath)!.set(language, value);
  }

  clearCache(): void {
    this.cache.clear();
    this.isInitialized = false;
  }
}

export const translationService = new TranslationService();
