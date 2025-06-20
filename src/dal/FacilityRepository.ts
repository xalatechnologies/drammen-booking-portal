import { BaseRepository } from './BaseRepository';
import { Facility, FacilityFilters } from '@/types/facility';
import { Zone } from '@/types/zone';
import { localizedMockFacilities } from '@/data/localizedMockFacilities';
import { getLocalizedFacility } from '@/utils/localizationHelper';
import { mockZones, getZonesByFacilityId } from '@/data/mockZones';

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

// Convert localized facility to proper Facility type
const convertLocalizedFacility = (localizedFacility: any): Facility => {
  // Use Norwegian as default for the regular facility repository
  return getLocalizedFacility(localizedFacility, 'NO');
};

export class FacilityRepository extends BaseRepository<Facility, FacilityFilters, FacilityCreateRequest, FacilityUpdateRequest> {
  private zones: Zone[] = [];

  constructor() {
    const convertedFacilities = localizedMockFacilities.map(convertLocalizedFacility);
    
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
    this.zones = [...mockZones];
  }

  protected getId(facility: Facility): string {
    return facility.id.toString();
  }

  protected applyFilters(facilities: Facility[], filters: FacilityFilters): Facility[] {
    console.log("FacilityRepository.applyFilters - Input facilities:", facilities.length);
    console.log("FacilityRepository.applyFilters - Filters:", filters);
    
    const filteredFacilities = facilities.filter(facility => {
      // Search term filter
      if (filters.searchTerm && filters.searchTerm.trim() !== "") {
        const searchLower = filters.searchTerm.toLowerCase().trim();
        console.log(`FacilityRepository.applyFilters - Searching for: "${searchLower}"`);
        
        // More comprehensive search
        const facilityData = {
          name: facility.name.toLowerCase(),
          description: facility.description.toLowerCase(),
          type: facility.type.toLowerCase(),
          area: facility.area.toLowerCase(),
          suitableFor: facility.suitableFor.map(s => s.toLowerCase()),
          equipment: facility.equipment.map(e => e.toLowerCase()),
          amenities: (facility.amenities || []).map(a => a.toLowerCase())
        };
        
        console.log(`FacilityRepository.applyFilters - Facility "${facility.name}" data:`, facilityData);
        
        const matchesName = facilityData.name.includes(searchLower);
        const matchesDescription = facilityData.description.includes(searchLower);
        const matchesType = facilityData.type.includes(searchLower);
        const matchesArea = facilityData.area.includes(searchLower);
        const matchesActivity = facilityData.suitableFor.some(activity => activity.includes(searchLower));
        const matchesEquipment = facilityData.equipment.some(equipment => equipment.includes(searchLower));
        const matchesAmenities = facilityData.amenities.some(amenity => amenity.includes(searchLower));
        
        const matchesSearch = matchesName || matchesDescription || matchesType || matchesArea || matchesActivity || matchesEquipment || matchesAmenities;
        
        console.log(`FacilityRepository.applyFilters - Facility "${facility.name}" matches:`, {
          searchTerm: searchLower,
          matchesName,
          matchesDescription,
          matchesType,
          matchesArea,
          matchesActivity,
          matchesEquipment,
          matchesAmenities,
          overall: matchesSearch
        });
        
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

      // Accessibility filter
      if (filters.accessibility && filters.accessibility !== "all") {
        const accessibilityMatch = facility.accessibility.includes(filters.accessibility);
        if (!accessibilityMatch) return false;
      }

      // Capacity filter
      if (filters.capacity && Array.isArray(filters.capacity) && filters.capacity[0] > 0) {
        const [minCapacity, maxCapacity] = filters.capacity;
        if (facility.capacity < minCapacity || facility.capacity > maxCapacity) {
          return false;
        }
      }

      // Price range filter
      if (filters.priceRange) {
        const facilityPrice = facility.pricePerHour || 0;
        if (facilityPrice < filters.priceRange.min || facilityPrice > filters.priceRange.max) {
          return false;
        }
      }

      // Available now filter (simplified check)
      if (filters.availableNow) {
        // For now, we'll check if the facility has availableTimes
        // In a real implementation, this would check current time availability
        if (!facility.availableTimes || facility.availableTimes.length === 0) {
          return false;
        }
      }

      // Amenities filter
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

    console.log("FacilityRepository.applyFilters - Output facilities:", filteredFacilities.length);
    console.log("FacilityRepository.applyFilters - Output facility names:", filteredFacilities.map(f => f.name));
    return filteredFacilities;
  }

  protected createEntity(request: FacilityCreateRequest): Facility {
    const now = this.getCurrentTimestamp();
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
      hasAutoApproval: false,
      timeSlotDuration: 1
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
