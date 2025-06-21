
import { useFacilityStore } from '@/stores/useFacilityStore';
import { useZoneStore } from '@/stores/useZoneStore';
import { useAdditionalServicesStore } from '@/stores/useAdditionalServicesStore';

export const useGlobalState = () => {
  // Remove user store references since it doesn't exist
  const facilities = useFacilityStore(state => state.facilities);
  const currentFacility = useFacilityStore(state => state.currentFacility);
  const setCurrentFacility = useFacilityStore(state => state.setCurrentFacility);
  
  const zones = useZoneStore(state => state.zones);
  const currentZone = useZoneStore(state => state.currentZone);
  const setCurrentZone = useZoneStore(state => state.setCurrentZone);
  
  const services = useAdditionalServicesStore(state => state.services);
  const selectedService = useAdditionalServicesStore(state => state.selectedService);
  const setSelectedService = useAdditionalServicesStore(state => state.setSelectedService);
  const clearError = useAdditionalServicesStore(state => state.clearError);
  
  const resetAll = () => {
    setCurrentFacility(null);
    setCurrentZone(null);
    setSelectedService(null);
    clearError();
  };
  
  const isLoading = useAdditionalServicesStore(state => state.loading);
  
  return {
    // Facility state
    facilities,
    currentFacility,
    setCurrentFacility,
    
    // Zone state
    zones,
    currentZone,
    setCurrentZone,
    
    // Services state
    services,
    selectedService,
    setSelectedService,
    
    // Global actions
    resetAll,
    isLoading
  };
};
