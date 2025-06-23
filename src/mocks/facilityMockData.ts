
import { Facility, OpeningHours } from '@/types/facility';

// Constants for generating realistic data
const WEEKDAYS = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];

// Facility types in Norwegian
const FACILITY_TYPES = [
  'Gymsal', 'Aktivitetshall', 'Auditorium', 'Møterom', 'Svømmehall',
  'Fotballhall', 'Kultursal', 'Kantine', 'Klasserom', 'Festsal'
];

// Norwegian locations in Drammen
const LOCATIONS = [
  'Bragernes', 'Strømsø', 'Konnerud', 'Åssiden', 'Gulskogen',
  'Fjell', 'Skoger', 'Tangen', 'Brandengen', 'Marienlyst'
];

// Generate realistic opening hours
const generateOpeningHours = (facilityId: number): OpeningHours[] => {
  return WEEKDAYS.map((day, index) => ({
    id: `${facilityId}-${index}`,
    facility_id: facilityId,
    day_of_week: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    dayOfWeek: index as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    opens: index < 5 ? "08:00" : "10:00", // Weekdays vs weekend
    closes: index < 5 ? "22:00" : "18:00", // Weekdays vs weekend
    is_closed: index === 6, // Closed on Sundays for some facilities
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z"
  })) as OpeningHours[];
};

// Local images from public/bilder directory
const LOCAL_IMAGES = [
  'Ankerskogen_svoemmehall1.jpg',
  'Bergsjöns_kulturhus_sett_från_Bergsjöns_centrum.jpg',
  'Elverum_svømmehall.jpg',
  'Escuela_Aspøy,_Ålesund,_Noruega,_2019-09-01,_DD_79.jpg',
  'GoldenStateBuilding1949-Auditorium.jpg',
  'Hamar_kulturhus_I.jpg',
  'Internetstiftelsens_kontor_Hammarby_kaj.png',
  'Kulthaus Saale Weißenfels © Stadt Weißenfels (4).jpg',
  'Mollebakken-skole.jpg',
  'Nesøya_skole_og_idrettshall_Asker.jpg',
  'Orgue_Auditorium_de_Lyon_11.jpg',
  'Rheinauhafen_-_Kontor_19_(1834-36).jpg',
  'Støperiet_kulturhus_Back_to_school_Saltholmen_industrihall_Kaldnes_Mek._Verksted_Tønsberg_Norway_2019-08-25_4990.jpg',
  'TD-Akersbakken12-web-08.jpg',
  'TVS-sommerbilde.jpg',
  'askollen-bss.jpg',
  'free-photo-of-kontor-design-rom-stoler.jpeg',
  'harmonien-utvendig-oversikt.webp',
  'standard_compressed_29499777186_556d450e6b_5k.jpg',
  'standard_compressed_3284521721_5490aa874e_o.jpg',
  'standard_compressed_Bryggen__Bergen3.jpg',
  'standard_compressed_Helsingborgs_konserthus_1000px.jpg',
  'standard_compressed_Ishavskatedralen_002.jpg',
  'standard_compressed_Kulturhuset_1200px.jpg',
  'standard_compressed_LRM_EXPORT_65437731474925_20181116_022118644.jpeg',
  'standard_compressed_Portalbygget.jpg',
  'standard_compressed_drammensbadet_71.jpg',
  'sy2215ff_0.jpg'
];

// Map facility types to appropriate image categories for more realistic matching
const FACILITY_TYPE_IMAGE_MAP: Record<string, string[]> = {
  'Gymsal': ['Mollebakken-skole.jpg', 'Nesøya_skole_og_idrettshall_Asker.jpg', 'askollen-bss.jpg', 'TVS-sommerbilde.jpg'],
  'Aktivitetshall': ['Nesøya_skole_og_idrettshall_Asker.jpg', 'standard_compressed_Portalbygget.jpg', 'standard_compressed_29499777186_556d450e6b_5k.jpg'],
  'Auditorium': ['GoldenStateBuilding1949-Auditorium.jpg', 'Orgue_Auditorium_de_Lyon_11.jpg', 'standard_compressed_Kulturhuset_1200px.jpg'],
  'Møterom': ['Internetstiftelsens_kontor_Hammarby_kaj.png', 'free-photo-of-kontor-design-rom-stoler.jpeg', 'Rheinauhafen_-_Kontor_19_(1834-36).jpg'],
  'Svømmehall': ['Ankerskogen_svoemmehall1.jpg', 'Elverum_svømmehall.jpg', 'standard_compressed_drammensbadet_71.jpg'],
  'Fotballhall': ['standard_compressed_3284521721_5490aa874e_o.jpg', 'standard_compressed_Portalbygget.jpg'],
  'Kultursal': ['Bergsjöns_kulturhus_sett_från_Bergsjöns_centrum.jpg', 'Hamar_kulturhus_I.jpg', 'Støperiet_kulturhus_Back_to_school_Saltholmen_industrihall_Kaldnes_Mek._Verksted_Tønsberg_Norway_2019-08-25_4990.jpg'],
  'Kantine': ['free-photo-of-kontor-design-rom-stoler.jpeg', 'standard_compressed_LRM_EXPORT_65437731474925_20181116_022118644.jpeg'],
  'Klasserom': ['Escuela_Aspøy,_Ålesund,_Noruega,_2019-09-01,_DD_79.jpg', 'Mollebakken-skole.jpg', 'askollen-bss.jpg'],
  'Festsal': ['standard_compressed_Helsingborgs_konserthus_1000px.jpg', 'Hamar_kulturhus_I.jpg', 'harmonien-utvendig-oversikt.webp']
};

// Generate realistic images using local files
const generateImages = (facilityId: number, type: string) => {
  const imageCount = Math.floor(Math.random() * 2) + 2; // 2-3 images per facility
  const images = [];
  
  // Get type-specific images if available, otherwise use random images
  const typeSpecificImages = FACILITY_TYPE_IMAGE_MAP[type] || [];
  const availableImages = typeSpecificImages.length > 0 ? typeSpecificImages : LOCAL_IMAGES;
  
  // Select random images but ensure no duplicates
  const selectedIndices = new Set<number>();
  while (selectedIndices.size < Math.min(imageCount, availableImages.length)) {
    selectedIndices.add(Math.floor(Math.random() * availableImages.length));
  }
  
  // Create image objects
  Array.from(selectedIndices).forEach((index, i) => {
    const filename = availableImages[index];
    images.push({
      id: `img-${facilityId}-${i}`,
      facility_id: facilityId,
      image_url: `/bilder/${filename}`,
      alt_text: `${type} - ${filename.split('.')[0]}`,
      caption: `Bilde ${i + 1} av ${type}`,
      display_order: i,
      is_featured: i === 0,
      file_size: Math.floor(Math.random() * 2000000) + 500000, // 500KB to 2.5MB
      uploaded_by: 'system',
      uploaded_at: "2025-01-01T00:00:00Z",
      created_at: "2025-01-01T00:00:00Z"
    });
  });
  
  return images;
};

// Generate mock facilities
export const mockFacilities: Facility[] = Array.from({ length: 20 }).map((_, index) => {
  const id = index + 1;
  const type = FACILITY_TYPES[Math.floor(Math.random() * FACILITY_TYPES.length)];
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
  const capacity = (Math.floor(Math.random() * 10) + 1) * 20; // 20-200 in steps of 20
  
  // Generate realistic Norwegian address
  const streetNumber = Math.floor(Math.random() * 50) + 1;
  const postalCode = Math.floor(Math.random() * 10) + 3030; // Drammen postal codes
  const streetAddress = `${location}veien ${streetNumber}`;
  const city = "Drammen";
  const country = "Norway";
  const address = `${streetAddress}, ${postalCode} ${city}`;
  
  // Status distribution: 70% active, 15% maintenance, 15% inactive
  const statusRandom = Math.random();
  const status = statusRandom < 0.7 ? "active" : (statusRandom < 0.85 ? "maintenance" : "inactive") as 'active' | 'maintenance' | 'inactive';
  
  // Generate random booking types
  const bookingTypes = ["engangslan", "fastlan", "rammetid", "strotimer"];
  const allowedBookingTypes = bookingTypes.filter(() => Math.random() > 0.5) as ('engangs' | 'fastlan' | 'rammetid' | 'strotimer')[];
  if (allowedBookingTypes.length === 0) allowedBookingTypes.push("engangslan" as 'engangs'); // Ensure at least one type
  
  const images = generateImages(id, type);
  const featuredImage = images.find(img => img.is_featured);
  const pricePerHour = Math.floor(Math.random() * 500) + 100; // 100-600 NOK per hour
  const accessibilityFeatures = Math.random() > 0.7 ? ["wheelchair", "hearing_loop"] : 
                             (Math.random() > 0.5 ? ["wheelchair"] : []);
  
  return {
    id,
    name: `${location} ${type}`,
    address_street: streetAddress,
    address_city: city,
    address_postal_code: postalCode.toString(),
    address_country: country,
    type,
    status,
    image_url: featuredImage?.image_url || null,
    capacity,
    area: `${Math.floor(Math.random() * 300) + 50}m²`,
    description: `En flott ${type.toLowerCase()} i ${location} området av Drammen. Passer for ulike aktiviteter og arrangementer.`,
    next_available: Math.random() > 0.3 ? "I dag, 18:00" : `${WEEKDAYS[Math.floor(Math.random() * 7)]}, ${Math.floor(Math.random() * 12) + 8}:00`,
    rating: Math.floor(Math.random() * 5) + 1,
    review_count: Math.floor(Math.random() * 50),
    price_per_hour: pricePerHour,
    has_auto_approval: Math.random() > 0.5,
    amenities: ["wifi", "parking", "heating"].filter(() => Math.random() > 0.5),
    time_slot_duration: 30,
    latitude: 59.7 + Math.random() * 0.1,
    longitude: 10.2 + Math.random() * 0.1,
    accessibility_features: accessibilityFeatures,
    equipment: ["projector", "sound_system", "chairs", "tables"].filter(() => Math.random() > 0.5),
    allowed_booking_types: allowedBookingTypes,
    season_from: "2025-01-01",
    season_to: "2025-12-31",
    contact_name: `${["Ole", "Kari", "Per", "Anne"][Math.floor(Math.random() * 4)]} ${["Hansen", "Olsen", "Jensen", "Larsen"][Math.floor(Math.random() * 4)]}`,
    contact_email: `kontakt@${location.toLowerCase()}.no`,
    contact_phone: `+47 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 900) + 100}`,
    booking_lead_time_hours: Math.floor(Math.random() * 24) + 1,
    max_advance_booking_days: Math.floor(Math.random() * 90) + 30,
    cancellation_deadline_hours: Math.floor(Math.random() * 48) + 24,
    is_featured: Math.random() > 0.8,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    area_sqm: Math.floor(Math.random() * 300) + 50,
    
    // Computed/derived fields for backwards compatibility
    address,
    image: featuredImage?.image_url || "",
    pricePerHour,
    accessibility: accessibilityFeatures,
    suitableFor: ["sports", "meetings", "events"].filter(() => Math.random() > 0.5),
    hasAutoApproval: Math.random() > 0.5,
    nextAvailable: Math.random() > 0.3 ? "I dag, 18:00" : `${WEEKDAYS[Math.floor(Math.random() * 7)]}, ${Math.floor(Math.random() * 12) + 8}:00`,
    openingHours: generateOpeningHours(id),
    zones: [],
    featuredImage: featuredImage,
    images: images,
    timeSlotDuration: Math.random() > 0.5 ? 1 : 2,
    availableTimes: [],
    season: {
      from: "2025-01-01",
      to: "2025-12-31"
    }
  } as Facility;
});

// Export a function to get filtered facilities based on criteria
export const getFilteredMockFacilities = (filters?: Partial<{
  searchTerm: string;
  facilityType: string;
  location: string;
  capacity: number[];
  accessibility: string;
  priceRange: number[];
  availableNow: boolean;
  hasEquipment: boolean;
  hasParking: boolean;
  hasWifi: boolean;
  allowsPhotography: boolean;
}>) => {
  if (!filters) return mockFacilities;
  
  return mockFacilities.filter(facility => {
    // Search term filter
    if (filters.searchTerm && !facility.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) && 
        !facility.description?.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Facility type filter
    if (filters.facilityType && filters.facilityType !== 'all' && facility.type !== filters.facilityType) {
      return false;
    }
    
    // Location filter
    if (filters.location && filters.location !== 'all' && 
        !facility.address.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    
    // Capacity filter
    if (filters.capacity && (facility.capacity < filters.capacity[0] || facility.capacity > filters.capacity[1])) {
      return false;
    }
    
    // Accessibility filter
    if (filters.accessibility && filters.accessibility !== 'all') {
      if (!facility.accessibility_features?.includes(filters.accessibility)) {
        return false;
      }
    }
    
    // Price range filter
    if (filters.priceRange && 
        (facility.price_per_hour < filters.priceRange[0] || facility.price_per_hour > filters.priceRange[1])) {
      return false;
    }
    
    // Boolean filters
    if (filters.hasEquipment && !facility.equipment?.length) return false;
    if (filters.hasParking && !facility.amenities?.includes('parking')) return false;
    if (filters.hasWifi && !facility.amenities?.includes('wifi')) return false;
    if (filters.allowsPhotography && Math.random() > 0.5) return false; // Random for photography permission
    
    // Available now filter would require more complex logic with current time
    // For mock data, we'll just filter randomly
    if (filters.availableNow && Math.random() > 0.7) return false;
    
    return true;
  });
};
