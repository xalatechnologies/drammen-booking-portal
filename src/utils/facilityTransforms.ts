
// Utility functions to transform Supabase facility data to match UI expectations

export const transformFacilityForUI = (facility: any) => {
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

  const fallbackImage = fallbackImages[facility.id % fallbackImages.length];
  const imageUrl = facility.facility_images?.find((img: any) => img.is_featured)?.image_url || fallbackImage;

  return {
    ...facility,
    // Add missing required properties for UI components
    image: imageUrl,
    image_url: imageUrl,
    address: `${facility.address_street}, ${facility.address_city}`,
    nextAvailable: facility.next_available || 'Available now',
    accessibility: facility.accessibility_features || [],
    suitableFor: [],
    hasAutoApproval: facility.has_auto_approval || false,
    openingHours: facility.facility_opening_hours || [],
    availableTimes: [],
    pricePerHour: facility.price_per_hour || 450
  };
};

export const transformFacilitiesForUI = (facilities: any[]) => {
  return facilities.map(transformFacilityForUI);
};
