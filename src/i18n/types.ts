export type Language = 'NO' | 'EN';

export interface TranslationParams {
  [key: string]: string | number;
}

export type TranslationFunction = (key: string, params?: TranslationParams, defaultValue?: string) => string;

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

export type TranslationKeys = CommonTranslationKeys | BookingTranslationKeys | FacilityTranslationKeys;
