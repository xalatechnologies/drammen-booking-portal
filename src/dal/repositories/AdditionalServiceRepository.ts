
import { BaseRepository } from '../BaseRepository';
import { AdditionalService, ServiceFilters } from '@/types/additionalServices';
import { mockAdditionalServices } from '@/data/additionalServices/mockServiceData';

interface AdditionalServiceCreateRequest extends Omit<AdditionalService, 'id' | 'createdAt' | 'updatedAt'> {}
interface AdditionalServiceUpdateRequest extends Partial<AdditionalServiceCreateRequest> {}

export class AdditionalServiceRepository extends BaseRepository<
  AdditionalService,
  ServiceFilters,
  AdditionalServiceCreateRequest,
  AdditionalServiceUpdateRequest
> {
  constructor() {
    super(mockAdditionalServices);
  }

  protected getId(service: AdditionalService): string {
    return service.id;
  }

  protected applyFilters(services: AdditionalService[], filters: ServiceFilters): AdditionalService[] {
    return services.filter(service => {
      if (filters.category && service.category !== filters.category) return false;
      if (filters.facilityId && !service.facilityIds.includes(filters.facilityId)) return false;
      if (filters.zoneId && service.zoneIds && !service.zoneIds.includes(filters.zoneId)) return false;
      if (filters.isActive !== undefined && service.isActive !== filters.isActive) return false;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const nameMatch = service.name.toLowerCase().includes(searchLower);
        const descMatch = service.description.toLowerCase().includes(searchLower);
        const tagMatch = service.metadata.tags.some(tag => tag.toLowerCase().includes(searchLower));
        if (!nameMatch && !descMatch && !tagMatch) return false;
      }
      if (filters.priceRange) {
        const price = service.pricing.basePrice;
        if (price < filters.priceRange.min || price > filters.priceRange.max) return false;
      }
      return true;
    });
  }

  protected createEntity(request: AdditionalServiceCreateRequest): AdditionalService {
    const newId = `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      ...request,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  protected updateEntity(existing: AdditionalService, request: AdditionalServiceUpdateRequest): AdditionalService {
    return {
      ...existing,
      ...request,
      updatedAt: new Date()
    };
  }
}
