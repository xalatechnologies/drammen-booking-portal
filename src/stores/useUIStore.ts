
import { create } from 'zustand';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

export type ViewMode = 'grid' | 'list' | 'map' | 'calendar';

interface UIStore {
  // View mode
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Modal states
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  
  // Sidebar states
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  
  // Mobile menu
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Filter states
  activeFilters: Record<string, any>;
  setActiveFilters: (filters: Record<string, any>) => void;
  clearFilters: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  // View mode
  currentView: 'grid',
  setCurrentView: (view) => set({ currentView: view }),
  
  // Loading states
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // Modal states
  isModalOpen: false,
  setIsModalOpen: (open) => set({ isModalOpen: open }),
  
  // Sidebar states
  isSidebarOpen: false,
  setIsSidebarOpen: (open) => set({ isSidebarOpen: open }),
  
  // Mobile menu
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  
  // Notifications
  notifications: [],
  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));
    
    // Auto-remove after duration (default 5 seconds)
    const duration = notification.duration || 5000;
    setTimeout(() => {
      get().removeNotification(id);
    }, duration);
  },
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  clearNotifications: () => set({ notifications: [] }),
  
  // Search state
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Filter states
  activeFilters: {},
  setActiveFilters: (filters) => set({ activeFilters: filters }),
  clearFilters: () => set({ activeFilters: {} }),
}));
