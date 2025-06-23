
export const modelTranslations = {
  NO: {
    facility: {
      fields: {
        name: { label: "Navn", description: "Navn på anlegget", placeholder: "Skriv inn navn på anlegget" },
        address: { label: "Adresse", description: "Fysisk adresse", placeholder: "Skriv inn adresse" },
        capacity: { label: "Kapasitet", description: "Maksimalt antall personer", placeholder: "Antall personer" },
        area: { label: "Areal", description: "Størrelse i kvadratmeter", placeholder: "m²" },
        pricePerHour: { label: "Pris per time", description: "Timepris i NOK", placeholder: "Pris i NOK" },
        openingHours: { label: "Åpningstider", description: "Når anlegget er åpent", placeholder: "HH:MM - HH:MM" },
        description: { label: "Beskrivelse", description: "Detaljert beskrivelse av anlegget", placeholder: "Beskriv anlegget..." },
        amenities: { label: "Lokaler", description: "Tilgjengelige Lokaler", placeholder: "Velg Lokaler" },
        equipment: { label: "Utstyr", description: "Tilgjengelig utstyr", placeholder: "Velg utstyr" },
        type: { label: "Type anlegg", description: "Kategori av anlegg", placeholder: "Velg type" }
      },
      validation: {
        nameRequired: "Navn på anlegget er påkrevd",
        invalidCapacity: "Kapasitet må være et positivt tall",
        invalidPrice: "Pris må være et gyldig beløp",
        addressRequired: "Adresse er påkrevd"
      },
      sections: {
        basicInfo: "Grunnleggende informasjon",
        location: "Lokasjon",
        amenities: "Lokaler",
        pricing: "Prising",
        availability: "Tilgjengelighet"
      }
    },
    booking: {
      fields: {
        purpose: { label: "Formål", description: "Hva skal lokalet brukes til", placeholder: "Beskriv formålet med bookingen..." },
        eventType: { label: "Type arrangement", description: "Hvilken type aktivitet", placeholder: "Velg type arrangement" },
        ageGroup: { label: "Aldersgruppe", description: "Hvilken aldersgruppe", placeholder: "Velg aldersgruppe" },
        attendees: { label: "Antall deltakere", description: "Forventet antall personer", placeholder: "Antall personer" },
        contactName: { label: "Kontaktperson", description: "Navn på ansvarlig person", placeholder: "Fullt navn" },
        contactEmail: { label: "E-postadresse", description: "E-post for kontakt", placeholder: "din@epost.no" },
        contactPhone: { label: "Telefonnummer", description: "Telefon for kontakt", placeholder: "+47 12 34 56 78" },
        organization: { label: "Organisasjon", description: "Navn på organisasjon", placeholder: "Organisasjonsnavn (valgfritt)" },
        customerType: { label: "Aktørtype", description: "Type aktør som booker", placeholder: "Velg aktørtype" },
        bookingMode: { label: "Type reservasjon", description: "Engangs eller gjentakende", placeholder: "Velg type" },
        timeSlot: { label: "Tidsperiode", description: "Fra og til tidspunkt", placeholder: "Velg tid" },
        date: { label: "Dato", description: "Dato for booking", placeholder: "Velg dato" },
        endDate: { label: "Sluttdato", description: "Siste dag for booking", placeholder: "Velg sluttdato" },
        specialServices: { label: "Tilleggstjenester", description: "Ekstra tjenester for arrangementet", placeholder: "Velg tjenester" }
      },
      validation: {
        purposeRequired: "Formål er påkrevd",
        eventTypeRequired: "Type arrangement er påkrevd",
        attendeesMin: "Minimum 1 person",
        attendeesMax: "Maksimalt 1000 personer",
        contactNameRequired: "Kontaktperson er påkrevd",
        contactEmailRequired: "E-postadresse er påkrevd",
        contactEmailInvalid: "Ugyldig e-postadresse",
        contactPhoneRequired: "Telefonnummer er påkrevd",
        dateRequired: "Dato er påkrevd",
        timeSlotRequired: "Tidsperiode er påkrevd",
        customerTypeRequired: "Aktørtype er påkrevd"
      },
      sections: {
        customerInfo: "Kundeinfo",
        eventDetails: "Arrangementsdetaljer", 
        timing: "Tidspunkt",
        purpose: "Formål",
        zoneSelection: "Sonevalg",
        pricing: "Prisberegning",
        services: "Tilleggstjenester",
        summary: "Sammendrag",
        confirmation: "Bekreftelse"
      }
    },
    service: {
      fields: {
        name: { label: "Navn", description: "Navn på tjenesten", placeholder: "Skriv inn tjenestenavn" },
        description: { label: "Beskrivelse", description: "Detaljert beskrivelse", placeholder: "Beskriv tjenesten..." },
        price: { label: "Pris", description: "Pris per enhet", placeholder: "Pris i NOK" },
        category: { label: "Kategori", description: "Tjenestekategori", placeholder: "Velg kategori" },
        quantity: { label: "Antall", description: "Ønsket antall", placeholder: "Antall" },
        unit: { label: "Enhet", description: "Måleenhet", placeholder: "f.eks. stk, timer" }
      },
      validation: {
        nameRequired: "Tjenestenavn er påkrevd",
        priceRequired: "Pris er påkrevd",
        quantityMin: "Minimum 1 enhet",
        quantityMax: "Maksimalt 100 enheter"
      },
      sections: {
        categories: "Kategorier",
        selection: "Tjenestevalg",
        summary: "Sammendrag",
        pricing: "Prising"
      }
    },
    user: {
      fields: {
        email: { label: "E-postadresse", description: "Brukerens e-postadresse", placeholder: "din@epost.no" },
        firstName: { label: "Fornavn", description: "Brukerens fornavn", placeholder: "Fornavn" },
        lastName: { label: "Etternavn", description: "Brukerens etternavn", placeholder: "Etternavn" },
        phone: { label: "Telefon", description: "Telefonnummer", placeholder: "+47 12 34 56 78" },
        role: { label: "Rolle", description: "Brukerens rolle i systemet", placeholder: "Velg rolle" }
      },
      validation: {
        emailRequired: "E-postadresse er påkrevd",
        emailInvalid: "Ugyldig e-postadresse",
        firstNameRequired: "Fornavn er påkrevd",
        lastNameRequired: "Etternavn er påkrevd",
        phoneInvalid: "Ugyldig telefonnummer"
      }
    }
  },
  EN: {
    facility: {
      fields: {
        name: { label: "Name", description: "Name of the facility", placeholder: "Enter facility name" },
        address: { label: "Address", description: "Physical address", placeholder: "Enter address" },
        capacity: { label: "Capacity", description: "Maximum number of people", placeholder: "Number of people" },
        area: { label: "Area", description: "Size in square meters", placeholder: "m²" },
        pricePerHour: { label: "Price per hour", description: "Hourly rate in NOK", placeholder: "Price in NOK" },
        openingHours: { label: "Opening hours", description: "When the facility is open", placeholder: "HH:MM - HH:MM" },
        description: { label: "Description", description: "Detailed facility description", placeholder: "Describe the facility..." },
        amenities: { label: "Amenities", description: "Available amenities", placeholder: "Select amenities" },
        equipment: { label: "Equipment", description: "Available equipment", placeholder: "Select equipment" },
        type: { label: "Facility type", description: "Category of facility", placeholder: "Select type" }
      },
      validation: {
        nameRequired: "Facility name is required",
        invalidCapacity: "Capacity must be a positive number",
        invalidPrice: "Price must be a valid amount",
        addressRequired: "Address is required"
      },
      sections: {
        basicInfo: "Basic Information",
        location: "Location",
        amenities: "Amenities",
        pricing: "Pricing",
        availability: "Availability"
      }
    },
    booking: {
      fields: {
        purpose: { label: "Purpose", description: "What the facility will be used for", placeholder: "Describe the purpose of the booking..." },
        eventType: { label: "Event type", description: "Type of activity", placeholder: "Select event type" },
        ageGroup: { label: "Age group", description: "Target age group", placeholder: "Select age group" },
        attendees: { label: "Number of attendees", description: "Expected number of people", placeholder: "Number of people" },
        contactName: { label: "Contact person", description: "Name of responsible person", placeholder: "Full name" },
        contactEmail: { label: "Email address", description: "Email for contact", placeholder: "your@email.com" },
        contactPhone: { label: "Phone number", description: "Phone for contact", placeholder: "+47 12 34 56 78" },
        organization: { label: "Organization", description: "Organization name", placeholder: "Organization name (optional)" },
        customerType: { label: "Actor type", description: "Type of actor booking", placeholder: "Select actor type" },
        bookingMode: { label: "Booking type", description: "One-time or recurring", placeholder: "Select type" },
        timeSlot: { label: "Time period", description: "From and to time", placeholder: "Select time" },
        date: { label: "Date", description: "Date for booking", placeholder: "Select date" },
        endDate: { label: "End date", description: "Last day for booking", placeholder: "Select end date" },
        specialServices: { label: "Additional services", description: "Extra services for the event", placeholder: "Select services" }
      },
      validation: {
        purposeRequired: "Purpose is required",
        eventTypeRequired: "Event type is required",
        attendeesMin: "Minimum 1 person",
        attendeesMax: "Maximum 1000 people",
        contactNameRequired: "Contact person is required",
        contactEmailRequired: "Email address is required",
        contactEmailInvalid: "Invalid email address",
        contactPhoneRequired: "Phone number is required",
        dateRequired: "Date is required",
        timeSlotRequired: "Time period is required",
        customerTypeRequired: "Actor type is required"
      },
      sections: {
        customerInfo: "Customer Info",
        eventDetails: "Event Details",
        timing: "Timing",
        purpose: "Purpose", 
        zoneSelection: "Zone Selection",
        pricing: "Pricing",
        services: "Additional Services",
        summary: "Summary",
        confirmation: "Confirmation"
      }
    },
    service: {
      fields: {
        name: { label: "Name", description: "Service name", placeholder: "Enter service name" },
        description: { label: "Description", description: "Detailed description", placeholder: "Describe the service..." },
        price: { label: "Price", description: "Price per unit", placeholder: "Price in NOK" },
        category: { label: "Category", description: "Service category", placeholder: "Select category" },
        quantity: { label: "Quantity", description: "Desired quantity", placeholder: "Quantity" },
        unit: { label: "Unit", description: "Unit of measurement", placeholder: "e.g. pcs, hours" }
      },
      validation: {
        nameRequired: "Service name is required",
        priceRequired: "Price is required",
        quantityMin: "Minimum 1 unit",
        quantityMax: "Maximum 100 units"
      },
      sections: {
        categories: "Categories",
        selection: "Service Selection",
        summary: "Summary",
        pricing: "Pricing"
      }
    },
    user: {
      fields: {
        email: { label: "Email address", description: "User's email address", placeholder: "your@email.com" },
        firstName: { label: "First name", description: "User's first name", placeholder: "First name" },
        lastName: { label: "Last name", description: "User's last name", placeholder: "Last name" },
        phone: { label: "Phone", description: "Phone number", placeholder: "+47 12 34 56 78" },
        role: { label: "Role", description: "User's role in the system", placeholder: "Select role" }
      },
      validation: {
        emailRequired: "Email address is required",
        emailInvalid: "Invalid email address",
        firstNameRequired: "First name is required",
        lastNameRequired: "Last name is required",
        phoneInvalid: "Invalid phone number"
      }
    }
  }
};
