
import { AdditionalService, ServiceCategory } from '@/types/additionalServices';

export const mockAdditionalServices: AdditionalService[] = [
  // Cleaning Services
  {
    id: 'cleaning-standard',
    name: 'Standard rengjøring',
    category: 'cleaning',
    description: 'Grunnleggende rengjøring etter arrangementet',
    shortDescription: 'Basis rengjøring',
    facilityIds: ['1', '2', '3'],
    pricing: {
      basePrice: 800,
      currency: 'NOK',
      pricingType: 'flat',
      actorTypeMultipliers: {
        'lag-foreninger': 0.5,
        'paraply': 0.3,
        'private-firma': 1.2,
        'kommunale-enheter': 0.0,
        'private-person': 1.0
      }
    },
    availability: {
      isAlwaysAvailable: true,
      leadTimeHours: 4,
      maxAdvanceBookingDays: 30,
      blackoutPeriods: []
    },
    requirements: {
      requiresMainBooking: true,
      equipmentProvided: ['Rengjøringsutstyr', 'Desinfeksjonsmidler'],
      equipmentRequired: [],
      minimumBookingDuration: 60
    },
    metadata: {
      setupTimeMinutes: 0,
      cleanupTimeMinutes: 60,
      tags: ['rengjøring', 'standard', 'etterpå']
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'cleaning-deep',
    name: 'Dyprengjøring',
    category: 'cleaning',
    description: 'Grundig rengjøring inkludert gulvvask og desinfeksjon',
    shortDescription: 'Dyprengjøring',
    facilityIds: ['1', '2', '3'],
    pricing: {
      basePrice: 1500,
      currency: 'NOK',
      pricingType: 'flat',
      actorTypeMultipliers: {
        'lag-foreninger': 0.6,
        'paraply': 0.4,
        'private-firma': 1.2,
        'kommunale-enheter': 0.0,
        'private-person': 1.0
      }
    },
    availability: {
      isAlwaysAvailable: false,
      availableTimeSlots: [
        { dayOfWeek: 1, startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: 2, startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: 3, startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: 4, startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: 5, startTime: '08:00', endTime: '16:00' }
      ],
      leadTimeHours: 24,
      maxAdvanceBookingDays: 60,
      blackoutPeriods: []
    },
    requirements: {
      requiresMainBooking: true,
      equipmentProvided: ['Profesjonelt rengjøringsutstyr', 'Desinfeksjonsmidler', 'Gulvvaskutstyr'],
      equipmentRequired: [],
      minimumBookingDuration: 120
    },
    metadata: {
      setupTimeMinutes: 15,
      cleanupTimeMinutes: 90,
      tags: ['rengjøring', 'dyp', 'profesjonell']
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // Parking Services
  {
    id: 'parking-reserved',
    name: 'Reserverte parkeringsplasser',
    category: 'parking',
    description: 'Garanterte parkeringsplasser nær inngangen',
    shortDescription: 'Reservert parkering',
    facilityIds: ['1', '2', '3'],
    pricing: {
      basePrice: 50,
      currency: 'NOK',
      pricingType: 'hourly',
      minimumCharge: 100,
      actorTypeMultipliers: {
        'lag-foreninger': 0.5,
        'paraply': 0.3,
        'private-firma': 1.0,
        'kommunale-enheter': 0.0,
        'private-person': 1.0
      }
    },
    availability: {
      isAlwaysAvailable: true,
      leadTimeHours: 2,
      maxAdvanceBookingDays: 90,
      blackoutPeriods: [],
      capacity: 10
    },
    requirements: {
      requiresMainBooking: true,
      equipmentProvided: ['Parkeringsskilt', 'Sperrebånd'],
      equipmentRequired: [],
      maximumAttendees: 10
    },
    metadata: {
      setupTimeMinutes: 30,
      cleanupTimeMinutes: 15,
      tags: ['parkering', 'reservert', 'nær']
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // Personnel Services
  {
    id: 'personnel-security',
    name: 'Sikkerhetspersonell',
    category: 'personnel',
    description: 'Profesjonelt sikkerhetspersonell for arrangementet',
    shortDescription: 'Sikkerhetsvakt',
    facilityIds: ['1', '2', '3'],
    pricing: {
      basePrice: 650,
      currency: 'NOK',
      pricingType: 'hourly',
      minimumCharge: 1300,
      actorTypeMultipliers: {
        'lag-foreninger': 0.7,
        'paraply': 0.5,
        'private-firma': 1.2,
        'kommunale-enheter': 1.0,
        'private-person': 1.0
      }
    },
    availability: {
      isAlwaysAvailable: false,
      leadTimeHours: 48,
      maxAdvanceBookingDays: 180,
      blackoutPeriods: []
    },
    requirements: {
      requiresMainBooking: true,
      minimumAttendees: 50,
      equipmentProvided: ['Kommunikasjonsutstyr', 'Refleksvest'],
      equipmentRequired: [],
      minimumBookingDuration: 120
    },
    metadata: {
      provider: 'Drammen Sikkerhet AS',
      contactPhone: '+47 12 34 56 78',
      contactEmail: 'booking@drammensikkerhet.no',
      setupTimeMinutes: 30,
      tags: ['sikkerhet', 'personell', 'profesjonell']
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'personnel-technician',
    name: 'Teknisk personell',
    category: 'personnel',
    description: 'Tekniker for lyd, lys og AV-utstyr',
    shortDescription: 'Teknisk support',
    facilityIds: ['1', '2', '3'],
    pricing: {
      basePrice: 750,
      currency: 'NOK',
      pricingType: 'hourly',
      minimumCharge: 1500,
      actorTypeMultipliers: {
        'lag-foreninger': 0.6,
        'paraply': 0.4,
        'private-firma': 1.1,
        'kommunale-enheter': 1.0,
        'private-person': 1.0
      }
    },
    availability: {
      isAlwaysAvailable: false,
      availableTimeSlots: [
        { dayOfWeek: 1, startTime: '09:00', endTime: '21:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '21:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '21:00' },
        { dayOfWeek: 4, startTime: '09:00', endTime: '21:00' },
        { dayOfWeek: 5, startTime: '09:00', endTime: '22:00' },
        { dayOfWeek: 6, startTime: '10:00', endTime: '22:00' }
      ],
      leadTimeHours: 24,
      maxAdvanceBookingDays: 120,
      blackoutPeriods: []
    },
    requirements: {
      requiresMainBooking: true,
      equipmentProvided: ['Verktøykasse', 'Testinstrumenter'],
      equipmentRequired: [],
      minimumBookingDuration: 120
    },
    metadata: {
      setupTimeMinutes: 45,
      cleanupTimeMinutes: 30,
      tags: ['teknisk', 'AV', 'support']
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // Equipment Services
  {
    id: 'equipment-av-basic',
    name: 'Grunnleggende AV-utstyr',
    category: 'equipment',
    description: 'Mikrofon, høyttalere og projektor',
    shortDescription: 'Basis AV-utstyr',
    facilityIds: ['1', '2', '3'],
    pricing: {
      basePrice: 500,
      currency: 'NOK',
      pricingType: 'daily',
      actorTypeMultipliers: {
        'lag-foreninger': 0.4,
        'paraply': 0.2,
        'private-firma': 1.0,
        'kommunale-enheter': 0.0,
        'private-person': 0.8
      }
    },
    availability: {
      isAlwaysAvailable: true,
      leadTimeHours: 4,
      maxAdvanceBookingDays: 90,
      blackoutPeriods: []
    },
    requirements: {
      requiresMainBooking: true,
      equipmentProvided: ['Trådløs mikrofon', 'Høyttalere', 'Projektor', 'Kabler'],
      equipmentRequired: [],
      minimumBookingDuration: 60
    },
    metadata: {
      setupTimeMinutes: 30,
      cleanupTimeMinutes: 20,
      tags: ['AV', 'mikrofon', 'projektor']
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'equipment-sports-basic',
    name: 'Grunnleggende sportsutstyr',
    category: 'equipment',
    description: 'Baller, matter og grunnleggende treningsutstyr',
    shortDescription: 'Basis sportsutstyr',
    facilityIds: ['1', '2', '3'],
    pricing: {
      basePrice: 200,
      currency: 'NOK',
      pricingType: 'daily',
      actorTypeMultipliers: {
        'lag-foreninger': 0.3,
        'paraply': 0.2,
        'private-firma': 1.0,
        'kommunale-enheter': 0.0,
        'private-person': 0.8
      }
    },
    availability: {
      isAlwaysAvailable: true,
      leadTimeHours: 2,
      maxAdvanceBookingDays: 60,
      blackoutPeriods: []
    },
    requirements: {
      requiresMainBooking: true,
      equipmentProvided: ['Fotballer', 'Håndballmål', 'Treningskegler', 'Yogamatter'],
      equipmentRequired: [],
      minimumBookingDuration: 60
    },
    metadata: {
      setupTimeMinutes: 15,
      cleanupTimeMinutes: 15,
      tags: ['sport', 'trening', 'utstyr']
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // Catering Services
  {
    id: 'catering-coffee',
    name: 'Kaffeservering',
    category: 'catering',
    description: 'Kaffe, te og enkle bakevarer',
    shortDescription: 'Kaffe og kaker',
    facilityIds: ['1', '2', '3'],
    pricing: {
      basePrice: 75,
      currency: 'NOK',
      pricingType: 'per-person',
      minimumCharge: 750,
      actorTypeMultipliers: {
        'lag-foreninger': 0.8,
        'paraply': 0.6,
        'private-firma': 1.0,
        'kommunale-enheter': 1.0,
        'private-person': 1.0
      }
    },
    availability: {
      isAlwaysAvailable: false,
      availableTimeSlots: [
        { dayOfWeek: 1, startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: 2, startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: 3, startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: 4, startTime: '08:00', endTime: '16:00' },
        { dayOfWeek: 5, startTime: '08:00', endTime: '16:00' }
      ],
      leadTimeHours: 24,
      maxAdvanceBookingDays: 30,
      blackoutPeriods: []
    },
    requirements: {
      requiresMainBooking: true,
      minimumAttendees: 10,
      maximumAttendees: 100,
      equipmentProvided: ['Kaffemaskin', 'Kopper', 'Tallerkener', 'Servise'],
      equipmentRequired: [],
      minimumBookingDuration: 60
    },
    metadata: {
      provider: 'Drammen Catering',
      contactPhone: '+47 98 76 54 32',
      contactEmail: 'bestilling@drammencatering.no',
      setupTimeMinutes: 45,
      cleanupTimeMinutes: 30,
      tags: ['kaffe', 'servering', 'møte']
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'catering-lunch',
    name: 'Lunsjservering',
    category: 'catering',
    description: 'Komplett lunsjmeny med varme og kalde retter',
    shortDescription: 'Lunsjbuffet',
    facilityIds: ['1', '2', '3'],
    pricing: {
      basePrice: 250,
      currency: 'NOK',
      pricingType: 'per-person',
      minimumCharge: 2500,
      actorTypeMultipliers: {
        'lag-foreninger': 0.8,
        'paraply': 0.6,
        'private-firma': 1.0,
        'kommunale-enheter': 1.0,
        'private-person': 1.0
      }
    },
    availability: {
      isAlwaysAvailable: false,
      availableTimeSlots: [
        { dayOfWeek: 1, startTime: '11:00', endTime: '14:00' },
        { dayOfWeek: 2, startTime: '11:00', endTime: '14:00' },
        { dayOfWeek: 3, startTime: '11:00', endTime: '14:00' },
        { dayOfWeek: 4, startTime: '11:00', endTime: '14:00' },
        { dayOfWeek: 5, startTime: '11:00', endTime: '14:00' }
      ],
      leadTimeHours: 48,
      maxAdvanceBookingDays: 30,
      blackoutPeriods: []
    },
    requirements: {
      requiresMainBooking: true,
      minimumAttendees: 10,
      maximumAttendees: 80,
      equipmentProvided: ['Servering utstyr', 'Tallerkener', 'Bestikk', 'Varmeplater'],
      equipmentRequired: [],
      minimumBookingDuration: 180
    },
    metadata: {
      provider: 'Drammen Catering',
      contactPhone: '+47 98 76 54 32',
      contactEmail: 'bestilling@drammencatering.no',
      setupTimeMinutes: 60,
      cleanupTimeMinutes: 45,
      tags: ['lunsj', 'buffet', 'måltid']
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

export const getServicesByCategory = (category: ServiceCategory): AdditionalService[] => {
  return mockAdditionalServices.filter(service => service.category === category);
};

export const getServicesByFacility = (facilityId: string): AdditionalService[] => {
  return mockAdditionalServices.filter(service => 
    service.facilityIds.includes(facilityId) && service.isActive
  );
};

export const getServiceById = (serviceId: string): AdditionalService | undefined => {
  return mockAdditionalServices.find(service => service.id === serviceId);
};
