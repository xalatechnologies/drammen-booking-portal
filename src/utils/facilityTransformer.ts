
import { CoreFacility } from '@/types/translation';

export const transformDatabaseFacility = (facility: any): CoreFacility => {
  return {
    id: facility.id,
    address_street: facility.address_street,
    address_city: facility.address_city,
    address_postal_code: facility.address_postal_code,
    address_country: facility.address_country,
    type: facility.type,
    area: facility.area,
    status: facility.status,
    image_url: facility.image_url,
    capacity: facility.capacity,
    next_available: facility.next_available,
    rating: facility.rating,
    review_count: facility.review_count,
    price_per_hour: facility.price_per_hour,
    has_auto_approval: facility.has_auto_approval,
    time_slot_duration: facility.time_slot_duration,
    latitude: facility.latitude,
    longitude: facility.longitude,
    accessibility_features: facility.accessibility_features,
    allowed_booking_types: facility.allowed_booking_types,
    season_from: facility.season_from,
    season_to: facility.season_to,
    contact_name: facility.contact_name,
    contact_email: facility.contact_email,
    contact_phone: facility.contact_phone,
    booking_lead_time_hours: facility.booking_lead_time_hours,
    max_advance_booking_days: facility.max_advance_booking_days,
    cancellation_deadline_hours: facility.cancellation_deadline_hours,
    is_featured: facility.is_featured,
    created_at: facility.created_at,
    updated_at: facility.updated_at,
    area_sqm: facility.area_sqm,
    openingHours: [],
    zones: [],
    availableTimes: []
  };
};
