import { useState, useEffect, useCallback } from 'react';
import { Facility, FacilityDTO, FacilityStatus } from '@/types/facility';
import { IFacilityService, ServiceResponse } from '../services/interfaces/IFacilityService';
import { FacilityService } from '../services/implementations/FacilityService';

/**
 * Custom hook for facility operations
 * 
 * Following Single Responsibility Principle by focusing only on facility data operations
 * Following Dependency Inversion Principle by depending on service interface
 */
export function useFacility(language: string = 'EN') {
  // Create service instance with proper language context
  const facilityService: IFacilityService = new FacilityService(language);
  
  // State for loading, error, and data
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Helper function to handle service responses
   */
  const handleResponse = useCallback(<T>(
    response: ServiceResponse<T>, 
    onSuccess: (data: T) => void
  ): void => {
    if (response.success && response.data !== undefined) {
      onSuccess(response.data);
      setError(null);
    } else {
      setError(response.error?.message || 'An unknown error occurred');
    }
  }, []);
  
  /**
   * Get all facilities
   */
  const getAllFacilities = useCallback(async () => {
    setLoading(true);
    try {
      const response = await facilityService.getAllFacilities();
      let facilities: Facility[] = [];
      
      handleResponse(response, (data) => {
        facilities = data;
      });
      
      setLoading(false);
      return facilities;
    } catch (e: any) {
      setError(e.message || 'Failed to fetch facilities');
      setLoading(false);
      return [];
    }
  }, [facilityService, handleResponse]);
  
  /**
   * Get facility by ID
   */
  const getFacility = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await facilityService.getFacilityById(id);
      let facility: Facility | null = null;
      
      handleResponse(response, (data) => {
        facility = data;
      });
      
      setLoading(false);
      return facility;
    } catch (e: any) {
      setError(e.message || 'Failed to fetch facility');
      setLoading(false);
      return null;
    }
  }, [facilityService, handleResponse]);
  
  /**
   * Create a new facility
   */
  const createFacility = useCallback(async (data: FacilityDTO) => {
    setLoading(true);
    try {
      const response = await facilityService.createFacility(data);
      let facility: Facility | null = null;
      
      handleResponse(response, (data) => {
        facility = data;
      });
      
      setLoading(false);
      return facility;
    } catch (e: any) {
      setError(e.message || 'Failed to create facility');
      setLoading(false);
      return null;
    }
  }, [facilityService, handleResponse]);
  
  /**
   * Update an existing facility
   */
  const updateFacility = useCallback(async (id: string, data: Partial<FacilityDTO>) => {
    setLoading(true);
    try {
      const response = await facilityService.updateFacility(id, data);
      let facility: Facility | null = null;
      
      handleResponse(response, (data) => {
        facility = data;
      });
      
      setLoading(false);
      return facility;
    } catch (e: any) {
      setError(e.message || 'Failed to update facility');
      setLoading(false);
      return null;
    }
  }, [facilityService, handleResponse]);
  
  /**
   * Delete a facility
   */
  const deleteFacility = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await facilityService.deleteFacility(id);
      let success = false;
      
      handleResponse(response, (data) => {
        success = data;
      });
      
      setLoading(false);
      return success;
    } catch (e: any) {
      setError(e.message || 'Failed to delete facility');
      setLoading(false);
      return false;
    }
  }, [facilityService, handleResponse]);
  
  /**
   * Update facility status
   */
  const updateFacilityStatus = useCallback(async (id: string, status: string | FacilityStatus) => {
    setLoading(true);
    try {
      const response = await facilityService.updateFacilityStatus(id, status);
      let facility: Facility | null = null;
      
      handleResponse(response, (data) => {
        facility = data;
      });
      
      setLoading(false);
      return facility;
    } catch (e: any) {
      setError(e.message || 'Failed to update facility status');
      setLoading(false);
      return null;
    }
  }, [facilityService, handleResponse]);
  
  return {
    loading,
    error,
    getAllFacilities,
    getFacility,
    createFacility,
    updateFacility,
    deleteFacility,
    updateFacilityStatus,
  };
}
