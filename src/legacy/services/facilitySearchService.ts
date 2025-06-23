
import { FacilityFilters } from '@/types/facility';

export interface SearchIndex {
  facilityId: number;
  searchableText: string;
  type: string;
  location: string;
  accessibility: string[];
  capacity: number;
  pricePerHour: number;
  amenities: string[];
}

class FacilitySearchService {
  private searchIndex: SearchIndex[] = [];
  private isIndexBuilt = false;

  buildSearchIndex(facilities: any[]) {
    this.searchIndex = facilities.map(facility => ({
      facilityId: facility.id,
      searchableText: [
        facility.name,
        facility.address,
        facility.description,
        facility.type,
        facility.area,
        ...(facility.equipment || []),
        ...(facility.suitableFor || []),
        ...(facility.amenities || [])
      ].join(' ').toLowerCase(),
      type: facility.type.toLowerCase(),
      location: facility.address.toLowerCase(),
      accessibility: facility.accessibility || [],
      capacity: facility.capacity || 0,
      pricePerHour: facility.pricePerHour || 0,
      amenities: facility.amenities || []
    }));
    this.isIndexBuilt = true;
  }

  searchFacilities(facilities: any[], filters: FacilityFilters): any[] {
    if (!this.isIndexBuilt) {
      this.buildSearchIndex(facilities);
    }

    let filteredIds = new Set<number>();

    // Text search
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const searchTerms = filters.searchTerm.toLowerCase().trim().split(/\s+/);
      const matchingIndices = this.searchIndex.filter(index => 
        searchTerms.every(term => index.searchableText.includes(term))
      );
      filteredIds = new Set(matchingIndices.map(index => index.facilityId));
    } else {
      filteredIds = new Set(this.searchIndex.map(index => index.facilityId));
    }

    // Apply other filters
    const filtered = this.searchIndex.filter(index => {
      if (!filteredIds.has(index.facilityId)) return false;

      if (filters.facilityType && filters.facilityType !== 'all') {
        if (!index.type.includes(filters.facilityType.toLowerCase())) return false;
      }

      if (filters.location && filters.location !== 'all') {
        if (!index.location.includes(filters.location.toLowerCase())) return false;
      }

      if (filters.accessibility && filters.accessibility !== 'all') {
        if (!index.accessibility.includes(filters.accessibility)) return false;
      }

      if (filters.capacity && filters.capacity.length === 2) {
        if (index.capacity < filters.capacity[0] || index.capacity > filters.capacity[1]) return false;
      }

      if (filters.priceRange) {
        if (index.pricePerHour < filters.priceRange.min || index.pricePerHour > filters.priceRange.max) return false;
      }

      if (filters.amenities && filters.amenities.length > 0) {
        if (!filters.amenities.some(amenity => index.amenities.includes(amenity))) return false;
      }

      return true;
    });

    const filteredFacilityIds = new Set(filtered.map(index => index.facilityId));
    return facilities.filter(facility => filteredFacilityIds.has(facility.id));
  }

  clearIndex() {
    this.searchIndex = [];
    this.isIndexBuilt = false;
  }
}

export const facilitySearchService = new FacilitySearchService();
