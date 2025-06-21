
import { CoreFacility } from '@/types/translation';

export const transformDatabaseFacility = (facility: any): CoreFacility => {
  console.log('transformDatabaseFacility - Input facility:', facility);
  
  // Extract address fields directly - no more _type/value wrapper
  const street = facility.address_street;
  const city = facility.address_city; 
  const postal = facility.address_postal_code;
  
  console.log('transformDatabaseFacility - Address fields:', { street, city, postal });
  
  // Filter out null, undefined, empty strings, and string "null"/"undefined"
  const addressParts = [street, city, postal].filter(part => 
    part && 
    typeof part === 'string' && 
    part.trim() !== '' && 
    part !== 'null' && 
    part !== 'undefined' &&
    part.toLowerCase() !== 'undefined'
  );
  
  const computedAddress = addressParts.length > 0 
    ? addressParts.join(', ') 
    : '';

  // Handle image URL - prioritize featured image, then first image
  let imageUrl = '';
  
  console.log('transformDatabaseFacility - Image processing:', {
    featuredImage: facility.featuredImage,
    images: facility.images,
    image_url: facility.image_url
  });
  
  if (facility.featuredImage?.image_url) {
    imageUrl = facility.featuredImage.image_url;
    console.log('transformDatabaseFacility - Using featured image:', imageUrl);
  } else if (facility.images && Array.isArray(facility.images) && facility.images.length > 0) {
    // Look for featured image first, then use first image
    const featuredImg = facility.images.find(img => img.is_featured === true);
    if (featuredImg?.image_url) {
      imageUrl = featuredImg.image_url;
      console.log('transformDatabaseFacility - Using featured from images array:', imageUrl);
    } else if (facility.images[0]?.image_url) {
      imageUrl = facility.images[0].image_url;
      console.log('transformDatabaseFacility - Using first image from array:', imageUrl);
    }
  } else if (facility.image_url) {
    imageUrl = facility.image_url;
    console.log('transformDatabaseFacility - Using direct image_url:', imageUrl);
  }
  
  // Only fallback if no image found
  if (!imageUrl) {
    imageUrl = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&auto=format&fit=crop';
    console.log('transformDatabaseFacility - Using fallback image');
  }

  console.log('transformDatabaseFacility - Final transformation:', {
    id: facility.id,
    name: facility.name,
    computedAddress,
    imageUrl,
    addressParts
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
