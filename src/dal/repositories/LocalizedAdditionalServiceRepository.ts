import { BaseRepository } from '@/dal/BaseRepository';
import { Language } from '@/i18n/types';
import { AdditionalService, ServiceFilters } from '@/types/additionalServices';
import { RepositoryResponse, PaginationParams, PaginatedResponse } from '@/types/api';

export class LocalizedAdditionalServiceRepository extends BaseRepository<AdditionalService> {
  private currentLanguage: Language = 'NO';
  private servicesData: Record<string, AdditionalService[]> = {
    'NO': [],
    'EN': []
  };

  setLanguage(language: Language) {
    this.currentLanguage = language;
  }

  protected getId(item: AdditionalService): string {
    return item.id;
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

  protected createEntity(data: Partial<AdditionalService>): AdditionalService {
    return {
      id: data.id || this.generateId(),
      name: data.name || '',
      category: data.category || 'equipment',
      description: data.description || '',
      facilityIds: data.facilityIds || [],
      pricing: data.pricing || {
        basePrice: 0,
        currency: 'NOK',
        pricingType: 'flat',
        actorTypeMultipliers: {
          'private-person': 1,
          'lag-foreninger': 1,
          'paraply': 1,
          'private-firma': 1,
          'kommunale-enheter': 1
        }
      },
      availability: data.availability || {
        isAlwaysAvailable: true,
        leadTimeHours: 0,
        maxAdvanceBookingDays: 365,
        blackoutPeriods: []
      },
      requirements: data.requirements || {
        requiresMainBooking: false,
        equipmentProvided: [],
        equipmentRequired: []
      },
      metadata: data.metadata || { tags: [] },
      isActive: data.isActive ?? true,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date()
    };
  }

  protected updateEntity(existing: AdditionalService, updates: Partial<AdditionalService>): AdditionalService {
    return { 
      ...existing, 
      ...updates, 
      updatedAt: new Date() 
    };
  }

  // Override base findAll to match expected signature for services
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

  // Keep base repository findAll for compatibility
  async findAll(
    pagination?: PaginationParams,
    orderBy?: string,
    orderDirection?: "asc" | "desc"
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

  async create(data: Partial<AdditionalService>): Promise<RepositoryResponse<AdditionalService>> {
    try {
      const service = this.createEntity(data);
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

  async update(id: string, data: Partial<AdditionalService>): Promise<RepositoryResponse<AdditionalService>> {
    try {
      const existing = await this.findById(id);
      if (!existing.data) {
        return {
          data: null,
          error: "Service not found"
        };
      }
      
      const updated = this.updateEntity(existing.data, data);
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
