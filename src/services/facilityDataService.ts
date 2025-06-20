
import { FacilityFilters } from '@/types/facility';
import { facilitySearchService } from './facilitySearchService';

interface CachedFacilityData {
  data: any[];
  pagination: any;
  timestamp: number;
  filters: string;
}

class FacilityDataService {
  private cache = new Map<string, CachedFacilityData>();
  private readonly CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

  private getCacheKey(filters: FacilityFilters, page: number, limit: number): string {
    return `${JSON.stringify(filters)}-${page}-${limit}`;
  }

  private isCacheValid(cached: CachedFacilityData): boolean {
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  async getFacilities(
    filters: FacilityFilters, 
    page: number, 
    limit: number,
    fetchFunction: () => Promise<{ facilities: any[], pagination: any }>
  ): Promise<{ facilities: any[], pagination: any }> {
    const cacheKey = this.getCacheKey(filters, page, limit);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached)) {
      console.log('FacilityDataService - Cache hit for:', cacheKey);
      return { 
        facilities: cached.data, 
        pagination: cached.pagination 
      };
    }

    console.log('FacilityDataService - Cache miss, fetching data for:', cacheKey);
    
    try {
      const result = await fetchFunction();
      
      // Cache the result
      this.cache.set(cacheKey, {
        data: result.facilities,
        pagination: result.pagination,
        timestamp: Date.now(),
        filters: JSON.stringify(filters)
      });

      // Update search index
      facilitySearchService.buildSearchIndex(result.facilities);

      return result;
    } catch (error) {
      console.error('FacilityDataService - Error fetching facilities:', error);
      throw error;
    }
  }

  searchCachedFacilities(filters: FacilityFilters): any[] | null {
    // Try to find cached data that we can search through
    const allCachedEntries = Array.from(this.cache.values())
      .filter(entry => this.isCacheValid(entry))
      .sort((a, b) => b.timestamp - a.timestamp); // Most recent first

    if (allCachedEntries.length === 0) return null;

    const latestEntry = allCachedEntries[0];
    return facilitySearchService.searchFacilities(latestEntry.data, filters);
  }

  invalidateCache() {
    console.log('FacilityDataService - Invalidating cache');
    this.cache.clear();
    facilitySearchService.clearIndex();
  }

  invalidateCacheForFilters(filters: FacilityFilters) {
    const filterString = JSON.stringify(filters);
    const keysToDelete = Array.from(this.cache.keys()).filter(key => key.includes(filterString));
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  preloadNearbyPages(filters: FacilityFilters, currentPage: number, limit: number) {
    // Preload next page in background
    const nextPage = currentPage + 1;
    const cacheKey = this.getCacheKey(filters, nextPage, limit);
    
    if (!this.cache.has(cacheKey)) {
      console.log('FacilityDataService - Preloading page:', nextPage);
      // This would trigger a background fetch - implementation depends on your API structure
    }
  }
}

export const facilityDataService = new FacilityDataService();
