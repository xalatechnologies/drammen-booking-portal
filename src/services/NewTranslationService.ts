
import { Language } from '@/i18n/types';

interface TranslationData {
  [key: string]: string | TranslationData;
}

class NewTranslationService {
  private translations: Record<Language, Record<string, TranslationData>> = {
    'NO': {},
    'EN': {}
  };
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Load system translations
      this.translations['NO']['system'] = await import('@/i18n/locales/no/system.json');
      this.translations['EN']['system'] = await import('@/i18n/locales/en/system.json');
      
      this.isInitialized = true;
      console.log('New translation service initialized');
    } catch (error) {
      console.error('Failed to initialize NewTranslationService:', error);
    }
  }

  getTranslation(keyPath: string, language: Language, fallback?: string): string {
    if (!this.isInitialized) return fallback || keyPath;
    
    const segments = keyPath.split('.');
    if (segments.length < 2) {
      return fallback || keyPath;
    }
    
    const namespace = segments[0];
    const path = segments.slice(1);
    
    const namespaceTranslations = this.translations[language][namespace];
    if (!namespaceTranslations) {
      if (language === 'EN') {
        return this.getTranslation(keyPath, 'NO', fallback);
      }
      return fallback || keyPath;
    }
    
    let current: any = namespaceTranslations;
    for (const segment of path) {
      if (current[segment] === undefined) {
        if (language === 'EN') {
          return this.getTranslation(keyPath, 'NO', fallback);
        }
        return fallback || keyPath;
      }
      current = current[segment];
    }
    
    if (typeof current === 'string') {
      return current;
    }
    
    return fallback || keyPath;
  }

  // Helper method to get localized content from JSON objects
  getLocalizedContent(content: any, language: Language, fallback?: string): string {
    if (!content) return fallback || '';
    
    if (typeof content === 'string') return content;
    
    if (typeof content === 'object' && content[language]) {
      return content[language];
    }
    
    if (typeof content === 'object' && content['NO']) {
      return content['NO'];
    }
    
    return fallback || '';
  }
}

export const newTranslationService = new NewTranslationService();
