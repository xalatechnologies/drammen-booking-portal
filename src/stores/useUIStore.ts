
import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  currentView: 'list',
  setCurrentView: (view) => set({ currentView: view }),
}));
