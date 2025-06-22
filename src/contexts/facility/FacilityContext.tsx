import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useFacility } from '@/dal/hooks/useFacility';
import { Facility } from '@/types/facility';
import { useLocalization } from '@/core/localization/hooks/useLocalization';

// For consistent typing within this component
type FacilityDTO = Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>;
type FacilityStatus = string;

/**
 * FacilityContext Interface
 * Following Interface Segregation Principle with a focused context interface
 */
interface FacilityContextType {
  facilities: Facility[];
  selectedFacility: Facility | null;
  loading: boolean;
  error: string | null;
  loadFacilities: () => Promise<void>;
  selectFacility: (id: string) => Promise<void>;
  clearSelection: () => void;
  createFacility: (data: FacilityDTO) => Promise<Facility | null>;
  updateFacility: (id: string, data: Partial<FacilityDTO>) => Promise<Facility | null>;
  deleteFacility: (id: string) => Promise<boolean>;
  updateFacilityStatus: (id: string, status: string | FacilityStatus) => Promise<Facility | null>;
}

/**
 * FacilityContext
 * 
 * Following Single Responsibility Principle by focusing only on facility state management
 */
const FacilityContext = createContext<FacilityContextType | undefined>(undefined);

/**
 * FacilityProviderProps Interface
 */
interface FacilityProviderProps {
  children: ReactNode;
}

/**
 * FacilityProvider Component
 * 
 * Provides facility data and operations to its children
 * Following Open/Closed Principle by being extendable without modification
 * Following Dependency Inversion Principle by depending on abstractions (hooks)
 */
export const FacilityProvider: React.FC<FacilityProviderProps> = ({ children }) => {
  const { language } = useLocalization();
  const { loading: hookLoading, error: hookError, getAllFacilities, getFacility, createFacility: createFacilityHook, updateFacility: updateFacilityHook, deleteFacility: deleteFacilityHook, updateFacilityStatus: updateStatusHook } = useFacility(language);
  
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load all facilities
  const loadFacilities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllFacilities();
      setFacilities(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to load facilities');
    } finally {
      setLoading(false);
    }
  }, [getAllFacilities]);
  
  // Select a facility by ID
  const selectFacility = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const facility = await getFacility(id);
      setSelectedFacility(facility);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to select facility');
    } finally {
      setLoading(false);
    }
  }, [getFacility]);
  
  // Clear selected facility
  const clearSelection = useCallback(() => {
    setSelectedFacility(null);
  }, []);
  
  // Create a new facility
  const createFacility = useCallback(async (data: FacilityDTO) => {
    setLoading(true);
    try {
      const newFacility = await createFacilityHook(data);
      if (newFacility) {
        setFacilities(prev => [...prev, newFacility]);
        setError(null);
      }
      return newFacility;
    } catch (e: any) {
      setError(e.message || 'Failed to create facility');
      return null;
    } finally {
      setLoading(false);
    }
  }, [createFacilityHook]);
  
  // Update an existing facility
  const updateFacility = useCallback(async (id: string, data: Partial<FacilityDTO>) => {
    setLoading(true);
    try {
      const updatedFacility = await updateFacilityHook(id, data);
      if (updatedFacility) {
        setFacilities(prev => 
          prev.map(f => f.id === id ? updatedFacility : f)
        );
        
        if (selectedFacility?.id === id) {
          setSelectedFacility(updatedFacility);
        }
        
        setError(null);
      }
      return updatedFacility;
    } catch (e: any) {
      setError(e.message || 'Failed to update facility');
      return null;
    } finally {
      setLoading(false);
    }
  }, [updateFacilityHook, selectedFacility]);
  
  // Delete a facility
  const deleteFacility = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const success = await deleteFacilityHook(id);
      if (success) {
        setFacilities(prev => prev.filter(f => f.id !== id));
        if (selectedFacility?.id === id) {
          setSelectedFacility(null);
        }
        setError(null);
      }
      return success;
    } catch (e: any) {
      setError(e.message || 'Failed to delete facility');
      return false;
    } finally {
      setLoading(false);
    }
  }, [deleteFacilityHook, selectedFacility]);
  
  // Update facility status
  const updateFacilityStatus = useCallback(async (id: string, status: string | FacilityStatus) => {
    setLoading(true);
    try {
      const updatedFacility = await updateStatusHook(id, status);
      if (updatedFacility) {
        setFacilities(prev => 
          prev.map(f => f.id === id ? updatedFacility : f)
        );
        
        if (selectedFacility?.id === id) {
          setSelectedFacility(updatedFacility);
        }
        
        setError(null);
      }
      return updatedFacility;
    } catch (e: any) {
      setError(e.message || 'Failed to update facility status');
      return null;
    } finally {
      setLoading(false);
    }
  }, [updateStatusHook, selectedFacility]);
  
  // Initialize data
  React.useEffect(() => {
    loadFacilities();
  }, [loadFacilities]);
  
  // Update context error state when hook error changes
  React.useEffect(() => {
    if (hookError) {
      setError(hookError);
    }
  }, [hookError]);
  
  // Update context loading state when hook loading changes
  React.useEffect(() => {
    setLoading(hookLoading);
  }, [hookLoading]);
  
  const contextValue: FacilityContextType = {
    facilities,
    selectedFacility,
    loading,
    error,
    loadFacilities,
    selectFacility,
    clearSelection,
    createFacility,
    updateFacility,
    deleteFacility,
    updateFacilityStatus,
  };
  
  return (
    <FacilityContext.Provider value={contextValue}>
      {children}
    </FacilityContext.Provider>
  );
};

/**
 * useFacilityContext Hook
 * 
 * Custom hook to use the facility context
 * Following Single Responsibility Principle by focusing only on providing context access
 */
export const useFacilityContext = () => {
  const context = useContext(FacilityContext);
  if (context === undefined) {
    throw new Error('useFacilityContext must be used within a FacilityProvider');
  }
  return context;
};
