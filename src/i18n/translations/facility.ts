import { Language } from '../types';

export const facilityTranslations = {
  NO: {
    types: {
      'Idrettsanlegg': 'Idrettsanlegg',
      'Kulturlokale': 'Kulturlokale',
      'Møterom': 'Møterom',
      'Auditorium': 'Auditorium'
    },
    details: {
      capacity: 'Kapasitet',
      bookNow: 'Reserver nå',
      location: 'Lokasjon',
      area: 'Areal',
      openingHours: 'Åpningstider',
      zones: 'Soner'
    },
    actions: {
      viewDetails: 'Se detaljer for {name} på {address}',
      addToFavorites: 'Legg til i favoritter',
      removeFromFavorites: 'Fjern fra favoritter',
      shareFacility: 'Del lokale'
    },
    image: {
      alt: 'Bilde av {name}'
    },
    search: {
      noResults: 'Ingen resultater funnet'
    },
    tabs: {
      features: {
        title: 'Fasiliteter og utstyr',
        capacityAndSize: 'Kapasitet og størrelse',
        maxPersons: 'Maks personer',
        area: 'Areal',
        ceilingHeight: 'Takhøyde',
        openingHours: 'Åpningstider',
        weekdays: 'Hverdager',
        weekends: 'Helger',
        holidays: 'Helligdager',
        closed: 'Stengt',
        availableEquipment: 'Tilgjengelig utstyr',
        facilitiesAndServices: 'Fasiliteter og tjenester'
      },
      rules: {
        title: 'Regler og retningslinjer',
        description: 'Følgende regler gjelder for bruk av dette lokalet. Vennligst les gjennom disse før du gjennomfører din reservasjon.',
        safetyRules: {
          title: 'Sikkerhetsregler',
          indoorShoes: 'Innendørssko er påkrevd i alle idrettsanlegg',
          reportDamage: 'Rapporter eventuelle skader eller problemer umiddelbart',
          firstAid: 'Førstehjelpsutstyr er tilgjengelig ved hovedinngangen'
        },
        capacityRules: {
          title: 'Kapasitet og oppførsel',
          respectCapacity: 'Respekter maksimal kapasitet på 30 personer',
          cleanUp: 'Rydd opp etter deg og la lokalet være rent',
          musicLevel: 'Hold musikk og støynivå på et rimelig nivå'
        },
        prohibited: {
          title: 'Forbudt',
          smokingAlcohol: 'Røyking og alkohol er strengt forbudt',
          foodDrink: 'Mat og drikke kun tillatt i utpekte områder',
          pets: 'Kjæledyr er ikke tillatt med mindre det er tjenestehund'
        }
      }
    },
    booking: {
      wholeVenue: 'Hele lokalet',
      partialBooking: 'Delvis booking',
      selectZone: 'Velg sone',
      wholeVenueDescription: 'Komplett lokale med full tilgang til alt utstyr og alle soner',
      mainZoneInstructions: 'Hele lokalet inkluderer begge soner og all tilgjengelig utstyr'
    },
    amenities: {
      equipment: 'Utstyr',
      projektor: 'Projektor',
      projector: 'Projektor',
      lydanlegg: 'Lydanlegg',
      soundsystem: 'Lydanlegg',
      whiteboard: 'Whiteboard',
      kjøkken: 'Kjøkken',
      kitchen: 'Kjøkken',
      parkering: 'Parkering',
      parking: 'Parkering',
      wifi: 'WiFi',
      klimaanlegg: 'Klimaanlegg',
      airconditioning: 'Klimaanlegg',
      rullestolvennlig: 'Rullestolvennlig',
      wheelchairaccessible: 'Rullestolvennlig'
    },
    
    // Enhanced booking and cart translations
    cart: {
      title: "Handlekurv",
      empty: "Handlekurven er tom",
      selectSlots: "Velg tidspunkter fra kalenderen for å legge til reservasjoner",
      subtotal: "Sum",
      vat: "MVA (25%)",
      total: "Totalt",
      proceedToCheckout: "Gå til betaling",
      items: "elementer"
    },
    
    cancellation: {
      title: "Gratis avbestilling",
      policy: "Opptil 24 timer før reservert tid"
    },
    
    customerType: "Kundetype",
    customerTypes: {
      private: "Privatperson",
      business: "Bedrift",
      organization: "Organisasjon"
    },
    
    name: "Navn",
    address: "Adresse", 
    capacity: "Kapasitet",
    area: "Areal",
    openingHours: "Åpningstider",
    description: "Beskrivelse",
    equipment: "Utstyr",
    amenities: "Fasiliteter",
    location: "Lokasjon",
    quickFacts: "Viktige fakta",
    suitableFor: "Egnet for",
    autoApproval: "Automatisk godkjenning",
    
    details: {
      location: "Lokasjon",
      capacity: "Kapasitet", 
      area: "Areal",
      openingHours: "Åpningstider",
      equipment: "Utstyr",
      amenities: "Fasiliteter"
    },
    
    booking: {
      wholeVenue: "Hele lokalet",
      wholeVenueDescription: "Book hele anlegget for maksimal fleksibilitet",
      mainZoneInstructions: "Hovedsonen inkluderer alle fasiliteter og utstyr",
      reserveNow: "Reserver nå",
      checkAvailability: "Sjekk tilgjengelighet"
    },
    
    image: {
      alt: "Bilde av {name}",
      gallery: "Bildegalleri",
      viewAll: "Se alle bilder"
    },
    
    card: {
      viewDetails: "Se detaljer",
      from: "Fra",
      perHour: "per time",
      capacity: "Kapasitet",
      area: "Areal",
      autoApproval: "Automatisk godkjenning"
    }
  },
  
  EN: {
    types: {
      'Idrettsanlegg': 'Sports Facility',
      'Kulturlokale': 'Cultural Venue',
      'Møterom': 'Meeting Room',
      'Auditorium': 'Auditorium'
    },
    details: {
      capacity: 'Capacity',
      bookNow: 'Book now',
      location: 'Location',
      area: 'Area',
      openingHours: 'Opening hours',
      zones: 'Zones'
    },
    actions: {
      viewDetails: 'View details for {name} at {address}',
      addToFavorites: 'Add to favorites',
      removeFromFavorites: 'Remove from favorites',
      shareFacility: 'Share facility'
    },
    image: {
      alt: 'Image of {name}'
    },
    search: {
      noResults: 'No results found'
    },
    tabs: {
      features: {
        title: 'Features and equipment',
        capacityAndSize: 'Capacity and size',
        maxPersons: 'Max persons',
        area: 'Area',
        ceilingHeight: 'Ceiling height',
        openingHours: 'Opening hours',
        weekdays: 'Weekdays',
        weekends: 'Weekends',
        holidays: 'Holidays',
        closed: 'Closed',
        availableEquipment: 'Available equipment',
        facilitiesAndServices: 'Facilities and services'
      },
      rules: {
        title: 'Rules and guidelines',
        description: 'The following rules apply to the use of this facility. Please read through these before completing your reservation.',
        safetyRules: {
          title: 'Safety rules',
          indoorShoes: 'Indoor shoes are required in all sports facilities',
          reportDamage: 'Report any damage or problems immediately',
          firstAid: 'First aid equipment is available at the main entrance'
        },
        capacityRules: {
          title: 'Capacity and behavior',
          respectCapacity: 'Respect maximum capacity of 30 people',
          cleanUp: 'Clean up after yourself and leave the facility clean',
          musicLevel: 'Keep music and noise levels at a reasonable level'
        },
        prohibited: {
          title: 'Prohibited',
          smokingAlcohol: 'Smoking and alcohol are strictly prohibited',
          foodDrink: 'Food and drinks only allowed in designated areas',
          pets: 'Pets are not allowed unless it is a service dog'
        }
      }
    },
    booking: {
      wholeVenue: 'Whole venue',
      partialBooking: 'Partial booking',
      selectZone: 'Select zone',
      wholeVenueDescription: 'Complete facility with full access to all equipment and zones',
      mainZoneInstructions: 'The whole venue includes both zones and all available equipment'
    },
    amenities: {
      equipment: 'Equipment',
      projektor: 'Projector',
      projector: 'Projector',
      lydanlegg: 'Sound System',
      soundsystem: 'Sound System',
      whiteboard: 'Whiteboard',
      kjøkken: 'Kitchen',
      kitchen: 'Kitchen',
      parkering: 'Parking',
      parking: 'Parking',
      wifi: 'WiFi',
      klimaanlegg: 'Air Conditioning',
      airconditioning: 'Air Conditioning',
      rullestolvennlig: 'Wheelchair Accessible',
      wheelchairaccessible: 'Wheelchair Accessible'
    },
    
    // Enhanced booking and cart translations  
    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty", 
      selectSlots: "Select time slots from the calendar to add reservations",
      subtotal: "Subtotal",
      vat: "VAT (25%)",
      total: "Total",
      proceedToCheckout: "Proceed to Checkout", 
      items: "items"
    },
    
    cancellation: {
      title: "Free cancellation",
      policy: "Up to 24 hours before reserved time"
    },
    
    customerType: "Customer Type",
    customerTypes: {
      private: "Private Person", 
      business: "Business",
      organization: "Organization"
    },
    
    name: "Name",
    address: "Address",
    capacity: "Capacity", 
    area: "Area",
    openingHours: "Opening Hours",
    description: "Description",
    equipment: "Equipment",
    amenities: "Amenities", 
    location: "Location",
    quickFacts: "Quick Facts",
    suitableFor: "Suitable For",
    autoApproval: "Auto Approval",
    
    details: {
      location: "Location",
      capacity: "Capacity",
      area: "Area", 
      openingHours: "Opening Hours",
      equipment: "Equipment",
      amenities: "Amenities"
    },
    
    booking: {
      wholeVenue: "Whole Venue",
      wholeVenueDescription: "Book the entire facility for maximum flexibility", 
      mainZoneInstructions: "Main zone includes all facilities and equipment",
      reserveNow: "Reserve Now",
      checkAvailability: "Check Availability"
    },
    
    image: {
      alt: "Image of {name}",
      gallery: "Image Gallery", 
      viewAll: "View All Images"
    },
    
    card: {
      viewDetails: "View Details",
      from: "From",
      perHour: "per hour",
      capacity: "Capacity",
      area: "Area", 
      autoApproval: "Auto Approval"
    }
  }
};
