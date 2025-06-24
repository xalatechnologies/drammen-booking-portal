
export type Language = 'NO' | 'EN';

export interface LocalizedContent {
  NO: string;
  EN?: string;
}

export interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

export interface TranslationStore {
  [language: string]: {
    [namespace: string]: TranslationNamespace;
  };
}
