
import { useQuery } from '@tanstack/react-query';
import { filterOptionsService } from '@/services/FilterOptionsService';

export const useFacilityTypes = () => {
  return useQuery({
    queryKey: ['facility-types'],
    queryFn: () => filterOptionsService.getFacilityTypes(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => filterOptionsService.getLocations(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
