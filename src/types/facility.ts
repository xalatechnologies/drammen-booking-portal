
export interface Facility {
  id: number;
  name: string;
  address: string;
  type: string;
  image: string;
  nextAvailable: string;
  capacity: number;
  accessibility: string[];
  area: string;
  suitableFor: string[];
  equipment: string[];
  openingHours: string;
  description: string;
  rating?: number;
  reviewCount?: number;
  pricePerHour?: number;
  amenities?: string[];
  hasAutoApproval?: boolean;
  availableTimes?: {
    date: Date;
    slots: {
      start: string;
      end: string;
      available: boolean;
    }[];
  }[];
}

export interface FacilityFilters {
  searchTerm?: string;
  facilityType?: string;
  location?: string;
  accessibility?: string;
  capacity?: number[];
  date?: Date;
}

export interface FacilitySortOptions {
  field: 'name' | 'capacity' | 'pricePerHour' | 'rating';
  direction: 'asc' | 'desc';
}
