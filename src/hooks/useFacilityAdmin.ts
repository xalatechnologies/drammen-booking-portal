
import { useFacilityStore } from '@/stores/useEntityStore';
import { useFacilityUIStore } from '@/stores/ui/useFacilityUIStore';
import { Facility } from '@/types/facility';
import { toast } from 'sonner';

/**
 * Facility Admin Hook
 * 
 * This custom hook combines the generic entity store for facilities with the UI-specific state,
 * providing a unified interface for components to interact with.
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
    
    return fetchAll(undefined, queryParams);
  };
  
  const createFacility = async (data: Partial<Facility>) => {
    try {
      const result = await createEntity(data);
      if (result) {
        toast.success('Facility created successfully');
        closeForm();
        return { data: result, error: null };
      }
      return { data: null, error: 'Failed to create facility' };
    } catch (error: any) {
      toast.error(`Error creating facility: ${error.message}`);
      return { data: null, error: error.message };
    }
  };
  
  const updateFacility = async (id: string, data: Partial<Facility>) => {
    try {
      const result = await updateEntity(id, data);
      if (result) {
        toast.success('Facility updated successfully');
        closeForm();
        return { data: result, error: null };
      }
      return { data: null, error: 'Failed to update facility' };
    } catch (error: any) {
      toast.error(`Error updating facility: ${error.message}`);
      return { data: null, error: error.message };
    }
  };
  
  const deleteFacility = async (id: string) => {
    try {
      const result = await deleteEntity(id);
      if (result) {
        toast.success('Facility deleted successfully');
        closeForm();
        return true;
      }
      return false;
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
