
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from '@/i18n/types';
import { FacilityView } from '@/types/translation';
import { translationService } from '@/services/TranslationService';
import { facilityTranslationService } from '@/services/FacilityTranslationService';

interface TranslationState {
  // Current language
  currentLanguage: Language;
  
  // Translation service state
  isInitialized: boolean;
  initializationError: string | null;
  
  // Translated facilities cache
  translatedFacilities: FacilityView[];
  facilitiesLoading: boolean;
  facilitiesError: string | null;
  
  // Actions
  setLanguage: (language: Language) => void;
  initializeTranslations: () => Promise<void>;
  loadTranslatedFacilities: () => Promise<void>;
  clearCache: () => void;
}

export const useTranslationStore = create<TranslationState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentLanguage: 'NO',
      isInitialized: false,
      initializationError: null,
      translatedFacilities: [],
      facilitiesLoading: false,
      facilitiesError: null,

      // Actions
      setLanguage: (language) => {
        set({ currentLanguage: language });
        // Reload facilities when language changes
        get().loadTranslatedFacilities();
      },

      initializeTranslations: async () => {
        try {
          set({ initializationError: null });
          console.log('Initializing translation service...');
          await translationService.initialize();
          set({ isInitialized: true });
          console.log('Translation service initialized successfully');
        } catch (error) {
          console.error('Failed to initialize translations:', error);
          set({ 
            initializationError: error instanceof Error ? error.message : 'Failed to initialize translations',
            isInitialized: false 
          });
        }
      },

      loadTranslatedFacilities: async () => {
        const { currentLanguage, isInitialized } = get();
        
        if (!isInitialized) {
          await get().initializeTranslations();
        }

        set({ facilitiesLoading: true, facilitiesError: null });
        
        try {
          // This would normally load from database, but for now we'll use empty array
          // In a real implementation, you'd load core facilities and translate them
          const translatedFacilities: FacilityView[] = [];
          
          set({ 
            translatedFacilities,
            facilitiesLoading: false 
          });
        } catch (error) {
          console.error('Failed to load translated facilities:', error);
          set({ 
            facilitiesError: error instanceof Error ? error.message : 'Failed to load facilities',
            facilitiesLoading: false 
          });
        }
      },

      clearCache: () => {
        translationService.clearCache();
        facilityTranslationService.clearCache();
        set({
          isInitialized: false,
          translatedFacilities: [],
          initializationError: null,
          facilitiesError: null
        });
      }
    }),
    {
      name: 'translation-storage',
      partialize: (state) => ({
        currentLanguage: state.currentLanguage
      }),
    }
  )
);
