
import { Language } from '@/i18n/types';
import { LocalizedAdditionalService } from '@/types/localization';

export class LocalizedAdditionalServiceRepository {
  private currentLanguage: Language = 'NO';

  setLanguage(language: Language) {
    this.currentLanguage = language;
  }

  async getServicesByCategory(category: string): Promise<LocalizedAdditionalService[]> {
    // Mock implementation - replace with actual data fetching
    return [];
  }

  async getServiceById(id: string): Promise<LocalizedAdditionalService | null> {
    // Mock implementation - replace with actual data fetching
    return null;
  }
}
