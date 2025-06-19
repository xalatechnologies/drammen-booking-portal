
import { LocalizedAdditionalService } from '@/types/localization';

export const localizedMockAdditionalServices: LocalizedAdditionalService[] = [
  {
    id: 'service-1',
    name: {
      NO: 'Ekstra rengjøring',
      EN: 'Extra cleaning'
    },
    category: 'cleaning',
    description: {
      NO: 'Grundig rengjøring etter arrangement',
      EN: 'Thorough cleaning after event'
    },
    shortDescription: {
      NO: 'Profesjonell rengjøring',
      EN: 'Professional cleaning'
    },
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
      instructions: {
        NO: 'Rengjøring utføres etter arrangement. Kontakt oss for spesielle behov.',
        EN: 'Cleaning is performed after the event. Contact us for special requirements.'
      },
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
    name: {
      NO: 'Basketballer (sett)',
      EN: 'Basketballs (set)'
    },
    category: 'equipment',
    description: {
      NO: 'Profesjonelle basketballer for trening og kamp',
      EN: 'Professional basketballs for training and games'
    },
    shortDescription: {
      NO: 'Basketballer for utlån',
      EN: 'Basketballs for rental'
    },
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
      instructions: {
        NO: 'Baller må returneres rengjort',
        EN: 'Balls must be returned clean'
      }
    },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];
