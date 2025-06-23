import { create } from 'zustand';
import { ActorApi } from './api/actorApi';
import { createGenericStore } from './createGenericStore';
import { Actor, ActorFilter, ActorCreateInput, ActorUpdateInput } from '../types/models';

// Create an instance of the actor API
const actorApi = new ActorApi();

// Create the base actor store using the generic store creator
const baseActorStore = createGenericStore<
  Actor, 
  ActorFilter, 
  ActorCreateInput, 
  ActorUpdateInput
>(actorApi);

// Extended actor store with additional methods
interface ActorStoreExtensions {
  // Additional state
  userActors: Actor[];
  isLoadingUserActors: boolean;
  
  // Additional actions
  fetchUserActors: (userId: string) => Promise<Actor[]>;
  addMember: (actorId: string, userId: string, role?: string) => Promise<boolean>;
  removeMember: (actorId: string, userId: string) => Promise<boolean>;
}

// Create and export the extended actor store
export const useActorStore = create<ReturnType<typeof baseActorStore.getState> & ActorStoreExtensions>(
  (set, get) => ({
    // Include all state and actions from the base store
    ...baseActorStore.getState(),
    
    // Additional state
    userActors: [],
    isLoadingUserActors: false,
    
    // Additional actions
    fetchUserActors: async (userId: string) => {
      set({ isLoadingUserActors: true });
      
      try {
        const response = await actorApi.getByUserId(userId);
        
        if (response.data) {
          set({ 
            userActors: response.data,
            isLoadingUserActors: false 
          });
          return response.data;
        } else {
          set({ 
            error: response.error || 'Failed to fetch user actors',
            isLoadingUserActors: false 
          });
          return [];
        }
      } catch (error) {
        set({ 
          error: (error as Error).message || 'An unexpected error occurred',
          isLoadingUserActors: false 
        });
        return [];
      }
    },
    
    addMember: async (actorId: string, userId: string, role?: string) => {
      set({ isLoading: true });
      
      try {
        const response = await actorApi.addMember(actorId, userId, role);
        
        if (response.data) {
          // Refresh the actor to get updated members list
          await get().fetchById(actorId);
          set({ isLoading: false });
          return true;
        } else {
          set({ 
            error: response.error || 'Failed to add member',
            isLoading: false 
          });
          return false;
        }
      } catch (error) {
        set({ 
          error: (error as Error).message || 'An unexpected error occurred',
          isLoading: false 
        });
        return false;
      }
    },
    
    removeMember: async (actorId: string, userId: string) => {
      set({ isLoading: true });
      
      try {
        const response = await actorApi.removeMember(actorId, userId);
        
        if (response.data) {
          // Refresh the actor to get updated members list
          await get().fetchById(actorId);
          set({ isLoading: false });
          return true;
        } else {
          set({ 
            error: response.error || 'Failed to remove member',
            isLoading: false 
          });
          return false;
        }
      } catch (error) {
        set({ 
          error: (error as Error).message || 'An unexpected error occurred',
          isLoading: false 
        });
        return false;
      }
    }
  })
);
