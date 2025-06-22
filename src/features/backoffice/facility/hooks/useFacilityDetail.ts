import { useState, useEffect } from 'react';
import { Facility } from '../../facility/types/facility';
import { useBackofficeFacilityService } from './useBackofficeFacilityService';

interface UseFacilityDetailResult {
  facility?: Facility;
  isLoading: boolean;
  error?: string;
  notFound: boolean;
}

/**
 * useFacilityDetail Hook
 * 
 * Responsible for fetching and providing a single facility's administrative details
 * Following Single Responsibility Principle by focusing only on admin facility data fetching
 * Following Dependency Inversion Principle by depending on abstractions
 */
export function useFacilityDetail(facilityId?: string): UseFacilityDetailResult {
  const [facility, setFacility] = useState<Facility | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [notFound, setNotFound] = useState<boolean>(false);
  
  // Get the backoffice facility service via our provider hook
  const { backofficeService } = useBackofficeFacilityService();

  useEffect(() => {
    // Reset state when facilityId changes
    setFacility(undefined);
    setIsLoading(true);
    setError(undefined);
    setNotFound(false);
    
    // Don't fetch if no ID is provided
    if (!facilityId) {
      setIsLoading(false);
      return;
    }

    const fetchFacility = async () => {
      try {
        const result = await backofficeService.getFacilityDetails(facilityId);
        
        if (result.success) {
          setFacility(result.data);
        } else {
          // Check if this is a not found error
          const errorMessage = result.error?.message || 'Unknown error';
          if (errorMessage.toLowerCase().includes('not found')) {
            setNotFound(true);
          } else {
            setError(errorMessage);
          }
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error fetching facility for admin:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacility();
  }, [facilityId, backofficeService]);

  return { facility, isLoading, error, notFound };
}
