import { Facility } from '@/types/facility';
import { getLocalizedFacility } from '@/utils/localizationHelper';
import { OpeningHours } from '@/types/facility';

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

export class FacilityConverterService {
  // Convert localized facility to proper Facility type
  static convertLocalizedFacility(localizedFacility: any): Facility {
    // Use Norwegian as default for the regular facility repository
    return getLocalizedFacility(localizedFacility, 'NO');
  }

  static createFacilityFromRequest(request: FacilityCreateRequest, id: string): Facility {
    const newId = parseInt(id);
    
    // Properly cast dayOfWeek values to the required union type
    const openingHours = request.openingHours.map(hour => ({
      dayOfWeek: hour.dayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6,
      opens: hour.opens,
      closes: hour.closes
    }));
    
    return {
      id: newId,
      name: request.name,
      address: request.address,
      type: request.type,
      status: 'active' as const,
      image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
      nextAvailable: "I dag, 18:00",
      capacity: request.capacity,
      accessibility: request.accessibility,
      area: request.area,
      suitableFor: request.suitableFor,
      equipment: request.equipment,
      openingHours: openingHours,
      description: request.description,
      rating: 4.0,
      reviewCount: 0,
      pricePerHour: 500,
      amenities: request.equipment,
      hasAutoApproval: false,
      timeSlotDuration: 1,
      season: {
        from: "2024-01-01",
        to: "2024-12-31"
      },
      allowedBookingTypes: ['engangslån', 'fastlån', 'rammetid', 'strøtimer'],
      zones: []
    };
  }

  static updateFacilityFromRequest(existing: Facility, request: FacilityUpdateRequest): Facility {
    // Start with the existing facility and apply updates
    const updatedFacility: Facility = {
      ...existing,
      ...request
    };

    // If openingHours is being updated, ensure they're properly typed
    if (request.openingHours) {
      updatedFacility.openingHours = request.openingHours;
    }

    return updatedFacility;
  }
}
