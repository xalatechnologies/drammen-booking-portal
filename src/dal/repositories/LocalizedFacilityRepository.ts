
import { GenericSupabaseRepository } from '../GenericSupabaseRepository';
import { LocalizedFacility } from '@/types/facility';
import { Zone } from '@/types/zone';
import { RepositoryResponse, PaginationParams, PaginatedResponse } from '@/types/api';

export class LocalizedFacilityRepository extends GenericSupabaseRepository<LocalizedFacility, any> {
  protected tableName = 'facilities';
  private currentLanguage: 'NO' | 'EN' = 'NO';
  private facilitiesData: Record<string, LocalizedFacility[]> = {
    'NO': [],
    'EN': []
  };
  private zonesData: Zone[] = [];

  protected mapFromDatabase(dbRecord: any): LocalizedFacility {
    // This would be implemented when we have actual localized data
    return dbRecord as LocalizedFacility;
  }

  protected mapToDatabase(frontendRecord: Partial<LocalizedFacility>): any {
    return frontendRecord;
  }

  setLanguage(language: 'NO' | 'EN') {
    this.currentLanguage = language;
  }

  protected applyFilters(items: LocalizedFacility[], filters: any): LocalizedFacility[] {
    if (!filters) return items;
    
    return items.filter(item => {
      if (filters.area && item.area !== filters.area) return false;
      if (filters.type && item.type !== filters.type) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return item.name.toLowerCase().includes(searchLower) ||
               item.description?.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }

  async findAllWithPagination(
    pagination: PaginationParams,
    searchTerm?: string,
    filters?: any
  ): Promise<RepositoryResponse<PaginatedResponse<LocalizedFacility>>> {
    try {
      const facilities = this.facilitiesData[this.currentLanguage] || [];
      const filteredFacilities = this.applyFilters(facilities, { ...filters, search: searchTerm });
      
      const total = filteredFacilities.length;
      const totalPages = Math.ceil(total / pagination.limit);
      const start = (pagination.page - 1) * pagination.limit;
      const paginatedFacilities = filteredFacilities.slice(start, start + pagination.limit);

      return {
        data: {
          data: paginatedFacilities,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            totalPages,
            hasNext: pagination.page < totalPages,
            hasPrev: pagination.page > 1
          }
        },
        error: null
      };
    } catch (error) {
      return {
        data: {
          data: [],
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
          }
        },
        error: "Failed to fetch facilities"
      };
    }
  }

  // Override findAll to match the base class signature
  async findAll(
    pagination?: PaginationParams,
    filters?: Record<string, any>
  ): Promise<RepositoryResponse<LocalizedFacility[]>> {
    try {
      const facilities = this.facilitiesData[this.currentLanguage] || [];
      return {
        data: facilities,
        error: null
      };
    } catch (error) {
      return {
        data: [],
        error: "Failed to fetch facilities"
      };
    }
  }

  async findById(id: string): Promise<RepositoryResponse<LocalizedFacility | null>> {
    try {
      const facilities = this.facilitiesData[this.currentLanguage] || [];
      const facility = facilities.find(f => f.id === parseInt(id));
      
      return {
        data: facility || null,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: "Failed to fetch facility"
      };
    }
  }

  async getZonesByFacilityId(facilityId: string): Promise<RepositoryResponse<Zone[]>> {
    try {
      const zones = this.zonesData.filter(z => z.facilityId === parseInt(facilityId));
      return {
        data: zones,
        error: null
      };
    } catch (error) {
      return {
        data: [],
        error: "Failed to fetch zones"
      };
    }
  }

  async getZoneById(zoneId: string): Promise<RepositoryResponse<Zone | null>> {
    try {
      const zone = this.zonesData.find(z => z.id === zoneId);
      return {
        data: zone || null,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: "Failed to fetch zone"
      };
    }
  }

  async create(data: Partial<LocalizedFacility>): Promise<RepositoryResponse<LocalizedFacility | null>> {
    try {
      const facility = data as LocalizedFacility;
      return {
        data: facility,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: "Failed to create facility"
      };
    }
  }

  async update(id: string, data: Partial<LocalizedFacility>): Promise<RepositoryResponse<LocalizedFacility | null>> {
    try {
      const existing = await this.findById(id);
      if (!existing.data) {
        return {
          data: null,
          error: "Facility not found"
        };
      }
      
      const updated = { ...existing.data, ...data };
      return {
        data: updated,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: "Failed to update facility"
      };
    }
  }

  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    try {
      const existing = await this.findById(id);
      if (!existing.data) {
        return {
          data: false,
          error: "Facility not found"
        };
      }
      
      return {
        data: true,
        error: null
      };
    } catch (error) {
      return {
        data: false,
        error: "Failed to delete facility"
      };
    }
  }

  async getFacilitiesByArea(area: string): Promise<RepositoryResponse<LocalizedFacility[]>> {
    try {
      const facilities = this.facilitiesData[this.currentLanguage] || [];
      const filteredFacilities = facilities.filter(facility => facility.area === area);
      return {
        data: filteredFacilities,
        error: null
      };
    } catch (error) {
      return {
        data: [],
        error: "Failed to fetch facilities"
      };
    }
  }

  async getFacilitiesByType(type: string): Promise<RepositoryResponse<LocalizedFacility[]>> {
    try {
      const facilities = this.facilitiesData[this.currentLanguage] || [];
      const filteredFacilities = facilities.filter(facility => facility.type === type);
      return {
        data: filteredFacilities,
        error: null
      };
    } catch (error) {
      return {
        data: [],
        error: "Failed to fetch facilities"
      };
    }
  }

  async getAllFacilities(): Promise<LocalizedFacility[]> {
    return this.facilitiesData[this.currentLanguage] || [];
  }
}

// Export singleton instance
export const localizedFacilityRepository = new LocalizedFacilityRepository();
