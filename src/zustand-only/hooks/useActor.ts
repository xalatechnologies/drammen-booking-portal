import { useCallback, useMemo } from 'react';
import { useActorStore } from '../stores/useActorStore';
import { useUserStore } from '../stores/useUserStore';
import { Actor, ActorFilter, ActorType } from '../types/models';
import { useTranslation } from './useTranslation';

/**
 * Custom hook for working with actors (organizations, individuals)
 * Provides enhanced functionality on top of the actor store
 */
export function useActor(options: {
  autoLoad?: boolean;
  defaultFilters?: ActorFilter;
  loadUserActors?: boolean;
} = {}) {
  const { t, currentLanguage } = useTranslation();
  const actorStore = useActorStore();
  const userStore = useUserStore();
  
  const {
    items: actors,
    selectedItem: selectedActor,
    isLoading,
    error,
    fetchList: fetchActors,
    fetchById: fetchActorById,
    create: createActor,
    update: updateActor,
    remove: removeActor,
    setSelectedItem: selectActor,
    userActors,
    fetchUserActors,
    addMember,
    removeMember
  } = actorStore;

  // Load actors on mount if autoLoad is true
  React.useEffect(() => {
    if (options.autoLoad) {
      fetchActors({
        filters: options.defaultFilters
      });
    }
  }, [options.autoLoad, options.defaultFilters, fetchActors]);
  
  // Load user actors if loadUserActors is true
  React.useEffect(() => {
    if (options.loadUserActors && userStore.currentUser) {
      fetchUserActors(userStore.currentUser.id);
    }
  }, [options.loadUserActors, userStore.currentUser, fetchUserActors]);
  
  /**
   * Get localized name for an actor
   */
  const getLocalizedName = useCallback((actor: Actor | null): string => {
    if (!actor) return '';
    
    // Handle localized name (assuming name is a JSON object with language keys)
    if (typeof actor.name === 'object' && actor.name !== null) {
      return actor.name[currentLanguage] || 
             actor.name['en'] || 
             Object.values(actor.name)[0] || 
             '';
    }
    
    return String(actor.name || '');
  }, [currentLanguage]);
  
  /**
   * Get actors by type
   */
  const getActorsByType = useCallback((type: ActorType): Actor[] => {
    return actors.filter(actor => actor.type === type);
  }, [actors]);
  
  /**
   * Get organizations (actors of type ORGANIZATION)
   */
  const organizations = useMemo(() => {
    return getActorsByType('ORGANIZATION');
  }, [getActorsByType]);
  
  /**
   * Get individuals (actors of type INDIVIDUAL)
   */
  const individuals = useMemo(() => {
    return getActorsByType('INDIVIDUAL');
  }, [getActorsByType]);
  
  /**
   * Check if current user is a member of an actor
   */
  const isUserMemberOf = useCallback((actorId: string): boolean => {
    if (!userStore.currentUser) return false;
    
    return userActors.some(actor => actor.id === actorId);
  }, [userStore.currentUser, userActors]);
  
  /**
   * Get user's role in an actor
   */
  const getUserRoleInActor = useCallback((actorId: string): string | null => {
    if (!userStore.currentUser || !userStore.currentUser.actorMemberships) return null;
    
    const membership = userStore.currentUser.actorMemberships.find(
      m => m.actorId === actorId
    );
    
    return membership?.role || null;
  }, [userStore.currentUser]);
  
  /**
   * Check if user has admin role in an actor
   */
  const isUserAdminOf = useCallback((actorId: string): boolean => {
    const role = getUserRoleInActor(actorId);
    return role === 'admin';
  }, [getUserRoleInActor]);
  
  /**
   * Get user's primary organization
   */
  const getPrimaryOrganization = useCallback((): Actor | null => {
    if (!userActors.length) return null;
    
    // Find first organization the user is a member of
    return userActors.find(actor => actor.type === 'ORGANIZATION') || null;
  }, [userActors]);
  
  return {
    // Base store properties
    actors,
    selectedActor,
    isLoading,
    error,
    userActors,
    
    // Base store methods
    fetchActors,
    fetchActorById,
    createActor,
    updateActor,
    removeActor,
    selectActor,
    fetchUserActors,
    addMember,
    removeMember,
    
    // Enhanced methods
    getLocalizedName,
    getActorsByType,
    isUserMemberOf,
    getUserRoleInActor,
    isUserAdminOf,
    getPrimaryOrganization,
    
    // Derived data
    organizations,
    individuals
  };
}

// Import React at the top
import React from 'react';
