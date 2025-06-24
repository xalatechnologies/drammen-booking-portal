
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Global UI state
  isSidebarOpen: boolean;
  isDrawerOpen: boolean;
  drawerContent: 'booking' | 'filters' | 'cart' | null;
  activeModal: string | null;
  theme: 'light' | 'dark' | 'system';
  
  // Loading states
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: number;
  }>;
  
  // Actions
  setSidebarOpen: (open: boolean) => void;
  setDrawerOpen: (open: boolean, content?: 'booking' | 'filters' | 'cart' | null) => void;
  setActiveModal: (modalId: string | null) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setGlobalLoading: (loading: boolean) => void;
  setLoadingState: (key: string, loading: boolean) => void;
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      isSidebarOpen: false,
      isDrawerOpen: false,
      drawerContent: null,
      activeModal: null,
      theme: 'system',
      globalLoading: false,
      loadingStates: {},
      notifications: [],

      // Actions
      setSidebarOpen: (open) => {
        set({ isSidebarOpen: open });
      },

      setDrawerOpen: (open, content = null) => {
        set({ 
          isDrawerOpen: open,
          drawerContent: open ? content : null
        });
      },

      setActiveModal: (modalId) => {
        set({ activeModal: modalId });
      },

      setTheme: (theme) => {
        set({ theme });
      },

      setGlobalLoading: (loading) => {
        set({ globalLoading: loading });
      },

      setLoadingState: (key, loading) => {
        set(state => ({
          loadingStates: {
            ...state.loadingStates,
            [key]: loading
          }
        }));
      },

      addNotification: (notification) => {
        const id = Math.random().toString(36).substring(2);
        const timestamp = Date.now();
        set(state => ({
          notifications: [
            ...state.notifications,
            { ...notification, id, timestamp }
          ]
        }));

        // Auto-remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      },

      removeNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      }
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        isSidebarOpen: state.isSidebarOpen
      }),
    }
  )
);
