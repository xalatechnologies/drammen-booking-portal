
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';

export interface CartItem extends SelectedTimeSlot {
  id: string;
  facilityId: string;
  facilityName: string;
  pricePerHour: number;
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
  | { type: 'UPDATE_ITEM_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'LOAD_FROM_SESSION'; payload: CartItem[] }
  | { type: 'SAVE_TO_SESSION' };
