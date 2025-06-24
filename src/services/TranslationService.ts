
import { supabase } from '@/integrations/supabase/client';
import { Language } from '@/i18n/types';
import { Translation, TranslationKey } from '@/types/translation';

class TranslationService {
  public cache = new Map<string, Map<Language, string>>();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      const { data: translations, error } = await supabase
        .from('translations')
        .select(`
          value,
          language_code,
          translation_keys!inner (
            key_path
          )
        `)
        .eq('is_active', true);

      if (error) throw error;

      // Build cache
      translations?.forEach((translation: any) => {
        const keyPath = translation.translation_keys.key_path;
        if (!this.cache.has(keyPath)) {
          this.cache.set(keyPath, new Map());
        }
        this.cache.get(keyPath)!.set(translation.language_code, translation.value);
      });

      this.isInitialized = true;
      console.log('Translation service initialized with', translations?.length, 'translations');
    } catch (error) {
      console.error('Failed to initialize TranslationService:', error);
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
    const { error } = await supabase
      .from('translation_keys')
      .insert({
        key_path: keyPath,
        namespace,
        description
      });

    if (error && !error.message.includes('duplicate')) {
      throw error;
    }
  }

  async setTranslation(keyPath: string, language: Language, value: string): Promise<void> {
    // First ensure the key exists
    await this.addTranslationKey(keyPath, 'dynamic');

    const { data: keyData } = await supabase
      .from('translation_keys')
      .select('id')
      .eq('key_path', keyPath)
      .single();

    if (keyData) {
      const { error } = await supabase
        .from('translations')
        .upsert({
          translation_key_id: keyData.id,
          language_code: language,
          value
        });

      if (error) throw error;

      // Update cache
      if (!this.cache.has(keyPath)) {
        this.cache.set(keyPath, new Map());
      }
      this.cache.get(keyPath)!.set(language, value);
    }
  }

  clearCache(): void {
    this.cache.clear();
    this.isInitialized = false;
  }
}

export const translationService = new TranslationService();
