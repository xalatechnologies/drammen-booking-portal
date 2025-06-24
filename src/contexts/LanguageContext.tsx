
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'NO' | 'EN';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Initialize from localStorage or default to 'NO'
    const stored = localStorage.getItem('language') as Language;
    return stored && ['NO', 'EN'].includes(stored) ? stored : 'NO';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    // Dispatch custom event for components that need it
    window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
  };

  const toggleLanguage = () => {
    setLanguage(language === 'NO' ? 'EN' : 'NO');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
