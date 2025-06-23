export const modelsTranslations = {
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
  }
};
