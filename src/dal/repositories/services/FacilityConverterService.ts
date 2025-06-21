
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
  next_available?: string;
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
      address_street: request.address.split(',')[0] || request.address,
      address_city: request.address.split(',')[1]?.trim() || 'Drammen',
      address_postal_code: '3000',
      address_country: 'Norway',
      type: request.type,
      status: 'active' as const,
      image_url: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
      next_available: "I dag, 18:00",
      capacity: request.capacity,
      accessibility_features: request.accessibility,
      area: request.area,
      amenities: request.equipment,
      equipment: request.equipment,
      openingHours: openingHours,
      description: request.description,
      rating: 4.0,
      review_count: 0,
      price_per_hour: 500,
      has_auto_approval: false,
      time_slot_duration: 1,
      season_from: "2024-01-01",
      season_to: "2024-12-31",
      allowed_booking_types: ['engangs', 'fastlan', 'rammetid', 'strotimer'],
      zones: [],
      latitude: null,
      longitude: null,
      contact_name: null,
      contact_email: null,
      contact_phone: null,
      booking_lead_time_hours: 2,
      max_advance_booking_days: 365,
      cancellation_deadline_hours: 24,
      is_featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      area_sqm: null,
      // Legacy compatibility fields
      address: request.address,
      image: "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
      nextAvailable: "I dag, 18:00",
      pricePerHour: 500,
      accessibility: request.accessibility,
      suitableFor: request.equipment,
      hasAutoApproval: false,
      timeSlotDuration: 1,
      season: {
        from: "2024-01-01",
        to: "2024-12-31"
      }
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
