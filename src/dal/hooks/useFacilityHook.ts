import { useState, useCallback } from 'react';
import { ServiceResponse } from '@/types/api';
import { Facility } from '@/types/facility';
import { IFacilityService } from '../services/interfaces/IFacilityService';
import { CreateFacilityRequest, FacilityFilters, UpdateFacilityRequest } from '../repositories/implementations/FacilityRepositoryImpl';

/**
 * Hook result type for facility operations
 */
export interface UseFacilityResult {
  // State
  facilities: Facility[];
  loading: boolean;
  error: string | null;
  
  // Operations
  getAllFacilities: (filters?: FacilityFilters) => Promise<Facility[]>;
  getFacilityById: (id: string) => Promise<Facility | null>;
  createFacility: (data: CreateFacilityRequest) => Promise<Facility | null>;
  updateFacility: (id: string, data: Partial<UpdateFacilityRequest>) => Promise<Facility | null>;
  deleteFacility: (id: string) => Promise<boolean>;
  updateStatus: (id: string, status: string) => Promise<Facility | null>;
}

/**
 * useFacility Hook
 * 
 * Custom hook providing access to facility operations with state management
 * Following Single Responsibility Principle by focusing only on facility data operations
 * Following Dependency Inversion Principle by depending on service abstractions
 */
export const useFacilityHook = (
  facilityService: IFacilityService,
  defaultLanguage: string = 'EN'
): UseFacilityResult => {
  // State management
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get all facilities with optional filters
  const getAllFacilities = useCallback(async (filters?: FacilityFilters): Promise<Facility[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await facilityService.getAllFacilities(filters);
      
      if (response.success && response.data) {
        setFacilities(response.data);
        return response.data;
      } else {
        setError(response.error?.message || 'Failed to fetch facilities');
        return [];
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  }, [facilityService]);
  
  // Get facility by ID
  const getFacilityById = useCallback(async (id: string): Promise<Facility | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await facilityService.getFacilityById(id);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.error?.message || 'Failed to fetch facility');
        return null;
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [facilityService]);
  
  // Create a new facility
  const createFacility = useCallback(async (data: CreateFacilityRequest): Promise<Facility | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await facilityService.createFacility(data);
      
      if (response.success && response.data) {
        setFacilities(prev => [...prev, response.data!]);
        return response.data;
      } else {
        setError(response.error?.message || 'Failed to create facility');
        return null;
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [facilityService]);
  
  // Update an existing facility
  const updateFacility = useCallback(async (
    id: string, 
    data: Partial<UpdateFacilityRequest>
  ): Promise<Facility | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await facilityService.updateFacility(id, data);
      
      if (response.success && response.data) {
        // Update the facilities list with the updated facility
        setFacilities(prev => 
          prev.map(facility => facility.id === id ? response.data! : facility)
        );
        return response.data;
      } else {
        setError(response.error?.message || 'Failed to update facility');
        return null;
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [facilityService]);
  
  // Delete a facility
  const deleteFacility = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await facilityService.deleteFacility(id);
      
      if (response.success && response.data) {
        // Remove the deleted facility from the list
        setFacilities(prev => prev.filter(facility => facility.id !== id));
        return true;
      } else {
        setError(response.error?.message || 'Failed to delete facility');
        return false;
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, [facilityService]);
  
  // Update facility status
  const updateStatus = useCallback(async (id: string, status: string): Promise<Facility | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await facilityService.updateFacilityStatus(id, status);
      
      if (response.success && response.data) {
        // Update the facilities list with the updated facility
        setFacilities(prev => 
          prev.map(facility => facility.id === id ? response.data! : facility)
        );
        return response.data;
      } else {
        setError(response.error?.message || 'Failed to update facility status');
        return null;
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred');
      return false as any;
    } finally {
      setLoading(false);
    }
  }, [facilityService]);
  
  return {
    // State
    facilities,
    loading,
    error,
    
    // Operations
    getAllFacilities,
    getFacilityById,
    createFacility,
    updateFacility,
    deleteFacility,
    updateStatus
  };
};

export default useFacilityHook;
