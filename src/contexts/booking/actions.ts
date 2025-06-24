
export const bookingActions = {
  updateContactInfo: (contactInfo: { name: string; email: string; phone: string }) => ({
    type: 'UPDATE_CONTACT_INFO' as const,
    payload: contactInfo
  }),
  
  updateBookingDetails: (details: any) => ({
    type: 'UPDATE_BOOKING_DETAILS' as const,
    payload: details
  }),
  
  clearBooking: () => ({
    type: 'CLEAR_BOOKING' as const
  })
};
