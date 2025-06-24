
import { useQuery } from '@tanstack/react-query';
import { useFacilities } from './useFacilities';

export const useCalendarView = () => {
  const { data: facilities, isLoading, error } = useFacilities();

  return {
    data: facilities || [],
    isLoading,
    error
  };
};
