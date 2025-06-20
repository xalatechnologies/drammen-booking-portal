
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface GdprState {
  hasConsented: boolean;
  consentDate: Date | null;
  preferences: CookiePreferences;
  showBanner: boolean;
  showPreferencesModal: boolean;
}

interface GdprContextType {
  state: GdprState;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
  savePreferences: (preferences: CookiePreferences) => void;
  showPreferences: () => void;
  hidePreferences: () => void;
  hideBanner: () => void;
  resetConsent: () => void;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
  functional: false,
};

const GdprContext = createContext<GdprContextType | undefined>(undefined);

export function GdprProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GdprState>(() => {
    const stored = localStorage.getItem('gdpr-consent');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          hasConsented: true,
          consentDate: new Date(parsed.consentDate),
          preferences: { ...defaultPreferences, ...parsed.preferences },
          showBanner: false,
          showPreferencesModal: false,
        };
      } catch {
        // Invalid stored data, reset
      }
    }
    
    return {
      hasConsented: false,
      consentDate: null,
      preferences: defaultPreferences,
      showBanner: true,
      showPreferencesModal: false,
    };
  });

  const saveToStorage = (preferences: CookiePreferences, consentDate: Date) => {
    const consentData = {
      preferences,
      consentDate: consentDate.toISOString(),
      version: '1.0', // For future consent version tracking
    };
    localStorage.setItem('gdpr-consent', JSON.stringify(consentData));
    
    // Also store a simple flag for quick checks
    localStorage.setItem('gdpr-accepted', 'true');
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    const consentDate = new Date();
    
    setState(prev => ({
      ...prev,
      hasConsented: true,
      consentDate,
      preferences: allAccepted,
      showBanner: false,
      showPreferencesModal: false,
    }));
    
    saveToStorage(allAccepted, consentDate);
  };

  const acceptNecessaryOnly = () => {
    const consentDate = new Date();
    
    setState(prev => ({
      ...prev,
      hasConsented: true,
      consentDate,
      preferences: defaultPreferences,
      showBanner: false,
      showPreferencesModal: false,
    }));
    
    saveToStorage(defaultPreferences, consentDate);
  };

  const savePreferences = (preferences: CookiePreferences) => {
    const consentDate = new Date();
    const finalPreferences = { ...preferences, necessary: true }; // Ensure necessary is always true
    
    setState(prev => ({
      ...prev,
      hasConsented: true,
      consentDate,
      preferences: finalPreferences,
      showBanner: false,
      showPreferencesModal: false,
    }));
    
    saveToStorage(finalPreferences, consentDate);
  };

  const showPreferences = () => {
    setState(prev => ({ ...prev, showPreferencesModal: true }));
  };

  const hidePreferences = () => {
    setState(prev => ({ ...prev, showPreferencesModal: false }));
  };

  const hideBanner = () => {
    setState(prev => ({ ...prev, showBanner: false }));
  };

  const resetConsent = () => {
    localStorage.removeItem('gdpr-consent');
    localStorage.removeItem('gdpr-accepted');
    setState({
      hasConsented: false,
      consentDate: null,
      preferences: defaultPreferences,
      showBanner: true,
      showPreferencesModal: false,
    });
  };

  // Check if consent needs renewal (e.g., after 12 months)
  useEffect(() => {
    if (state.hasConsented && state.consentDate) {
      const monthsAgo = new Date();
      monthsAgo.setMonth(monthsAgo.getMonth() - 12);
      
      if (state.consentDate < monthsAgo) {
        resetConsent();
      }
    }
  }, [state.hasConsented, state.consentDate]);

  return (
    <GdprContext.Provider value={{
      state,
      acceptAll,
      acceptNecessaryOnly,
      savePreferences,
      showPreferences,
      hidePreferences,
      hideBanner,
      resetConsent,
    }}>
      {children}
    </GdprContext.Provider>
  );
}

export function useGdpr() {
  const context = useContext(GdprContext);
  if (context === undefined) {
    throw new Error('useGdpr must be used within a GdprProvider');
  }
  return context;
}
