
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType, EventType, AgeGroup } from '@/types/booking';

export interface AdditionalServiceItem {
  serviceId: string;
  serviceName: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  organization?: string;
}

export interface ReservationPricing {
  baseFacilityPrice: number;
  servicesPrice: number;
  discounts: number;
  vatAmount: number;
  totalPrice: number;
}

export interface CartItem {
  id: string;
  facilityId: string;
  facilityName: string;
  
  // Booking package information
  eventType?: EventType;
  purpose: string;
  ageGroup?: AgeGroup;
  expectedAttendees: number;
  organizationType: ActorType;
  additionalServices: AdditionalServiceItem[];
  specialRequirements?: string;
  
  // Time slots for this reservation
  timeSlots: SelectedTimeSlot[];
  
  // Customer information
  customerInfo?: CustomerInfo;
  
  // Pricing breakdown
  pricing: ReservationPricing;
  
  // Legacy fields for backward compatibility
  date: Date;
  timeSlot: string;
  zoneId: string;
  pricePerHour: number;
  duration?: number;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  itemCount: number;
}

export type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_RESERVATION'; payload: { itemId: string; updates: Partial<CartItem> } }
  | { type: 'LOAD_FROM_SESSION'; payload: CartItem[] }
  | { type: 'SAVE_TO_SESSION' };
