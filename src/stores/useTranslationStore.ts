
import { create } from 'zustand';

interface TranslationState {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  getTranslation: (key: string, fallback?: string) => string;
}

export const useTranslationStore = create<TranslationState>((set, get) => ({
  currentLanguage: 'NO',
  
  setLanguage: (language: string) => set({ currentLanguage: language }),
  
  getTranslation: (key: string, fallback?: string) => {
    // Mock implementation - replace with actual translation logic
    return fallback || key;
  }
}));
