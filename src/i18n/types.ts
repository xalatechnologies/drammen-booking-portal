
export type Language = 'NO' | 'EN';

export interface TranslationKeys {
  booking: {
    status: {
      pending: string;
      approved: string;
      rejected: string;
      cancelled: string;
      confirmed: string;
      'pending-approval': string;
      'approved-paid': string;
      'approved-payment-required': string;
    };
    types: {
      engangs: string;
      fastlan: string;
    };
    actorTypes: {
      'private-person': string;
      'lag-foreninger': string;
      'paraply': string;
      'private-firma': string;
      'kommunale-enheter': string;
    };
    eventTypes: {
      training: string;
      conference: string;
      celebration: string;
      meeting: string;
      sports: string;
      cultural: string;
    };
    ageGroups: {
      youth: string;
      adults: string;
      mixed: string;
      children: string;
      seniors: string;
    };
    actions: {
      book: string;
      cancel: string;
      approve: string;
      reject: string;
      edit: string;
      pay: string;
      view: string;
    };
    fields: {
      facilityName: string;
      zoneName: string;
      startDate: string;
      endDate: string;
      duration: string;
      purpose: string;
      contactName: string;
      contactEmail: string;
      contactPhone: string;
      expectedAttendees: string;
      totalPrice: string;
    };
  };
  facility: {
    types: {
      gym: string;
      auditorium: string;
      meetingRoom: string;
      sportsHall: string;
      classroom: string;
    };
    amenities: {
      parking: string;
      wifi: string;
      projector: string;
      sound: string;
      kitchen: string;
      accessible: string;
    };
    availability: {
      available: string;
      unavailable: string;
      booked: string;
      maintenance: string;
      closed: string;
    };
  };
  common: {
    actions: {
      save: string;
      cancel: string;
      delete: string;
      edit: string;
      view: string;
      search: string;
      filter: string;
      reset: string;
      submit: string;
      back: string;
      next: string;
      continue: string;
    };
    labels: {
      name: string;
      email: string;
      phone: string;
      address: string;
      date: string;
      time: string;
      price: string;
      description: string;
      notes: string;
      status: string;
    };
    messages: {
      loading: string;
      success: string;
      error: string;
      noResults: string;
      confirmation: string;
    };
    navigation: {
      home: string;
      facilities: string;
      bookings: string;
      profile: string;
      settings: string;
      admin: string;
    };
  };
  errors: {
    validation: {
      required: string;
      email: string;
      phone: string;
      minLength: string;
      maxLength: string;
      pastDate: string;
      invalidDate: string;
    };
    booking: {
      conflict: string;
      unavailable: string;
      invalidTime: string;
      missingInfo: string;
      paymentFailed: string;
    };
    system: {
      networkError: string;
      serverError: string;
      unknown: string;
    };
  };
}
