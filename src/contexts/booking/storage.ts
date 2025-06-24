
// Simple session storage utilities
export const bookingStorage = {
  save: (data: any) => {
    try {
      sessionStorage.setItem('booking_session', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save booking session:', error);
    }
  },
  
  load: () => {
    try {
      const data = sessionStorage.getItem('booking_session');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load booking session:', error);
      return null;
    }
  },
  
  clear: () => {
    try {
      sessionStorage.removeItem('booking_session');
    } catch (error) {
      console.error('Failed to clear booking session:', error);
    }
  }
};
