
export interface BookingSessionData {
  actorType: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    organization: string;
  };
  preferences: {
    lastUsedPurpose: string;
    commonActivityTypes: string[];
  };
  timestamp: number;
}

export class BookingSessionService {
  private static readonly STORAGE_KEY = 'booking_session_data';
  private static readonly EXPIRY_HOURS = 24;

  static saveSessionData(data: Partial<BookingSessionData>): void {
    try {
      const existing = this.getSessionData();
      const updated: BookingSessionData = {
        ...existing,
        ...data,
        timestamp: Date.now()
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save booking session data:', error);
    }
  }

  static getSessionData(): BookingSessionData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return this.getDefaultSessionData();
      }

      const data: BookingSessionData = JSON.parse(stored);
      
      // Check if data is expired
      const hoursSinceUpdate = (Date.now() - data.timestamp) / (1000 * 60 * 60);
      if (hoursSinceUpdate > this.EXPIRY_HOURS) {
        this.clearSessionData();
        return this.getDefaultSessionData();
      }

      return data;
    } catch (error) {
      console.error('Failed to get booking session data:', error);
      return this.getDefaultSessionData();
    }
  }

  static clearSessionData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear booking session data:', error);
    }
  }

  private static getDefaultSessionData(): BookingSessionData {
    return {
      actorType: 'private-person',
      customerInfo: {
        name: '',
        email: '',
        phone: '',
        organization: ''
      },
      preferences: {
        lastUsedPurpose: '',
        commonActivityTypes: []
      },
      timestamp: Date.now()
    };
  }
}
