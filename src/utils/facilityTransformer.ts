
import { Facility } from '@/types/facility';

export function transformDatabaseFacility(dbFacility: any): Facility {
  console.log('transformDatabaseFacility - Input:', dbFacility);
  
  // Handle both database format and already transformed format
  const transformed: Facility = {
    // Database fields (keep as-is)
    id: dbFacility.id,
    name: dbFacility.name,
    address_street: dbFacility.address_street,
    address_city: dbFacility.address_city,
    address_postal_code: dbFacility.address_postal_code,
    address_country: dbFacility.address_country || 'Norway',
    type: dbFacility.type,
    status: dbFacility.status || 'active',
    image_url: dbFacility.image_url,
    capacity: dbFacility.capacity || 1,
    area: dbFacility.area,
    description: dbFacility.description,
    next_available: dbFacility.next_available,
    rating: dbFacility.rating,
    review_count: dbFacility.review_count || 0,
    price_per_hour: dbFacility.price_per_hour || 450,
    has_auto_approval: dbFacility.has_auto_approval || false,
    amenities: dbFacility.amenities || [],
    time_slot_duration: dbFacility.time_slot_duration || 1,
    latitude: dbFacility.latitude,
    longitude: dbFacility.longitude,
    accessibility_features: dbFacility.accessibility_features || [],
    equipment: dbFacility.equipment || [],
    allowed_booking_types: dbFacility.allowed_booking_types || ['engangs'],
    season_from: dbFacility.season_from,
    season_to: dbFacility.season_to,
    contact_name: dbFacility.contact_name,
    contact_email: dbFacility.contact_email,
    contact_phone: dbFacility.contact_phone,
    booking_lead_time_hours: dbFacility.booking_lead_time_hours || 2,
    max_advance_booking_days: dbFacility.max_advance_booking_days || 365,
    cancellation_deadline_hours: dbFacility.cancellation_deadline_hours || 24,
    is_featured: dbFacility.is_featured || false,
    created_at: dbFacility.created_at,
    updated_at: dbFacility.updated_at,
    area_sqm: dbFacility.area_sqm,
    
    // Computed/legacy fields for backwards compatibility
    address: `${dbFacility.address_street}, ${dbFacility.address_city}`,
    image: dbFacility.image_url || "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
    pricePerHour: dbFacility.price_per_hour || 450,
    accessibility: dbFacility.accessibility_features || [],
    suitableFor: dbFacility.amenities || [],
    hasAutoApproval: dbFacility.has_auto_approval || false,
    timeSlotDuration: (dbFacility.time_slot_duration || 1) as 1 | 2,
    nextAvailable: dbFacility.next_available || "Not available",
    
    // Additional computed fields
    season: dbFacility.season_from && dbFacility.season_to ? {
      from: dbFacility.season_from,
      to: dbFacility.season_to
    } : {
      from: "2024-01-01",
      to: "2024-12-31"
    },
    
    // Initialize arrays for related data
    openingHours: [],
    zones: [],
    images: [],
    availableTimes: []
  };
  
  console.log('transformDatabaseFacility - Output:', transformed);
  return transformed;
}

export function transformFacilityForDisplay(facility: Facility): Facility {
  // Ensure all legacy fields are populated for components that expect them
  return {
    ...facility,
    address: facility.address || `${facility.address_street}, ${facility.address_city}`,
    image: facility.image || facility.image_url || "/lovable-uploads/13aee1f6-e9d9-474b-9ed7-c656d703d19b.png",
    pricePerHour: facility.pricePerHour || facility.price_per_hour,
    accessibility: facility.accessibility || facility.accessibility_features || [],
    suitableFor: facility.suitableFor || facility.amenities || [],
    hasAutoApproval: facility.hasAutoApproval ?? facility.has_auto_approval,
    timeSlotDuration: (facility.timeSlotDuration || facility.time_slot_duration || 1) as 1 | 2,
    nextAvailable: facility.nextAvailable || facility.next_available || "Not available",
  };
}
