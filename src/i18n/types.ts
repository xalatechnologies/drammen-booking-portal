export type Language = 'NO' | 'EN';

export interface TranslationParams {
  [key: string]: string | number;
}

export type TranslationFunction = (key: string, params?: TranslationParams, defaultValue?: string) => string;

/**
 * Interface for the database-driven translation context
 */
export interface TranslationContext {
  t: TranslationFunction;
  language: Language;
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  formatDateTime: (date: Date) => string;
  formatNumber: (number: number) => string;
  formatPercent: (number: number) => string;
}

// Type-safe translation keys
export type CommonTranslationKeys = 
  | 'common.actions.save'
  | 'common.actions.cancel'
  | 'common.actions.delete'
  | 'common.labels.name'
  | 'common.labels.email'
  | 'common.messages.loading'
  | 'common.navigation.home';

export type BookingTranslationKeys = 
  | 'booking.types.engangs'
  | 'booking.types.fastlan'
  | 'booking.status.pending'
  | 'booking.status.approved';

export type FacilityTranslationKeys = 
  | 'facility.details.capacity'
  | 'facility.details.bookNow'
  | 'facility.search.noResults';

export type TranslationKeys = CommonTranslationKeys & BookingTranslationKeys & FacilityTranslationKeys;

/**
 * JSON-based Translation System Types
 */

// Define nested structure for translations
export type NestedTranslations = {
  [key: string]: string | NestedTranslations;
};

// Define namespaces for JSON translations
export type TranslationNamespace = 'admin' | 'public';

// Interface for the JSON-based translation context
export interface JsonTranslationContext {
  t: (key: string, fallback?: string) => Promise<string>;
  tSync: (key: string, fallback?: string) => string;
  language: Language;
  isInitialized: boolean;
}

// Interface for admin translations structure (for type checking)
export interface AdminTranslations {
  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    filter: string;
    actions: string;
  };
  sidebar: {
    overview: string;
    facilities: string;
    bookings: string;
    usersRoles: string;
    approvalWorkflows: string;
    roles: string;
    reportsAnalytics: string;
    notifications: string;
    profileSettings: string;
    systemConfig: string;
    externalCalendars: string;
    messageTemplates: string;
    authProviders: string;
    supportTickets: string;
    slaConfig: string;
    lockConfig: string;
    monitoring: string;
    integrations: string;
    exchangeIntegration: string;
    auditLogs: string;
    dataRetention: string;
    azureDeploy: string;
    descriptions: {
      overview: string;
      facilities: string;
      bookings: string;
      usersRoles: string;
      approvalWorkflows: string;
      roles: string;
      reportsAnalytics: string;
      notifications: string;
      profileSettings: string;
      systemConfig: string;
      externalCalendars: string;
      messageTemplates: string;
      authProviders: string;
      supportTickets: string;
      slaConfig: string;
      lockConfig: string;
      monitoring: string;
      integrations: string;
      exchangeIntegration: string;
      auditLogs: string;
      dataRetention: string;
      azureDeploy: string;
    };
  };
  facilities: {
    management: string;
    pageDescription: string;
    addNew: string;
    views: {
      table: string;
      grid: string;
      list: string;
      map: string;
    };
    filters: {
      type: string;
      status: string;
      allTypes: string;
      allStatuses: string;
      sports: string;
      meeting: string;
      active: string;
      inactive: string;
    };
    search: {
      placeholder: string;
      filterByType: string;
      filterByStatus: string;
      allTypes: string;
      allStatus: string;
      noResults: string;
    };
    types: {
      fotballhall: string;
      idrettshall: string;
      gymsal: string;
      svømmehall: string;
      møterom: string;
    };
    status: {
      active: string;
      maintenance: string;
      inactive: string;
    };
    images: {
      uploadNew: string;
      currentImages: string;
      featured: string;
      noImages: string;
      uploadFirst: string;
    };
    form: {
      tabs: {
        details: string;
        images: string;
      };
      saveFirst: string;
    };
  };
}
