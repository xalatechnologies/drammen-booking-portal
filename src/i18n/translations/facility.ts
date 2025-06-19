
import { Language } from '../types';

export const facilityTranslations: Record<Language, any> = {
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
    }
  }
};
