
import { useMemo, useCallback } from 'react';
import { format } from 'date-fns';

interface AvailabilityStatus {
  status: 'available' | 'busy' | 'unavailable';
  conflict?: {
    type: string;
    details: string;
  } | null;
}

interface AvailabilityCacheEntry {
  status: AvailabilityStatus;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export function useAvailabilityCache() {
  const cache = useMemo(() => new Map<string, AvailabilityCacheEntry>(), []);

  const getCacheKey = useCallback((zoneId: string, date: Date, timeSlot: string) => {
    return `${zoneId}-${format(date, 'yyyy-MM-dd')}-${timeSlot}`;
  }, []);

  const getAvailabilityStatus = useCallback((
    zoneId: string, 
    date: Date, 
    timeSlot: string,
    fallbackFn: (zoneId: string, date: Date, timeSlot: string) => AvailabilityStatus
  ): AvailabilityStatus => {
    const key = getCacheKey(zoneId, date, timeSlot);
    const cached = cache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return cached.status;
    }

    const status = fallbackFn(zoneId, date, timeSlot);
    cache.set(key, { status, timestamp: now });
    
    return status;
  }, [cache, getCacheKey]);

  const clearCache = useCallback(() => {
    cache.clear();
  }, [cache]);

  const invalidateSlot = useCallback((zoneId: string, date: Date, timeSlot: string) => {
    const key = getCacheKey(zoneId, date, timeSlot);
    cache.delete(key);
  }, [cache, getCacheKey]);

  return {
    getAvailabilityStatus,
    clearCache,
    invalidateSlot
  };
}
