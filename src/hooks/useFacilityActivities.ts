
import { useState, useEffect } from 'react';

// Simple hook for facility activities without service dependency
export function useFacilityActivities(facilityId: number) {
  const [activities, setActivities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simple mock activities - replace with actual logic if needed
    setActivities(['Fotball', 'Basketball', 'Volleyball', 'Tennis']);
  }, [facilityId]);

  return {
    activities,
    isLoading,
    error: null
  };
}
