import { Language } from '../types';

export const facilityTranslations = {
  NO: {
    types: {
      'Idrettsanlegg': 'Idrettsanlegg',
      'Kulturlokale': 'Kulturlokale',
      'Møterom': 'Møterom',
      'Auditorium': 'Auditorium'
    },
    actions: {
      viewDetails: 'Se detaljer for {name} på {address}',
      addToFavorites: 'Legg til i favoritter',
      removeFromFavorites: 'Fjern fra favoritter',
      shareFacility: 'Del lokale'
    },
    image: {
      alt: 'Bilde av {name}',
      gallery: 'Bildegalleri',
      viewAll: 'Se alle bilder'
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
      amenities: "Fasiliteter",
      bookNow: "Reserver nå",
      zones: "Soner"
    },
    
    booking: {
      wholeVenue: "Hele lokalet",
      partialBooking: "Delvis booking",
      selectZone: "Velg sone",
      wholeVenueDescription: "Book hele anlegget for maksimal fleksibilitet",
      mainZoneInstructions: "Hovedsonen inkluderer alle fasiliteter og utstyr",
      reserveNow: "Reserver nå",
      checkAvailability: "Sjekk tilgjengelighet"
    },
    
    card: {
      viewDetails: "Se detaljer",
      from: "Fra",
      perHour: "per time",
      capacity: "Kapasitet",
      area: "Areal",
      autoApproval: "Automatisk godkjenning"
    }
  }
};
