
export interface TranslationParams {
  [key: string]: string | number;
}

export interface TranslationKey {
  key: string;
  defaultValue?: string;
  params?: TranslationParams;
}
