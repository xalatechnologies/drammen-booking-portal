
// Utility functions to transform Supabase facility data to match UI expectations

const fallbackImages = [
  '/bilder/Ankerskogen_svoemmehall1.jpg',
  '/bilder/Bergsjöns_kulturhus_sett_från_Bergsjöns_centrum.jpg',
  '/bilder/Elverum_svømmehall.jpg',
  '/bilder/Hamar_kulturhus_I.jpg',
  '/bilder/Mollebakken-skole.jpg',
  '/bilder/Nesøya_skole_og_idrettshall_Asker.jpg',
  '/bilder/standard_compressed_Kulturhuset_1200px.jpg',
  '/bilder/standard_compressed_drammensbadet_71.jpg'
];

export const transformFacilityForUI = (facility: any) => {
  const fallbackImage = fallbackImages[facility.id % fallbackImages.length];
  const imageUrl = facility.facility_images?.find((img: any) => img.is_featured)?.image_url || fallbackImage;

  // Transform opening hours to match UI expectations
  const transformedOpeningHours = facility.facility_opening_hours?.map((oh: any) => ({
    dayOfWeek: oh.day_of_week,
    opens: oh.open_time,
    closes: oh.close_time,
    isOpen: oh.is_open
  })) || [];

  return {
    ...facility,
    // Core required properties for UI components
    image: imageUrl,
    image_url: imageUrl,
    address: `${facility.address_street}, ${facility.address_city}`,
    nextAvailable: facility.next_available || 'Available now',
    accessibility: facility.accessibility_features || [],
    suitableFor: [],
    hasAutoApproval: facility.has_auto_approval || false,
    openingHours: transformedOpeningHours,
    availableTimes: [],
    pricePerHour: facility.price_per_hour || 450,
    zones: [], // Default empty zones
    timeSlotDuration: facility.time_slot_duration || 60,
    season: facility.season_from && facility.season_to ? {
      from: facility.season_from,
      to: facility.season_to
    } : undefined
  };
};

export const transformFacilitiesForUI = (facilities: any[]) => {
  return facilities.map(transformFacilityForUI);
};

export const transformZoneForUI = (zone: any) => {
  return {
    ...zone,
    facilityId: zone.facility_id?.toString() || zone.facilityId,
    isMainZone: zone.is_main_zone || false,
    parentZoneId: zone.parent_zone_id,
    area: zone.area_sqm || 0,
    coordinatesX: zone.coordinates_x,
    coordinatesY: zone.coordinates_y,
    coordinatesWidth: zone.coordinates_width,
    coordinatesHeight: zone.coordinates_height,
    accessibilityFeatures: zone.accessibility_features || [],
    bookableIndependently: zone.bookable_independently || true,
    pricePerHour: 450, // Default price
    isActive: zone.status === 'active',
    createdAt: new Date(zone.created_at),
    updatedAt: new Date(zone.updated_at),
    equipment: zone.equipment || [],
    features: zone.features || []
  };
};

export const transformZonesResponse = (zones: any[]) => {
  return zones.map(transformZoneForUI);
};
