
// Simplified TranslationService without database dependencies
export class TranslationService {
  static async getTranslation(key: string, language: string = 'NO'): Promise<string> {
    // Return the key as fallback since we don't have translation tables
    return key;
  }

  static async getTranslations(language: string = 'NO'): Promise<Record<string, string>> {
    // Return empty object as fallback
    return {};
  }

  static async setTranslation(key: string, language: string, value: string): Promise<boolean> {
    // Mock implementation - always return success
    console.log(`Translation set: ${key} -> ${value} (${language})`);
    return true;
  }

  static async createTranslationKey(keyPath: string, defaultValues: Record<string, string>): Promise<string> {
    // Mock implementation - return a generated ID
    return `key_${Date.now()}`;
  }

  static async updateTranslationKey(keyId: string, updates: Record<string, string>): Promise<boolean> {
    // Mock implementation - always return success
    console.log(`Translation key updated: ${keyId}`, updates);
    return true;
  }

  static async deleteTranslationKey(keyId: string): Promise<boolean> {
    // Mock implementation - always return success
    console.log(`Translation key deleted: ${keyId}`);
    return true;
  }
}
