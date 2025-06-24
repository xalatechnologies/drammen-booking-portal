
import { Zone } from '@/types/facility';

export interface DatabaseZone {
  id: string;
  name: any; // JSONB field
  location_id: string;
  facility_id?: string;
  type: string;
  capacity: number;
  description?: string;
  is_main_zone: boolean;
  parent_zone_id?: string;
  bookable_independently: boolean;
  area_sqm?: number;
  floor?: string;
  coordinates_x?: number;
  coordinates_y?: number;
  coordinates_width?: number;
  coordinates_height?: number;
  equipment?: string[];
  accessibility_features?: string[];
  status: string;
  created_at: string;
  updated_at: string;
  code: string;
  interval?: string;
  metadata?: any;
}

const getLocalizedText = (value: any, fallback: string = 'Unknown'): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value !== null) {
    return value.no || value.en || value.nb || fallback;
  }
  return fallback;
};

export function convertDatabaseZoneToZone(dbZone: DatabaseZone): Zone {
  return {
    id: dbZone.id,
    facilityId: dbZone.location_id || dbZone.facility_id || '',
    name: getLocalizedText(dbZone.name, 'Unknown Zone'),
    description: dbZone.description || '',
    isMainZone: dbZone.is_main_zone || false,
    parentZoneId: dbZone.parent_zone_id || undefined,
    capacity: dbZone.capacity || 1,
    area: dbZone.area_sqm || 100,
    floor: dbZone.floor || undefined,
    coordinates: dbZone.coordinates_x !== null && dbZone.coordinates_y !== null ? {
      x: dbZone.coordinates_x || 0,
      y: dbZone.coordinates_y || 0,
      width: dbZone.coordinates_width || 100,
      height: dbZone.coordinates_height || 100
    } : undefined,
    equipment: dbZone.equipment || [],
    features: dbZone.equipment || [],
    accessibility: dbZone.accessibility_features || [],
    pricing: {
      basePrice: 250,
      currency: 'NOK',
      priceRules: [],
      minimumBookingDuration: 60,
      maximumBookingDuration: 480,
      cancellationPolicy: {
        freeUntilHours: 24,
        partialRefundUntilHours: 12,
        partialRefundPercentage: 50,
        noRefundAfterHours: 2
      }
    },
    availability: {
      openingHours: [],
      blackoutPeriods: [],
      maintenanceSchedule: [],
      recurringUnavailability: []
    },
    restrictions: {
      requiresSupervision: false,
      allowedActivities: [],
      prohibitedActivities: [],
      requiresTraining: false,
      alcoholPermitted: false,
      smokingPermitted: false,
      petsAllowed: false,
      cateringAllowed: true,
      decorationsAllowed: true,
      amplifiedSoundAllowed: true,
      commercialUseAllowed: true
    },
    isActive: dbZone.status === 'active',
    createdAt: new Date(dbZone.created_at),
    updatedAt: new Date(dbZone.updated_at),
    
    // Database fields that need mapping
    bookableIndependently: dbZone.bookable_independently,
    coordinatesX: dbZone.coordinates_x || undefined,
    coordinatesY: dbZone.coordinates_y || undefined,
    coordinatesWidth: dbZone.coordinates_width || undefined,
    coordinatesHeight: dbZone.coordinates_height || undefined,
    accessibilityFeatures: dbZone.accessibility_features || [],
    status: dbZone.status
  };
}
