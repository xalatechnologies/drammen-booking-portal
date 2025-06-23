import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { User, UserCreateInput, UserUpdateInput } from '../types/models';

interface UserState {
  // State
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: UserCreateInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  updateProfile: (data: UserUpdateInput) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      
      // Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) throw error;
          
          // Fetch user profile after successful login
          if (data.user) {
            await get().fetchCurrentUser();
          }
          
          set({ isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error('Login error:', error);
          set({ 
            error: (error as Error).message || 'Failed to login', 
            isLoading: false,
            isAuthenticated: false
          });
          return { 
            success: false, 
            error: (error as Error).message || 'Failed to login'
          };
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Register user with Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password || '',
            options: {
              data: {
                name: userData.name,
                locale: userData.locale
              }
            }
          });
          
          if (authError) throw authError;
          
          // Create user profile in the database
          if (authData.user) {
            const { error: profileError } = await supabase
              .from('users')
              .insert({
                id: authData.user.id,
                email: userData.email,
                name: userData.name,
                locale: userData.locale || 'no',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
            
            if (profileError) throw profileError;
            
            // Assign default role if provided
            if (userData.roleIds && userData.roleIds.length > 0) {
              const userRoles = userData.roleIds.map(roleId => ({
                userId: authData.user.id,
                roleId
              }));
              
              const { error: roleError } = await supabase
                .from('user_roles')
                .insert(userRoles);
              
              if (roleError) throw roleError;
            }
            
            // Fetch the newly created user
            await get().fetchCurrentUser();
          }
          
          set({ isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (error) {
          console.error('Registration error:', error);
          set({ 
            error: (error as Error).message || 'Failed to register', 
            isLoading: false 
          });
          return { 
            success: false, 
            error: (error as Error).message || 'Failed to register'
          };
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        
        try {
          await supabase.auth.signOut();
          set({ 
            currentUser: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Logout error:', error);
          set({ 
            error: (error as Error).message || 'Failed to logout', 
            isLoading: false 
          });
        }
      },
      
      fetchCurrentUser: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Get current session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            set({ 
              currentUser: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
            return;
          }
          
          // Get user profile from database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select(`
              *,
              roles:user_roles(
                role:roles(*)
              ),
              actorMemberships:actor_memberships(
                actor:actors(*)
              )
            `)
            .eq('id', session.user.id)
            .single();
          
          if (userError) throw userError;
          
          set({ 
            currentUser: userData as User, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Error fetching current user:', error);
          set({ 
            error: (error as Error).message || 'Failed to fetch user profile', 
            isLoading: false,
            isAuthenticated: false
          });
        }
      },
      
      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        
        try {
          const { currentUser } = get();
          
          if (!currentUser) {
            throw new Error('No user is logged in');
          }
          
          // Update auth metadata if name or email is changing
          if (data.email || data.name) {
            const updateData: any = {};
            if (data.email) updateData.email = data.email;
            
            const { error: authError } = await supabase.auth.updateUser({
              email: data.email,
              data: data.name ? { name: data.name } : undefined
            });
            
            if (authError) throw authError;
          }
          
          // Update user profile in database
          const { data: updatedUser, error: profileError } = await supabase
            .from('users')
            .update({
              ...data,
              updatedAt: new Date().toISOString()
            })
            .eq('id', currentUser.id)
            .select(`
              *,
              roles:user_roles(
                role:roles(*)
              ),
              actorMemberships:actor_memberships(
                actor:actors(*)
              )
            `)
            .single();
          
          if (profileError) throw profileError;
          
          set({ 
            currentUser: updatedUser as User, 
            isLoading: false 
          });
          
          return { success: true };
        } catch (error) {
          console.error('Error updating profile:', error);
          set({ 
            error: (error as Error).message || 'Failed to update profile', 
            isLoading: false 
          });
          return { 
            success: false, 
            error: (error as Error).message || 'Failed to update profile'
          };
        }
      },
      
      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
          });
          
          if (error) throw error;
          
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          console.error('Error resetting password:', error);
          set({ 
            error: (error as Error).message || 'Failed to reset password', 
            isLoading: false 
          });
          return { 
            success: false, 
            error: (error as Error).message || 'Failed to reset password'
          };
        }
      },
      
      changePassword: async (currentPassword, newPassword) => {
        set({ isLoading: true, error: null });
        
        try {
          // First verify the current password
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            throw new Error('No active session');
          }
          
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: session.user.email || '',
            password: currentPassword
          });
          
          if (signInError) throw new Error('Current password is incorrect');
          
          // Change the password
          const { error } = await supabase.auth.updateUser({
            password: newPassword
          });
          
          if (error) throw error;
          
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          console.error('Error changing password:', error);
          set({ 
            error: (error as Error).message || 'Failed to change password', 
            isLoading: false 
          });
          return { 
            success: false, 
            error: (error as Error).message || 'Failed to change password'
          };
        }
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Custom hook for user operations
export function useUser() {
  const userStore = useUserStore();
  
  // Initialize user data on first load
  React.useEffect(() => {
    if (!userStore.currentUser && userStore.isAuthenticated) {
      userStore.fetchCurrentUser();
    }
  }, []);
  
  // Check if user has a specific role
  const hasRole = (roleName: string): boolean => {
    if (!userStore.currentUser || !userStore.currentUser.roles) {
      return false;
    }
    
    return userStore.currentUser.roles.some(userRole => 
      userRole.role?.name === roleName
    );
  };
  
  // Check if user has a specific permission
  const hasPermission = (permissionName: string): boolean => {
    if (!userStore.currentUser || !userStore.currentUser.roles) {
      return false;
    }
    
    return userStore.currentUser.roles.some(userRole => 
      userRole.role?.permissions?.some(permission => 
        permission.name === permissionName
      )
    );
  };
  
  // Get user's primary actor (organization)
  const getPrimaryActor = () => {
    if (!userStore.currentUser || !userStore.currentUser.actorMemberships) {
      return null;
    }
    
    // Find the first organization membership
    const orgMembership = userStore.currentUser.actorMemberships.find(
      membership => membership.actor?.type === 'ORGANIZATION'
    );
    
    return orgMembership?.actor || null;
  };
  
  return {
    ...userStore,
    hasRole,
    hasPermission,
    getPrimaryActor
  };
}

// Import React at the top
import React from 'react';
