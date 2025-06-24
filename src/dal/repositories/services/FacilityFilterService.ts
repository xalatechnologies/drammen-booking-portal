
import { Facility, FacilityFilters } from '@/types/facility';

export class FacilityFilterService {
  static applyFilters(facilities: Facility[], filters: FacilityFilters): Facility[] {
    console.log("FacilityFilterService.applyFilters - Input facilities:", facilities.length);
    console.log("FacilityFilterService.applyFilters - Filters:", filters);
    
    const filteredFacilities = facilities.filter(facility => {
      // Search term filter
      if (filters.searchTerm && filters.searchTerm.trim() !== "") {
        const searchLower = filters.searchTerm.toLowerCase().trim();
        console.log(`FacilityFilterService.applyFilters - Searching for: "${searchLower}"`);
        
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
        
        console.log(`FacilityFilterService.applyFilters - Facility "${facility.name}" data:`, facilityData);
        
        const matchesName = facilityData.name.includes(searchLower);
        const matchesDescription = facilityData.description.includes(searchLower);
        const matchesType = facilityData.type.includes(searchLower);
        const matchesArea = facilityData.area.includes(searchLower);
        const matchesActivity = facilityData.suitableFor.some(activity => activity.includes(searchLower));
        const matchesEquipment = facilityData.equipment.some(equipment => equipment.includes(searchLower));
        const matchesAmenities = facilityData.amenities.some(amenity => amenity.includes(searchLower));
        
        const matchesSearch = matchesName || matchesDescription || matchesType || matchesArea || matchesActivity || matchesEquipment || matchesAmenities;
        
        console.log(`FacilityFilterService.applyFilters - Facility "${facility.name}" matches:`, {
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

    console.log("FacilityFilterService.applyFilters - Output facilities:", filteredFacilities.length);
    console.log("FacilityFilterService.applyFilters - Output facility names:", filteredFacilities.map(f => f.name));
    return filteredFacilities;
  }
}
