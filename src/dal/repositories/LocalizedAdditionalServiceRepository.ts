
import { GenericSupabaseRepository } from '../GenericSupabaseRepository';
import { AdditionalService, ServiceFilters } from '@/types/additionalServices';
import { RepositoryResponse, PaginationParams, PaginatedResponse } from '@/types/api';

export class LocalizedAdditionalServiceRepository extends GenericSupabaseRepository<AdditionalService, any> {
  protected tableName = 'additional_services';
  private currentLanguage: 'NO' | 'EN' = 'NO';
  private servicesData: Record<string, AdditionalService[]> = {
    'NO': [],
    'EN': []
  };

  protected mapFromDatabase(dbRecord: any): AdditionalService {
    // This would be implemented when we have actual localized data
    return dbRecord as AdditionalService;
  }

  protected mapToDatabase(frontendRecord: Partial<AdditionalService>): any {
    return frontendRecord;
  }

  setLanguage(language: 'NO' | 'EN') {
    this.currentLanguage = language;
  }

  protected applyFilters(items: AdditionalService[], filters: any): AdditionalService[] {
    if (!filters) return items;
    
    return items.filter(item => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.isActive !== undefined && item.isActive !== filters.isActive) return false;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return item.name.toLowerCase().includes(searchLower) ||
               item.description.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }

  async findAllWithPagination(
    pagination: PaginationParams,
    searchTerm?: string,
    filters?: ServiceFilters
  ): Promise<RepositoryResponse<PaginatedResponse<AdditionalService>>> {
    try {
      const services = this.servicesData[this.currentLanguage] || [];
      const filteredServices = this.applyFilters(services, { ...filters, searchTerm });
      
      const total = filteredServices.length;
      const totalPages = Math.ceil(total / pagination.limit);
      const start = (pagination.page - 1) * pagination.limit;
      const paginatedServices = filteredServices.slice(start, start + pagination.limit);

      return {
        data: {
          data: paginatedServices,
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
        error: "Failed to fetch services"
      };
    }
  }

  // Override findAll to match the base class signature
  async findAll(
    pagination?: PaginationParams,
    filters?: Record<string, any>
  ): Promise<RepositoryResponse<AdditionalService[]>> {
    try {
      const services = this.servicesData[this.currentLanguage] || [];
      return {
        data: services,
        error: null
      };
    } catch (error) {
      return {
        data: [],
        error: "Failed to fetch services"
      };
    }
  }

  async findById(id: string): Promise<RepositoryResponse<AdditionalService | null>> {
    try {
      const services = this.servicesData[this.currentLanguage] || [];
      const service = services.find(s => s.id === id);
      
      return {
        data: service || null,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: "Failed to fetch service"
      };
    }
  }

  async create(data: Partial<AdditionalService>): Promise<RepositoryResponse<AdditionalService | null>> {
    try {
      const service = data as AdditionalService;
      return {
        data: service,
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: "Failed to create service"
      };
    }
  }

  async update(id: string, data: Partial<AdditionalService>): Promise<RepositoryResponse<AdditionalService | null>> {
    try {
      const existing = await this.findById(id);
      if (!existing.data) {
        return {
          data: null,
          error: "Service not found"
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
        error: "Failed to update service"
      };
    }
  }

  async delete(id: string): Promise<RepositoryResponse<boolean>> {
    try {
      const existing = await this.findById(id);
      if (!existing.data) {
        return {
          data: false,
          error: "Service not found"
        };
      }
      
      return {
        data: true,
        error: null
      };
    } catch (error) {
      return {
        data: false,
        error: "Failed to delete service"
      };
    }
  }

  async getServicesByCategory(category: string): Promise<AdditionalService[]> {
    const services = this.servicesData[this.currentLanguage] || [];
    return services.filter(service => service.category === category);
  }

  async getAllServices(): Promise<AdditionalService[]> {
    return this.servicesData[this.currentLanguage] || [];
  }
}

// Export singleton instance
export const localizedAdditionalServiceRepository = new LocalizedAdditionalServiceRepository();
