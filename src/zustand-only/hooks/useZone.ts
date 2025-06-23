import { useCallback, useMemo } from 'react';
import { useEntity } from './useEntity';
import { useZoneStore } from '../stores/useZoneStore';
import { Zone, ZoneFilter } from '../types/models';
import { useTranslation } from './useTranslation';

/**
 * Custom hook for working with zones
 * Provides enhanced functionality on top of the generic entity hook
 */
export function useZone(options: {
  autoLoad?: boolean;
  defaultFilters?: ZoneFilter;
} = {}) {
  const { t, currentLanguage } = useTranslation();
  const entityHook = useEntity<Zone>(useZoneStore, {
    autoLoad: options.autoLoad,
    defaultFilters: options.defaultFilters
  });
  
  const {
    entities: zones,
    selectedEntity: selectedZone,
    isLoading,
    error,
    loadEntities,
    loadEntity,
    createEntity,
    updateEntity,
    removeEntity,
    pagination,
    filters,
    setFilters,
    selectEntity
  } = entityHook;

  /**
   * Get localized name for a zone
   */
  const getLocalizedName = useCallback((zone: Zone | null): string => {
    if (!zone) return '';
    
    // Handle localized name (assuming name is a JSON object with language keys)
    if (typeof zone.name === 'object' && zone.name !== null) {
      return zone.name[currentLanguage] || 
             zone.name['en'] || 
             Object.values(zone.name)[0] || 
             '';
    }
    
    return String(zone.name || '');
  }, [currentLanguage]);
  
  /**
   * Get localized description for a zone
   */
  const getLocalizedDescription = useCallback((zone: Zone | null): string => {
    if (!zone || !zone.description) return '';
    
    // Handle localized description (assuming description is a JSON object with language keys)
    if (typeof zone.description === 'object' && zone.description !== null) {
      return zone.description[currentLanguage] || 
             zone.description['en'] || 
             Object.values(zone.description)[0] || 
             '';
    }
    
    return String(zone.description || '');
  }, [currentLanguage]);
  
  /**
   * Search zones by name or description
   */
  const searchZones = useCallback((search: string) => {
    setFilters({ ...filters, search });
  }, [filters, setFilters]);
  
  /**
   * Filter zones by location
   */
  const filterByLocation = useCallback((locationId: string) => {
    setFilters({ ...filters, locationId });
  }, [filters, setFilters]);
  
  /**
   * Filter zones by capacity
   */
  const filterByCapacity = useCallback((minCapacity?: number, maxCapacity?: number) => {
    setFilters({
      ...filters,
      minCapacity,
      maxCapacity
    });
  }, [filters, setFilters]);
  
  /**
   * Get zones grouped by location
   */
  const zonesByLocation = useMemo(() => {
    return zones.reduce<Record<string, Zone[]>>((acc, zone) => {
      const locationId = zone.locationId;
      if (!acc[locationId]) {
        acc[locationId] = [];
      }
      acc[locationId].push(zone);
      return acc;
    }, {});
  }, [zones]);
  
  /**
   * Get zone by code
   */
  const getZoneByCode = useCallback((code: string): Zone | undefined => {
    return zones.find(zone => zone.code === code);
  }, [zones]);
  
  /**
   * Check zone availability
   */
  const checkAvailability = useCallback(async (
    zoneId: string, 
    startDateTime: string, 
    endDateTime: string
  ) => {
    try {
      const api = new useZoneStore.getState().api;
      if (!api.checkAvailability) {
        throw new Error('Zone API does not implement checkAvailability method');
      }
      
      return await api.checkAvailability(zoneId, startDateTime, endDateTime);
    } catch (error) {
      console.error('Error checking zone availability:', error);
      return { 
        error: (error as Error).message,
        data: { isAvailable: false, conflictingBookings: [] }
      };
    }
  }, []);
  
  /**
   * Get available zones for a time period
   */
  const getAvailableZones = useCallback(async (
    locationId: string,
    startDateTime: string,
    endDateTime: string
  ) => {
    // First load all zones for the location
    await loadEntities({
      filters: { locationId },
      pagination: { page: 1, limit: 100 }
    });
    
    // Then check availability for each zone
    const availabilityPromises = zones
      .filter(zone => zone.locationId === locationId)
      .map(async zone => {
        const availability = await checkAvailability(zone.id, startDateTime, endDateTime);
        return {
          zone,
          isAvailable: availability.data?.isAvailable || false
        };
      });
    
    const results = await Promise.all(availabilityPromises);
    return results.filter(result => result.isAvailable).map(result => result.zone);
  }, [zones, loadEntities, checkAvailability]);
  
  return {
    // Base entity hook properties
    zones,
    selectedZone,
    isLoading,
    error,
    pagination,
    filters,
    
    // Base entity hook methods
    loadZones: loadEntities,
    loadZone: loadEntity,
    createZone: createEntity,
    updateZone: updateEntity,
    removeZone: removeEntity,
    selectZone: selectEntity,
    
    // Enhanced zone methods
    getLocalizedName,
    getLocalizedDescription,
    searchZones,
    filterByLocation,
    filterByCapacity,
    getZoneByCode,
    checkAvailability,
    getAvailableZones,
    
    // Derived data
    zonesByLocation
  };
}
