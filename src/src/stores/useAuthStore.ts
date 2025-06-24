
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string;
  email: string;
  type?: 'id-porten' | 'feide' | 'municipal';
}

interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string, type?: 'id-porten' | 'feide' | 'municipal') => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      user: null,
      isLoading: false,

      // Actions
      login: async (email: string, password: string, type = 'id-porten') => {
        set({ isLoading: true });
        try {
          // Simulate login - in real app this would be API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const userData: User = { 
            name: "John Doe", 
            email,
            type 
          };
          
          set({ 
            isAuthenticated: true, 
            user: userData, 
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ 
          isAuthenticated: false, 
          user: null, 
          isLoading: false 
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setUser: (user: User | null) => {
        set({ 
          user, 
          isAuthenticated: user !== null 
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated, 
        user: state.user 
      }),
    }
  )
);
