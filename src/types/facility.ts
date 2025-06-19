export interface Zone {
  id: string;
  name: string;
  facilityId: string;
  type: 'court' | 'room' | 'area' | 'section';
  capacity: number;
  description?: string;
  bookableIndependently: boolean;
  conflictRules: ConflictRule[];
  equipment?: string[];
  dimensions?: {
    width: number;
    length: number;
    height?: number;
  };
  status: 'active' | 'maintenance' | 'inactive';
}

export interface ConflictRule {
  id: string;
  zoneId: string;
  conflictingZoneId: string;
  type: 'mutually_exclusive' | 'partial_overlap' | 'noise_conflict';
  description: string;
}

export interface Facility {
  id: string;
  name: string;
  address: string;
  type: string;
  status: 'active' | 'maintenance' | 'inactive';
  capacity: number;
  description: string;
  image: string;
  area: string;
  accessibility: string[];
  suitableFor: string[];
  equipment: string[];
  openingHours: OpeningHours[];
  bookingInterval: '15' | '30' | 'daily';
  season: {
    from: string;
    to: string;
  };
  allowedBookingTypes: ('engangslån' | 'fastlån' | 'rammetid' | 'strøtimer')[];
  zones: Zone[];
}

export interface OpeningHours {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
  opens: string; // HH:mm format
  closes: string; // HH:mm format
} 