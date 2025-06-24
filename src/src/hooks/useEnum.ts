
import { useState, useEffect } from 'react';
import { enumService } from '@/services/EnumService';
import { EnumOption, EnumType } from '@/types/enum';
import { useLanguage } from '@/contexts/LanguageContext';

interface UseEnumReturn {
  options: EnumOption[];
  getLabel: (key: string) => string;
  getDescription: (key: string) => string | undefined;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useEnum(enumType: EnumType): UseEnumReturn {
  const { language } = useLanguage();
  const [options, setOptions] = useState<EnumOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEnumOptions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const enumOptions = await enumService.getEnumOptions(enumType, language);
      setOptions(enumOptions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load enum options');
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEnumOptions();
  }, [enumType, language]);

  const getLabel = (key: string): string => {
    const option = options.find(opt => opt.key === key);
    return option?.label || key;
  };

  const getDescription = (key: string): string | undefined => {
    const option = options.find(opt => opt.key === key);
    return option?.description;
  };

  const refresh = () => {
    enumService.clearCache();
    loadEnumOptions();
  };

  return {
    options,
    getLabel,
    getDescription,
    isLoading,
    error,
    refresh
  };
}
