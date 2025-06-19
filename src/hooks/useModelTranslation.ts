
import { useTranslation } from '@/i18n/hooks/useTranslation';

interface FieldTranslation {
  label: string;
  description: string;
  placeholder: string;
}

interface ModelTranslationHook {
  getFieldLabel: (model: string, field: string) => string;
  getFieldDescription: (model: string, field: string) => string;
  getFieldPlaceholder: (model: string, field: string) => string;
  getValidationMessage: (model: string, field: string, rule: string) => string;
  getModelName: (model: string, plural?: boolean) => string;
  getSectionTitle: (model: string, section: string) => string;
}

export function useModelTranslation(): ModelTranslationHook {
  const { t } = useTranslation();

  const getFieldLabel = (model: string, field: string): string => {
    return t(`models.${model}.fields.${field}.label`, {}, field);
  };

  const getFieldDescription = (model: string, field: string): string => {
    return t(`models.${model}.fields.${field}.description`, {}, '');
  };

  const getFieldPlaceholder = (model: string, field: string): string => {
    return t(`models.${model}.fields.${field}.placeholder`, {}, '');
  };

  const getValidationMessage = (model: string, field: string, rule: string): string => {
    return t(`models.${model}.validation.${field}${rule.charAt(0).toUpperCase() + rule.slice(1)}`, {}, `${field} validation failed`);
  };

  const getModelName = (model: string, plural: boolean = false): string => {
    const suffix = plural ? 'Plural' : '';
    return t(`models.${model}.name${suffix}`, {}, model);
  };

  const getSectionTitle = (model: string, section: string): string => {
    return t(`models.${model}.sections.${section}`, {}, section);
  };

  return {
    getFieldLabel,
    getFieldDescription,
    getFieldPlaceholder,
    getValidationMessage,
    getModelName,
    getSectionTitle
  };
}
