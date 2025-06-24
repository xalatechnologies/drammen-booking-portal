
import { create } from 'zustand';

interface TranslationState {
  currentLanguage: string;
  isInitialized: boolean;
  setLanguage: (language: string) => void;
  getTranslation: (key: string, fallback?: string) => string;
  initializeTranslations: () => Promise<void>;
}

export const useTranslationStore = create<TranslationState>((set, get) => ({
  currentLanguage: 'NO',
  isInitialized: true, // Mock as initialized
  
  setLanguage: (language: string) => set({ currentLanguage: language }),
  
  getTranslation: (key: string, fallback?: string) => {
    // Mock implementation - replace with actual translation logic
    return fallback || key;
  },

  initializeTranslations: async () => {
    // Mock initialization - already initialized
    set({ isInitialized: true });
  }
}));
