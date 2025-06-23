import { useCallback, useMemo } from 'react';
import { useEntity } from './useEntity';
import { useLocationStore } from '../stores/useLocationStore';
import { Location, LocationFilter } from '../types/models';
import { useTranslation } from './useTranslation';

/**
 * Custom hook for working with locations
 * Provides enhanced functionality on top of the generic entity hook
 */
export function useLocation(options: {
  autoLoad?: boolean;
  defaultFilters?: LocationFilter;
} = {}) {
  const { t, currentLanguage } = useTranslation();
  const entityHook = useEntity<Location>(useLocationStore, {
    autoLoad: options.autoLoad,
    defaultFilters: options.defaultFilters
  });
  
  const {
    entities: locations,
    selectedEntity: selectedLocation,
    isLoading,
    error,
    loadEntities,
    loadEntity,
    createEntity,
    updateEntity,
    removeEntity,
    pagination,
    filters,
    setFilters
  } = entityHook;

  /**
   * Get localized name for a location
   */
  const getLocalizedName = useCallback((location: Location | null): string => {
    if (!location) return '';
    
    // Handle localized name (assuming name is a JSON object with language keys)
    if (typeof location.name === 'object' && location.name !== null) {
      return location.name[currentLanguage] || 
             location.name['en'] || 
             Object.values(location.name)[0] || 
             '';
    }
    
    return String(location.name || '');
  }, [currentLanguage]);
  
  /**
   * Get localized description for a location
   */
  const getLocalizedDescription = useCallback((location: Location | null): string => {
    if (!location || !location.description) return '';
    
    // Handle localized description (assuming description is a JSON object with language keys)
    if (typeof location.description === 'object' && location.description !== null) {
      return location.description[currentLanguage] || 
             location.description['en'] || 
             Object.values(location.description)[0] || 
             '';
    }
    
    return String(location.description || '');
  }, [currentLanguage]);
  
  /**
   * Search locations by name or description
   */
  const searchLocations = useCallback((search: string) => {
    setFilters({ ...filters, search });
  }, [filters, setFilters]);
  
  /**
   * Filter locations by proximity to coordinates
   */
  const filterByProximity = useCallback((latitude: number, longitude: number, maxDistance: number) => {
    setFilters({
      ...filters,
      nearLatitude: latitude,
      nearLongitude: longitude,
      maxDistance
    });
  }, [filters, setFilters]);
  
  /**
   * Get locations with available zones
   */
  const getLocationsWithAvailableZones = useMemo(() => {
    return locations.filter(location => 
      location.zones && location.zones.length > 0
    );
  }, [locations]);
  
  /**
   * Get locations grouped by address
   */
  const locationsByAddress = useMemo(() => {
    return locations.reduce<Record<string, Location[]>>((acc, location) => {
      const address = location.address || t('common.noAddress');
      if (!acc[address]) {
        acc[address] = [];
      }
      acc[address].push(location);
      return acc;
    }, {});
  }, [locations, t]);
  
  /**
   * Get location by code
   */
  const getLocationByCode = useCallback((code: string): Location | undefined => {
    return locations.find(location => location.code === code);
  }, [locations]);
  
  /**
   * Format address for display
   */
  const formatAddress = useCallback((location: Location | null): string => {
    if (!location) return '';
    
    let parts = [];
    if (location.address) parts.push(location.address);
    
    // Add any additional address formatting logic here
    
    return parts.join(', ');
  }, []);
  
  /**
   * Get map URL for a location
   */
  const getMapUrl = useCallback((location: Location | null): string => {
    if (!location || !location.latitude || !location.longitude) return '';
    
    return `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
  }, []);
  
  return {
    // Base entity hook properties
    locations,
    selectedLocation,
    isLoading,
    error,
    pagination,
    filters,
    
    // Base entity hook methods
    loadLocations: loadEntities,
    loadLocation: loadEntity,
    createLocation: createEntity,
    updateLocation: updateEntity,
    removeLocation: removeEntity,
    
    // Enhanced location methods
    getLocalizedName,
    getLocalizedDescription,
    searchLocations,
    filterByProximity,
    getLocationByCode,
    formatAddress,
    getMapUrl,
    
    // Derived data
    getLocationsWithAvailableZones,
    locationsByAddress
  };
}
