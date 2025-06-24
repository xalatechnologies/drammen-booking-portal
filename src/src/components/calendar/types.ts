
export interface Booking {
  id: number;
  facilityId: number;
  facilityName: string;
  date: Date;
  endDate: Date;
  status: string;
}

export interface Facility {
  id: number;
  name: string;
  location: string;
  type: string;
  capacity: number;
  accessibility: string[];
  address: string;
  suitableFor: string[];
  bookings: Booking[];
}

export interface CalendarViewProps {
  date?: Date;
  facilityType?: string;
  location?: string;
  accessibility?: string;
  capacity?: number[];
}
