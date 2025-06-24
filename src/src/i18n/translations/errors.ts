
export const errorTranslations = {
  NO: {
    validation: {
      required: "Dette feltet er påkrevd",
      email: "Ugyldig e-postadresse",
      phone: "Ugyldig telefonnummer",
      minLength: "Minimum {count} tegn",
      maxLength: "Maksimum {count} tegn",
      future: "Dato må være i fremtiden",
      pastDate: "Kan ikke reservere i fortiden"
    },
    booking: {
      conflict: "Tidspunkt er ikke tilgjengelig",
      capacityExceeded: "Overstiger maksimal kapasitet",
      invalidTimeSlot: "Ugyldig tidsperiode",
      facilityNotFound: "Lokale ikke funnet",
      bookingFailed: "Reservasjon feilet",
      unauthorized: "Ikke autorisert"
    },
    network: {
      connectionError: "Tilkoblingsfeil",
      serverError: "Serverfeil",
      timeout: "Forespørsel tok for lang tid",
      unknown: "Ukjent feil oppstod"
    },
    auth: {
      loginRequired: "Innlogging påkrevd",
      sessionExpired: "Økt utløpt",
      accessDenied: "Tilgang nektet"
    }
  },
  EN: {
    validation: {
      required: "This field is required",
      email: "Invalid email address",
      phone: "Invalid phone number",
      minLength: "Minimum {count} characters",
      maxLength: "Maximum {count} characters",
      future: "Date must be in the future",
      pastDate: "Cannot book in the past"
    },
    booking: {
      conflict: "Time slot is not available",
      capacityExceeded: "Exceeds maximum capacity",
      invalidTimeSlot: "Invalid time slot",
      facilityNotFound: "Facility not found",
      bookingFailed: "Booking failed",
      unauthorized: "Unauthorized"
    },
    network: {
      connectionError: "Connection error",
      serverError: "Server error",
      timeout: "Request timed out",
      unknown: "Unknown error occurred"
    },
    auth: {
      loginRequired: "Login required",
      sessionExpired: "Session expired",
      accessDenied: "Access denied"
    }
  }
};
