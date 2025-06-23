
import { CartItem } from '@/types/cart';

export class CartSessionService {
  private static readonly STORAGE_KEY = 'facility_cart_session';

  static saveCartToSession(cartItems: CartItem[]): void {
    try {
      const sessionData = {
        items: cartItems,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to save cart to session:', error);
    }
  }

  static loadCartFromSession(): CartItem[] {
    try {
      const sessionData = sessionStorage.getItem(this.STORAGE_KEY);
      if (!sessionData) return [];

      const parsed = JSON.parse(sessionData);
      
      // Convert date strings back to Date objects
      const restoredItems = parsed.items.map((item: any) => ({
        ...item,
        date: new Date(item.date)
      }));

      return restoredItems;
    } catch (error) {
      console.warn('Failed to load cart from session:', error);
      return [];
    }
  }

  static clearCartSession(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}
