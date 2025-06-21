import { useUserStore } from '@/stores/useUserStore';
import { useFacilityStore } from '@/stores/useFacilityStore';
import { useZoneStore } from '@/stores/useZoneStore';
import { useAdditionalServicesStore } from '@/stores/useAdditionalServicesStore';

export const useGlobalState = () => {
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);
  const logout = useUserStore(state => state.logout);
  
  const facilities = useFacilityStore(state => state.facilities);
  const currentFacility = useFacilityStore(state => state.currentFacility);
  const setCurrentFacility = useFacilityStore(state => state.setCurrentFacility);
  
  const zones = useZoneStore(state => state.zones);
  const currentZone = useZoneStore(state => state.currentZone);
  const setCurrentZone = useZoneStore(state => state.setCurrentZone);
  
  const services = useAdditionalServicesStore(state => state.services);
  const selectedService = useAdditionalServicesStore(state => state.selectedService);
  const setSelectedService = useAdditionalServicesStore(state => state.setSelectedService);
  const clearError = useAdditionalServicesStore(state => state.clearError); // Use clearError instead of reset
  
  const resetAll = () => {
    logout();
    setCurrentFacility(null);
    setCurrentZone(null);
    setSelectedService(null);
    clearError(); // Use clearError method
  };
  
  const isLoading = useAdditionalServicesStore(state => state.loading); // Use loading instead of isLoading
  
  return {
    // User state
    user,
    setUser,
    logout,
    
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
