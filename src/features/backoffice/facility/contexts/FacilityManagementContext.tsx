import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Facility } from '../../facility/types/facility';
import { useBackofficeFacilityService } from '../hooks/useBackofficeFacilityService';

/**
 * Interface for FacilityManagementContext state
 * Following Interface Segregation Principle with focused interface
 */
interface FacilityManagementContextType {
  facilities: Facility[];
  isLoading: boolean;
  error?: string;
  selectedFacilityId?: string;
  setSelectedFacilityId: (id?: string) => void;
  refreshFacilities: () => Promise<void>;
  deleteFacility: (id: string) => Promise<boolean>;
  updateFacilityStatus: (id: string, status: string) => Promise<boolean>;
}

// Create the context with default values
const FacilityManagementContext = createContext<FacilityManagementContextType>({
  facilities: [],
  isLoading: false,
  setSelectedFacilityId: () => {},
  refreshFacilities: async () => {},
  deleteFacility: async () => false,
  updateFacilityStatus: async () => false,
});

/**
 * FacilityManagementProvider props
 * Following Interface Segregation Principle
 */
interface FacilityManagementProviderProps {
  children: ReactNode;
}

/**
 * FacilityManagementProvider Component
 * 
 * Provides facility management state and operations to child components
 * Following Single Responsibility Principle by focusing on state management
 * Following Dependency Inversion by depending on service abstractions
 */
export function FacilityManagementProvider({ children }: FacilityManagementProviderProps) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>();

  const { backofficeService } = useBackofficeFacilityService();

  const refreshFacilities = async () => {
    setIsLoading(true);
    try {
      const result = await backofficeService.getAllFacilities();
      if (result.success) {
        setFacilities(result.data);
        setError(undefined);
      } else {
        setError(result.error?.message || 'Failed to fetch facilities');
        setFacilities([]);
      }
    } catch (err) {
      console.error('Error fetching facilities:', err);
      setError('An unexpected error occurred');
      setFacilities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFacility = async (id: string): Promise<boolean> => {
    try {
      const result = await backofficeService.deleteFacility(id);
      if (result.success) {
        await refreshFacilities();
        return true;
      } else {
        setError(result.error?.message || 'Failed to delete facility');
        return false;
      }
    } catch (err) {
      console.error('Error deleting facility:', err);
      setError('An unexpected error occurred');
      return false;
    }
  };

  const updateFacilityStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      const result = await backofficeService.updateFacilityStatus(id, status);
      if (result.success) {
        await refreshFacilities();
        return true;
      } else {
        setError(result.error?.message || 'Failed to update facility status');
        return false;
      }
    } catch (err) {
      console.error('Error updating facility status:', err);
      setError('An unexpected error occurred');
      return false;
    }
  };

  // Load facilities when the component mounts
  React.useEffect(() => {
    refreshFacilities();
  }, []);

  const value = {
    facilities,
    isLoading,
    error,
    selectedFacilityId,
    setSelectedFacilityId,
    refreshFacilities,
    deleteFacility,
    updateFacilityStatus,
  };

  return (
    <FacilityManagementContext.Provider value={value}>
      {children}
    </FacilityManagementContext.Provider>
  );
}

// Custom hook for using the facility management context
export const useFacilityManagement = () => useContext(FacilityManagementContext);
