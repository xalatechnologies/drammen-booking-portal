
import { useFacilityStore } from '@/stores/useEntityStore';
import { useFacilityUIStore } from '@/stores/ui/useFacilityUIStore';
import { Facility } from '@/types/facility';
import { toast } from 'sonner';

/**
 * Facility Admin Hook
 * 
 * This custom hook combines the generic entity store for facilities with the UI-specific state,
 * providing a unified interface for components to interact with.
 * 
 * It follows the pattern of separating data and UI concerns while providing convenient
 * access to both through a single hook.
 */
export function useFacilityAdmin() {
  // Entity state and actions from the generic entity store
  const {
    entities: facilities,
    currentEntity: selectedFacility,
    isLoading,
    error,
    fetchAll,
    fetchById,
    createEntity,
    updateEntity,
    deleteEntity,
    setCurrentEntity,
    setError,
  } = useFacilityStore();
  
  // UI state and actions from the UI store
  const {
    viewMode,
    filters,
    formState,
    setViewMode,
    setFilters,
    setSearchFilter,
    setStatusFilter,
    setCategoryFilter,
    resetFilters,
    openCreateForm,
    openEditForm,
    closeForm,
  } = useFacilityUIStore();
  
  // Combined actions that interact with both stores
  const handleFacilitySelect = (facility: Facility) => {
    setCurrentEntity(facility);
    openEditForm();
  };
  
  const fetchFacilities = async (params = {}) => {
    // Combine UI filters with any additional params
    const queryParams = {
      ...filters,
      ...params,
      skipRelated: true, // Skip related tables when fetching list for better performance
    };
    
    // Remove search parameter as it doesn't exist as a column in the database
    // We'll handle search filtering client-side in the component
    if (queryParams.search) {
      delete queryParams.search;
    }
    
    // Convert 'all' values to undefined so they don't filter the results
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === 'all') {
        delete queryParams[key];
      }
    });
    
    return fetchAll();
  };
  
  const createFacility = async (data: Partial<Facility>) => {
    try {
      await createEntity(data);
      toast.success('Facility created successfully');
      closeForm();
      return true;
    } catch (error: any) {
      toast.error(`Error creating facility: ${error.message}`);
      throw error;
    }
  };
  
  const updateFacility = async (id: string, data: Partial<Facility>) => {
    try {
      await updateEntity(id, data);
      toast.success('Facility updated successfully');
      closeForm();
      return true;
    } catch (error: any) {
      toast.error(`Error updating facility: ${error.message}`);
      throw error;
    }
  };
  
  const deleteFacility = async (id: string) => {
    try {
      await deleteEntity(id);
      toast.success('Facility deleted successfully');
      closeForm();
      return true;
    } catch (error: any) {
      toast.error(`Error deleting facility: ${error.message}`);
      throw error;
    }
  };
  
  const clearError = () => {
    setError(null);
  };
  
  return {
    // Entity state
    facilities,
    selectedFacility,
    isLoading,
    error,
    
    // UI state
    viewMode,
    filters,
    formState,
    
    // Entity actions
    fetchFacilities,
    fetchFacilityById: fetchById,
    createFacility,
    updateFacility,
    deleteFacility,
    setSelectedFacility: setCurrentEntity,
    clearError,
    
    // UI actions
    setViewMode,
    setFilters,
    setSearchFilter,
    setStatusFilter,
    setCategoryFilter,
    resetFilters,
    openCreateForm,
    openEditForm,
    closeForm,
    
    // Combined actions
    handleFacilitySelect,
  };
}
