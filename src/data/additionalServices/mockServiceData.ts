import { AdditionalService } from '@/types/additionalServices';

export const mockAdditionalServices: AdditionalService[] = [
  {
    id: 'service-1',
    name: 'Ekstra rengjøring',
    category: 'cleaning',
    description: 'Grundig rengjøring etter arrangement',
    shortDescription: 'Profesjonell rengjøring',
    facilityIds: ['1', '2', '3'],
    pricing: {
      basePrice: 500,
      currency: 'NOK',
      pricingType: 'flat',
      actorTypeMultipliers: {
        'private-person': 1.0,
        'lag-foreninger': 0.8,
        'paraply': 0.7,
        'private-firma': 1.2,
        'kommunale-enheter': 0.6
      },
      timeBasedPricing: [
        { timeSlot: 'evening', multiplier: 1.2, dayType: 'weekday' },
        { timeSlot: 'night', multiplier: 1.5, dayType: 'weekday' }
      ]
    },
    availability: {
      isAlwaysAvailable: false,
      leadTimeHours: 24,
      maxAdvanceBookingDays: 90,
      blackoutPeriods: [],
      availableTimeSlots: [
        { dayOfWeek: 1, startTime: '08:00', endTime: '18:00' },
        { dayOfWeek: 2, startTime: '08:00', endTime: '18:00' },
        { dayOfWeek: 3, startTime: '08:00', endTime: '18:00' },
        { dayOfWeek: 4, startTime: '08:00', endTime: '18:00' },
        { dayOfWeek: 5, startTime: '08:00', endTime: '18:00' }
      ]
    },
    requirements: {
      requiresMainBooking: true,
      minimumBookingDuration: 60,
      equipmentProvided: ['Støvsuger', 'Mopp', 'Rengjøringsmidler'],
      equipmentRequired: []
    },
    metadata: {
      provider: 'Drammen Renhold AS',
      contactName: 'Kari Hansen',
      contactPhone: '+47 123 45 678',
      contactEmail: 'kari@drammenrenhold.no',
      setupTimeMinutes: 15,
      cleanupTimeMinutes: 30,
      tags: ['popular', 'essential'],
      cancellationPolicy: {
        freeUntilHours: 24,
        partialRefundPercentage: 50,
        noRefundAfterHours: 4
      }
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'service-2',
    name: 'Basketballer (sett)',
    category: 'equipment',
    description: 'Profesjonelle basketballer for trening og kamp',
    shortDescription: 'Basketballer for utlån',
    facilityIds: ['1'],
    pricing: {
      basePrice: 50,
      currency: 'NOK',
      pricingType: 'per-item',
      actorTypeMultipliers: {
        'private-person': 1.0,
        'lag-foreninger': 0.5,
        'paraply': 0.3,
        'private-firma': 1.0,
        'kommunale-enheter': 0.0
      }
    },
    availability: {
      isAlwaysAvailable: true,
      leadTimeHours: 2,
      maxAdvanceBookingDays: 30,
      blackoutPeriods: [],
      capacity: 10
    },
    requirements: {
      requiresMainBooking: true,
      equipmentProvided: ['Basketballer (5 stk)', 'Ballpumpe'],
      equipmentRequired: []
    },
    metadata: {
      tags: ['popular', 'sports'],
      instructions: 'Baller må returneres rengjort'
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'service-3',
    name: 'Kaffe og kaker',
    category: 'catering',
    description: 'Servering av kaffe og hjemmebakte kaker',
    shortDescription: 'Enkel servering',
    facilityIds: ['1', '2', '3'],
    pricing: {
      basePrice: 25,
      currency: 'NOK',
      pricingType: 'per-person',
      minimumCharge: 200,
      actorTypeMultipliers: {
        'private-person': 1.0,
        'lag-foreninger': 0.9,
        'paraply': 0.8,
        'private-firma': 1.1,
        'kommunale-enheter': 0.8
      },
      volumeDiscounts: [
        { minimumQuantity: 20, discountPercentage: 10 },
        { minimumQuantity: 50, discountPercentage: 15 }
      ]
    },
    availability: {
      isAlwaysAvailable: false,
      leadTimeHours: 48,
      maxAdvanceBookingDays: 60,
      blackoutPeriods: [],
      availableTimeSlots: [
        { dayOfWeek: 1, startTime: '10:00', endTime: '15:00' },
        { dayOfWeek: 2, startTime: '10:00', endTime: '15:00' },
        { dayOfWeek: 3, startTime: '10:00', endTime: '15:00' },
        { dayOfWeek: 4, startTime: '10:00', endTime: '15:00' },
        { dayOfWeek: 5, startTime: '10:00', endTime: '15:00' }
      ]
    },
    requirements: {
      requiresMainBooking: true,
      minimumAttendees: 5,
      maximumAttendees: 100,
      equipmentProvided: ['Kaffemaskin', 'Tallerkener', 'Kopper'],
      equipmentRequired: []
    },
    metadata: {
      provider: 'Drammen Catering',
      contactName: 'Ole Nordmann',
      contactPhone: '+47 987 65 432',
      setupTimeMinutes: 30,
      cleanupTimeMinutes: 45,
      tags: ['catering', 'popular']
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'service-4',
    name: 'Vaktmester tilstede',
    category: 'personnel',
    description: 'Vaktmester på stedet under arrangementet',
    shortDescription: 'Vaktmestertjeneste',
    facilityIds: ['1', '2', '3'],
    pricing: {
      basePrice: 350,
      currency: 'NOK',
      pricingType: 'hourly',
      minimumCharge: 700,
      actorTypeMultipliers: {
        'private-person': 1.0,
        'lag-foreninger': 0.8,
        'paraply': 0.7,
        'private-firma': 1.0,
        'kommunale-enheter': 0.5
      },
      timeBasedPricing: [
        { timeSlot: 'evening', multiplier: 1.3, dayType: 'weekday' },
        { timeSlot: 'night', multiplier: 1.5, dayType: 'weekday' },
        { timeSlot: 'day', multiplier: 1.5, dayType: 'weekend' }
      ]
    },
    availability: {
      isAlwaysAvailable: false,
      leadTimeHours: 72,
      maxAdvanceBookingDays: 90,
      blackoutPeriods: []
    },
    requirements: {
      requiresMainBooking: true,
      minimumBookingDuration: 120,
      equipmentProvided: ['Nøkler', 'Telefon', 'Førstehjelp'],
      equipmentRequired: []
    },
    metadata: {
      tags: ['personnel', 'security'],
      instructions: 'Vaktmester må bestilles minst 3 dager i forveien'
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'service-5',
    name: 'Ekstra parkeringsplasser',
    category: 'parking',
    description: 'Reserverte parkeringsplasser for arrangementet',
    shortDescription: 'Ekstra parkering',
    facilityIds: ['1', '2'],
    pricing: {
      basePrice: 100,
      currency: 'NOK',
      pricingType: 'per-item',
      actorTypeMultipliers: {
        'private-person': 1.0,
        'lag-foreninger': 0.5,
        'paraply': 0.3,
        'private-firma': 1.0,
        'kommunale-enheter': 0.0
      }
    },
    availability: {
      isAlwaysAvailable: true,
      leadTimeHours: 24,
      maxAdvanceBookingDays: 60,
      blackoutPeriods: [],
      capacity: 20
    },
    requirements: {
      requiresMainBooking: true,
      equipmentProvided: ['Parkeringsskilt', 'Sperrebånd'],
      equipmentRequired: []
    },
    metadata: {
      tags: ['parking', 'logistics'],
      instructions: 'Maks 20 ekstra plasser tilgjengelig'
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];
