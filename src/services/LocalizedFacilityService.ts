
import { LocalizedFacility } from '@/types/localization';
import { localizedMockFacilities } from '@/data/localizedMockFacilities';
import { Language } from '@/i18n/types';
import { FacilityFilters, FacilitySortOptions } from '@/types/facility';
import { PaginationParams, PaginatedResponse } from '@/types/api';

class LocalizedFacilityServiceClass {
  private currentLanguage: Language = 'NO';

  setLanguage(language: Language) {
    this.currentLanguage = language;
  }

  async getFacilities(
    pagination: PaginationParams,
    filters?: FacilityFilters,
    sort?: FacilitySortOptions
  ): Promise<LocalizedFacility[]> {
    let facilities = [...localizedMockFacilities];

    // Apply filters
    if (filters?.type && filters.type.length > 0) {
      facilities = facilities.filter(f => filters.type!.includes(f.type));
    }

    if (filters?.area && filters.area.length > 0) {
      facilities = facilities.filter(f => filters.area!.includes(f.area));
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      facilities = facilities.filter(f => 
        f.name[this.currentLanguage].toLowerCase().includes(searchTerm) ||
        f.description[this.currentLanguage].toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    if (sort?.sortBy) {
      facilities.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sort.sortBy) {
          case 'name':
            aValue = a.name[this.currentLanguage];
            bValue = b.name[this.currentLanguage];
            break;
          case 'price':
            aValue = a.price_per_hour;
            bValue = b.price_per_hour;
            break;
          case 'rating':
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          case 'capacity':
            aValue = a.capacity;
            bValue = b.capacity;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sort.order === 'asc' ? -1 : 1;
        if (aValue > bValue) return sort.order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedFacilities = facilities.slice(startIndex, endIndex);

    return paginatedFacilities;
  }

  async getFacilityById(id: number): Promise<LocalizedFacility | null> {
    return localizedMockFacilities.find(f => f.id === id) || null;
  }
}

export const LocalizedFacilityService = new LocalizedFacilityServiceClass();
