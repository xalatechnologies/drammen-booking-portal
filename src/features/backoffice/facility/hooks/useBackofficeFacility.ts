import { useCallback, useState } from 'react';
import { useFacilityService } from '@/features/facility/hooks/useFacilityService';
import { Facility } from '@/features/facility/types/facility';
import { useLocalization } from '@/core/localization/hooks/useLocalization';
import { ServiceResponse } from '@/core/types/ServiceResponse';

/**
 * Type for facility status
 */
export type FacilityAdminStatus = 'active' | 'inactive' | 'maintenance' | 'pending';

/**
 * useBackofficeFacility - Hook for managing facilities in the admin interface
 * 
 * Following Single Responsibility Principle by focusing on admin-specific facility operations
 * Following Dependency Inversion Principle by depending on the core facility service
 */
export function useBackofficeFacility() {
  const { facilityService } = useFacilityService();
  const { language } = useLocalization();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  
  /**
   * Get all facilities for admin listing
   */
  const getAllFacilities = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      const result = await facilityService.getAllFacilities();
      setIsLoading(false);
      return result;
    } catch (err) {
      setError('Failed to fetch facilities');
      setIsLoading(false);
      return {
        success: false,
        error: {
          message: err instanceof Error ? err.message : 'Unknown error'
        }
      } as ServiceResponse<Facility[]>;
    }
  }, [facilityService]);

  /**
   * Get a facility by ID for admin editing
   */
  const getFacility = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      const result = await facilityService.getFacilityById(id);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(`Failed to fetch facility with ID ${id}`);
      setIsLoading(false);
      return {
        success: false,
        error: {
          message: err instanceof Error ? err.message : 'Unknown error'
        }
      } as ServiceResponse<Facility>;
    }
  }, [facilityService]);

  /**
   * Create a new facility
   */
  const createFacility = useCallback(async (facilityData: Partial<Facility>) => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      // Ensure all localization fields are properly formatted
      const result = await facilityService.createFacility(facilityData);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError('Failed to create facility');
      setIsLoading(false);
      return {
        success: false,
        error: {
          message: err instanceof Error ? err.message : 'Unknown error'
        }
      } as ServiceResponse<Facility>;
    }
  }, [facilityService]);

  /**
   * Update an existing facility
   */
  const updateFacility = useCallback(async (id: string, facilityData: Partial<Facility>) => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      const result = await facilityService.updateFacility(id, facilityData);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(`Failed to update facility with ID ${id}`);
      setIsLoading(false);
      return {
        success: false,
        error: {
          message: err instanceof Error ? err.message : 'Unknown error'
        }
      } as ServiceResponse<Facility>;
    }
  }, [facilityService]);

  /**
   * Delete a facility
   */
  const deleteFacility = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      const result = await facilityService.deleteFacility(id);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(`Failed to delete facility with ID ${id}`);
      setIsLoading(false);
      return {
        success: false,
        error: {
          message: err instanceof Error ? err.message : 'Unknown error'
        }
      } as ServiceResponse<boolean>;
    }
  }, [facilityService]);

  /**
   * Update facility status (admin-specific operation)
   */
  const updateFacilityStatus = useCallback(async (id: string, status: FacilityAdminStatus) => {
    setIsLoading(true);
    setError(undefined);
    
    try {
      // Use the core service to update the facility with the new status
      const result = await facilityService.updateFacility(id, { status: status as any });
      setIsLoading(false);
      return {
        success: !!result.success,
        data: !!result.success,
        error: result.error
      } as ServiceResponse<boolean>;
    } catch (err) {
      setError(`Failed to update status for facility with ID ${id}`);
      setIsLoading(false);
      return {
        success: false,
        error: {
          message: err instanceof Error ? err.message : 'Unknown error'
        }
      } as ServiceResponse<boolean>;
    }
  }, [facilityService]);

  return {
    isLoading,
    error,
    getAllFacilities,
    getFacility,
    createFacility,
    updateFacility,
    deleteFacility,
    updateFacilityStatus,
  };
}
