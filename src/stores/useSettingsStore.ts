import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderTime: number; // hours before booking
}

interface DisplaySettings {
  dateFormat: string;
  timeFormat: '12h' | '24h';
  firstDayOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
  showCancelledBookings: boolean;
}

interface SettingsState {
  // State
  theme: ThemeSettings;
  notifications: NotificationSettings;
  display: DisplaySettings;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateTheme: (settings: Partial<ThemeSettings>) => void;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updateDisplay: (settings: Partial<DisplaySettings>) => void;
  syncWithServer: () => Promise<void>;
  resetToDefaults: () => void;
}

// Default settings
const defaultSettings = {
  theme: {
    mode: 'system' as const,
    primaryColor: '#0f766e',
    secondaryColor: '#0369a1',
    fontSize: 'medium' as const
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    reminderTime: 24
  },
  display: {
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h' as const,
    firstDayOfWeek: 1 as const,
    showCancelledBookings: false
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      ...defaultSettings,
      isLoading: false,
      error: null,
      
      // Actions
      updateTheme: (settings) => {
        set(state => ({
          theme: {
            ...state.theme,
            ...settings
          }
        }));
      },
      
      updateNotifications: (settings) => {
        set(state => ({
          notifications: {
            ...state.notifications,
            ...settings
          }
        }));
      },
      
      updateDisplay: (settings) => {
        set(state => ({
          display: {
            ...state.display,
            ...settings
          }
        }));
      },
      
      syncWithServer: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Get current user
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            throw new Error('User not authenticated');
          }
          
          // Get user's settings from database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('settings')
            .eq('id', session.user.id)
            .single();
          
          if (userError) throw userError;
          
          if (userData && userData.settings) {
            // Update local settings with server settings
            const serverSettings = userData.settings;
            
            set(state => ({
              theme: {
                ...state.theme,
                ...(serverSettings.theme || {})
              },
              notifications: {
                ...state.notifications,
                ...(serverSettings.notifications || {})
              },
              display: {
                ...state.display,
                ...(serverSettings.display || {})
              },
              isLoading: false
            }));
          } else {
            // Save current settings to server
            await supabase
              .from('users')
              .update({
                settings: {
                  theme: get().theme,
                  notifications: get().notifications,
                  display: get().display
                }
              })
              .eq('id', session.user.id);
            
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('Error syncing settings with server:', error);
          set({ 
            error: (error as Error).message || 'Failed to sync settings', 
            isLoading: false 
          });
        }
      },
      
      resetToDefaults: () => {
        set({
          ...defaultSettings,
          error: null
        });
      }
    }),
    {
      name: 'settings-storage'
    }
  )
);

// Custom hook for settings with derived values
export function useSettings() {
  const settings = useSettingsStore();
  
  // Get effective theme mode considering system preference
  const getEffectiveThemeMode = (): 'light' | 'dark' => {
    if (settings.theme.mode === 'system') {
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return settings.theme.mode;
  };
  
  // Format date according to settings
  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const format = settings.display.dateFormat;
    
    // Simple formatting implementation
    // In a real app, you would use a library like date-fns or dayjs
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    return format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year.toString());
  };
  
  // Format time according to settings
  const formatTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const is24h = settings.display.timeFormat === '24h';
    
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    
    if (is24h) {
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    } else {
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours || 12; // Convert 0 to 12
      return `${hours}:${minutes} ${period}`;
    }
  };
  
  return {
    ...settings,
    getEffectiveThemeMode,
    formatDate,
    formatTime,
    
    // Computed properties
    isDarkMode: getEffectiveThemeMode() === 'dark',
    cssVars: {
      '--primary-color': settings.theme.primaryColor,
      '--secondary-color': settings.theme.secondaryColor,
      '--font-size-base': settings.theme.fontSize === 'small' ? '0.875rem' : 
                          settings.theme.fontSize === 'large' ? '1.125rem' : '1rem'
    }
  };
}
