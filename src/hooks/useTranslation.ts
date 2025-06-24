
import { useState, useEffect } from 'react';

// Simple translation hook without service dependency
export function useTranslation() {
  const [language, setLanguage] = useState('no');

  const t = (key: string, variables?: Record<string, any>, fallback?: string) => {
    // Simple fallback translation - just return the fallback or key
    return fallback || key;
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };

  return {
    t,
    i18n: {
      language,
      changeLanguage
    }
  };
}
