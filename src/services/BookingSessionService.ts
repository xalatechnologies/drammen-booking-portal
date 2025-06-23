
export class BookingSessionService {
  static saveSession(data: any) {
    sessionStorage.setItem('booking_session', JSON.stringify(data));
  }
  
  static getSession() {
    const data = sessionStorage.getItem('booking_session');
    return data ? JSON.parse(data) : null;
  }
}
