import { BaseRepository } from '../BaseRepository';
import { Facility, FacilityFilters } from '@/types/facility';
import { LocalizedFacility } from '@/types/localization';
import { Zone } from '@/types/zone';
import { localizedMockFacilities } from '@/data/localizedMockFacilities';
import { mockZones, getZonesByFacilityId } from '@/data/mockZones';
import { getLocalizedFacility } from '@/utils/localizationHelper';
import { Language } from '@/i18n/types';

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
  openingHours: string;
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

export class LocalizedFacilityRepository extends BaseRepository<Facility, FacilityFilters, FacilityCreateRequest, FacilityUpdateRequest> {
  private localizedData: LocalizedFacility[];
  private zones: Zone[] = [];
  private currentLanguage: Language = 'NO';

  constructor() {
    super([]);
    this.localizedData = [...localizedMockFacilities];
    this.zones = [...mockZones];
    this.updateLocalizedData();
  }

  setLanguage(language: Language) {
    this.currentLanguage = language;
    this.updateLocalizedData();
  }

  private updateLocalizedData() {
    this.data = this.localizedData.map(facility => 
      getLocalizedFacility(facility, this.currentLanguage)
    );
  }

  protected getId(facility: Facility): string {
    return facility.id.toString();
  }

  protected applyFilters(facilities: Facility[], filters: FacilityFilters): Facility[] {
    return facilities.filter(facility => {
      // Search term filter
      if (filters.searchTerm && filters.searchTerm.trim() !== "") {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          facility.name.toLowerCase().includes(searchLower) ||
          facility.description.toLowerCase().includes(searchLower) ||
          facility.type.toLowerCase().includes(searchLower) ||
          facility.area.toLowerCase().includes(searchLower) ||
          facility.suitableFor.some(activity => 
            activity.toLowerCase().includes(searchLower)
          );
        
        if (!matchesSearch) return false;
      }

      // Facility type filter
      if (filters.facilityType && filters.facilityType !== "all") {
        const typeMatch = facility.type.toLowerCase().includes(
          filters.facilityType.toLowerCase().replace("-", " ")
        );
        if (!typeMatch) return false;
      }

      // Location filter
      if (filters.location && filters.location !== "all") {
        const locationMatch = facility.area.toLowerCase().includes(
          filters.location.toLowerCase().replace("-", " ")
        );
        if (!locationMatch) return false;
      }

      // Other filters remain the same
      if (filters.accessibility && filters.accessibility !== "all") {
        const accessibilityMatch = facility.accessibility.includes(filters.accessibility);
        if (!accessibilityMatch) return false;
      }

      if (filters.capacity && Array.isArray(filters.capacity) && filters.capacity[0] > 0) {
        const [minCapacity, maxCapacity] = filters.capacity;
        if (facility.capacity < minCapacity || facility.capacity > maxCapacity) {
          return false;
        }
      }

      if (filters.priceRange) {
        const facilityPrice = facility.pricePerHour || 0;
        if (facilityPrice < filters.priceRange.min || facilityPrice > filters.priceRange.max) {
          return false;
        }
      }

      if (filters.availableNow) {
        if (!facility.availableTimes || facility.availableTimes.length === 0) {
          return false;
        }
      }

      if (filters.amenities && filters.amenities.length > 0) {
        const facilityAmenities = [
          ...(facility.amenities || []),
          ...(facility.equipment || [])
        ].map(amenity => amenity.toLowerCase());

        const hasRequiredAmenities = filters.amenities.every(requiredAmenity => {
          switch (requiredAmenity) {
            case 'av-equipment':
              return facilityAmenities.some(amenity => 
                amenity.includes('projektor') || 
                amenity.includes('lyd') || 
                amenity.includes('mikrofon') ||
                amenity.includes('av')
              );
            case 'parking':
              return facilityAmenities.some(amenity => amenity.includes('parkering'));
            case 'wifi':
              return facilityAmenities.some(amenity => 
                amenity.includes('wifi') || amenity.includes('internett')
              );
            case 'photography':
              return facilityAmenities.some(amenity => 
                amenity.includes('foto') || amenity.includes('kamera')
              );
            default:
              return facilityAmenities.includes(requiredAmenity.toLowerCase());
          }
        });

        if (!hasRequiredAmenities) return false;
      }

      return true;
    });
  }

  protected createEntity(request: FacilityCreateRequest): Facility {
    const newId = parseInt(this.generateId());
    
    return {
      id: newId,
      name: request.name,
      address: request.address,
      type: request.type,
      image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
      nextAvailable: "I dag, 18:00",
      capacity: request.capacity,
      accessibility: request.accessibility,
      area: request.area,
      suitableFor: request.suitableFor,
      equipment: request.equipment,
      openingHours: request.openingHours,
      description: request.description,
      rating: 4.0,
      reviewCount: 0,
      pricePerHour: 500,
      amenities: request.equipment,
      hasAutoApproval: false
    };
  }

  protected updateEntity(existing: Facility, request: FacilityUpdateRequest): Facility {
    return {
      ...existing,
      ...request
    };
  }

  // Zone-specific methods
  async getZonesByFacilityId(facilityId: string) {
    try {
      const zones = getZonesByFacilityId(facilityId);
      return { success: true, data: zones };
    } catch (error) {
      return { success: false, error: { message: 'Failed to fetch zones', details: error } };
    }
  }

  async getZoneById(zoneId: string) {
    try {
      const zone = this.zones.find(z => z.id === zoneId);
      if (!zone) {
        return { success: false, error: { message: 'Zone not found', code: 'NOT_FOUND' } };
      }
      return { success: true, data: zone };
    } catch (error) {
      return { success: false, error: { message: 'Failed to fetch zone', details: error } };
    }
  }

  async getMainZones() {
    try {
      const mainZones = this.zones.filter(zone => zone.isMainZone);
      return { success: true, data: mainZones };
    } catch (error) {
      return { success: false, error: { message: 'Failed to fetch main zones', details: error } };
    }
  }

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
