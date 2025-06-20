
import { BaseRepository } from '../BaseRepository';
import { Facility, FacilityFilters, OpeningHours } from '@/types/facility';
import { localizedMockFacilities } from '@/data/localizedMockFacilities';
import { getLocalizedFacility } from '@/utils/localizationHelper';
import { FacilityFilterService } from './services/FacilityFilterService';
import { FacilityConverterService } from './services/FacilityConverterService';

interface FacilityCreateRequest {
  name: string;
  address: string;
  type: string;
  area: string;
  description: string;
  capacity: number;
  accessibility: string[];
  suitableFor: string[];
  equipment: string[];
  openingHours: OpeningHours[];
  image: string;
}

interface FacilityUpdateRequest extends Partial<FacilityCreateRequest> {
  nextAvailable?: string;
  rating?: number;
  reviewCount?: number;
  pricePerHour?: number;
  amenities?: string[];
  hasAutoApproval?: boolean;
}

export class FacilityRepository extends BaseRepository<Facility, FacilityFilters, FacilityCreateRequest, FacilityUpdateRequest> {
  constructor() {
    const convertedFacilities = localizedMockFacilities.map(FacilityConverterService.convertLocalizedFacility);
    
    // Add timeSlotDuration to some facilities for testing
    convertedFacilities.forEach((facility, index) => {
      // Set some facilities to use 2-hour slots for variety
      if (index % 3 === 0) {
        facility.timeSlotDuration = 2;
      } else {
        facility.timeSlotDuration = 1;
      }
    });

    console.log("FacilityRepository - Total facilities loaded:", convertedFacilities.length);
    console.log("FacilityRepository - Sample facility data for search debugging:", 
      convertedFacilities.slice(0, 3).map(f => ({ 
        id: f.id, 
        name: f.name, 
        type: f.type, 
        area: f.area, 
        description: f.description.substring(0, 50) + "...",
        suitableFor: f.suitableFor
      }))
    );
    
    super(convertedFacilities);
  }

  protected getId(facility: Facility): string {
    return facility.id.toString();
  }

  protected applyFilters(facilities: Facility[], filters: FacilityFilters): Facility[] {
    return FacilityFilterService.applyFilters(facilities, filters);
  }

  protected createEntity(request: FacilityCreateRequest): Facility {
    return FacilityConverterService.createFacilityFromRequest(request, this.generateId());
  }

  protected updateEntity(existing: Facility, request: FacilityUpdateRequest): Facility {
    return FacilityConverterService.updateFacilityFromRequest(existing, request);
  }

  // Enhanced facility methods
  async getFacilitiesByType(type: string) {
    try {
      const facilities = this.data.filter(f => f.type.toLowerCase().includes(type.toLowerCase()));
      return { success: true, data: facilities };
    } catch (error) {
      return { success: false, error: { message: 'Failed to fetch facilities by type', details: error } };
    }
  }

  async getFacilitiesByArea(area: string) {
    try {
      const facilities = this.data.filter(f => f.area.toLowerCase().includes(area.toLowerCase()));
      return { success: true, data: facilities };
    } catch (error) {
      return { success: false, error: { message: 'Failed to fetch facilities by area', details: error } };
    }
  }
}

// Export singleton instance
export const facilityRepository = new FacilityRepository();
