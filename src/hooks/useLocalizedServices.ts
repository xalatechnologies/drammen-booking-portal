
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// Simplified - no longer using complex service layers
export function useLocalizedServices() {
  const { language } = useLanguage();

  useEffect(() => {
    console.log('Language changed to:', language);
  }, [language]);

  return {
    // Return simple language context for now
    language
  };
}
