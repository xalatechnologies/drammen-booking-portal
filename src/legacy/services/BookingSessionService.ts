
export interface BookingSessionData {
  customerType: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  organization: string;
  lastUsed: Date;
}

export class BookingSessionService {
  private static readonly STORAGE_KEY = 'booking_session_data';

  static saveSessionData(data: Partial<BookingSessionData>): void {
    try {
      const existing = this.getSessionData();
      const updated = {
        ...existing,
        ...data,
        lastUsed: new Date()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save booking session data:', error);
    }
  }

  static getSessionData(): BookingSessionData | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return {
          ...data,
          lastUsed: new Date(data.lastUsed)
        };
      }
    } catch (error) {
      console.warn('Failed to load booking session data:', error);
    }
    return null;
  }

  static clearSessionData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear booking session data:', error);
    }
  }

  static hasRecentSession(maxAgeHours: number = 24): boolean {
    const data = this.getSessionData();
    if (!data) return false;
    
    const ageHours = (Date.now() - data.lastUsed.getTime()) / (1000 * 60 * 60);
    return ageHours <= maxAgeHours;
  }
}
