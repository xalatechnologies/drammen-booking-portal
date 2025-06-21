
import { ActorType } from '@/types/pricing';

export interface Zone {
  id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerHour: number;
  area?: string;
  equipment?: string[];
  amenities?: string[];
}

export interface BookingFormData {
  purpose: string;
  attendees: number;
  activityType: string;
  additionalInfo: string;
  actorType: ActorType | '';
  termsAccepted: boolean;
}

export interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
  price?: number;
}

export interface BookingRequest {
  facilityId: string;
  zoneId: string;
  startDate: Date;
  endDate: Date;
  purpose: string;
  attendees: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  actorType: ActorType;
  additionalInfo?: string;
}
