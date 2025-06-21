
import { Language } from '@/i18n/types';
import { LocalizedAdditionalService } from '@/types/localization';

export class LocalizedAdditionalServiceRepository {
  private currentLanguage: Language = 'NO';

  setLanguage(language: Language) {
    this.currentLanguage = language;
  }

  async getServicesByCategory(category: string): Promise<LocalizedAdditionalService[]> {
    // Mock implementation - return empty array for now
    return [];
  }

  async getServiceById(id: string): Promise<LocalizedAdditionalService | null> {
    // Mock implementation - return null for now
    return null;
  }

  async getAllServices(): Promise<LocalizedAdditionalService[]> {
    // Mock implementation - return empty array for now
    return [];
  }
}
