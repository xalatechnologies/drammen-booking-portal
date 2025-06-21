
import { CoreFacility } from '@/types/translation';

export const transformDatabaseFacility = (facility: any): CoreFacility => {
  // Compute the address from individual fields with proper fallbacks
  const addressParts = [
    facility.address_street,
    facility.address_city,
    facility.address_postal_code
  ].filter(part => part && part.trim() !== '' && part !== 'undefined' && part !== 'null');
  
  const computedAddress = addressParts.length > 0 
    ? addressParts.join(', ') 
    : 'Address not available';

  // Determine image URL - prioritize featured image, then first image, then fallback
  let imageUrl = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop';
  
  if (facility.featuredImage?.image_url) {
    imageUrl = facility.featuredImage.image_url;
  } else if (facility.images && facility.images.length > 0) {
    imageUrl = facility.images[0].image_url;
  } else if (facility.image_url) {
    imageUrl = facility.image_url;
  }

  console.log('transformDatabaseFacility - Transforming facility:', {
    id: facility.id,
    name: facility.name,
    address_street: facility.address_street,
    address_city: facility.address_city,
    address_postal_code: facility.address_postal_code,
    computedAddress,
    featuredImage: facility.featuredImage,
    imageUrl
  });

  return {
    id: facility.id,
    address_street: facility.address_street || '',
    address_city: facility.address_city || '',
    address_postal_code: facility.address_postal_code || '',
    address_country: facility.address_country || 'Norway',
    type: facility.type || '',
    area: facility.area || '',
    status: facility.status || 'active',
    image_url: facility.image_url,
    capacity: facility.capacity || 0,
    next_available: facility.next_available,
    rating: facility.rating,
    review_count: facility.review_count,
    price_per_hour: facility.price_per_hour || 0,
    has_auto_approval: facility.has_auto_approval || false,
    time_slot_duration: facility.time_slot_duration || 1,
    latitude: facility.latitude,
    longitude: facility.longitude,
    accessibility_features: facility.accessibility_features,
    allowed_booking_types: facility.allowed_booking_types || ['engangs'],
    season_from: facility.season_from,
    season_to: facility.season_to,
    contact_name: facility.contact_name,
    contact_email: facility.contact_email,
    contact_phone: facility.contact_phone,
    booking_lead_time_hours: facility.booking_lead_time_hours || 2,
    max_advance_booking_days: facility.max_advance_booking_days || 365,
    cancellation_deadline_hours: facility.cancellation_deadline_hours || 24,
    is_featured: facility.is_featured || false,
    created_at: facility.created_at,
    updated_at: facility.updated_at,
    area_sqm: facility.area_sqm,
    
    // Computed fields
    address: computedAddress,
    image: imageUrl,
    pricePerHour: facility.price_per_hour || 0,
    accessibility: facility.accessibility_features || [],
    suitableFor: [],
    hasAutoApproval: facility.has_auto_approval || false,
    nextAvailable: facility.next_available || 'Available now',
    openingHours: [],
    zones: [],
    availableTimes: []
  };
};
