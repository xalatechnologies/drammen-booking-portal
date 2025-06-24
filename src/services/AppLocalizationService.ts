
import { Language } from '@/i18n/types';

export class AppLocalizationService {
  /**
   * Get localized content from JSONB field
   * @param content - The JSONB content object with language keys
   * @param language - The target language
   * @param fallback - Optional fallback text
   * @returns Localized string
   */
  static getLocalizedContent(
    content: any,
    language: Language,
    fallback?: string
  ): string {
    if (!content) return fallback || '';
    
    if (typeof content === 'string') return content;
    
    if (typeof content === 'object' && content !== null) {
      // Try target language first
      if (content[language]) {
        return content[language];
      }
      
      // Fallback to Norwegian
      if (content['NO']) {
        return content['NO'];
      }
      
      // Fallback to English
      if (content['EN']) {
        return content['EN'];
      }
      
      // Try to get any available language
      const keys = Object.keys(content);
      if (keys.length > 0) {
        return content[keys[0]];
      }
    }
    
    return fallback || '';
  }

  /**
   * Create localized content object
   * @param noText - Norwegian text
   * @param enText - English text (optional)
   * @returns JSONB object for database storage
   */
  static createLocalizedContent(noText: string, enText?: string): any {
    const content: any = { NO: noText };
    if (enText) {
      content.EN = enText;
    }
    return content;
  }
}
