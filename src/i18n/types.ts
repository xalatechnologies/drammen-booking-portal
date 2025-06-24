
export interface TranslationParams {
  [key: string]: string | number;
}

export interface TranslationKey {
  key: string;
  defaultValue?: string;
  params?: TranslationParams;
}

export type Language = 'NO' | 'EN';

export interface TranslationFunction {
  (key: string, params?: TranslationParams): string;
}
