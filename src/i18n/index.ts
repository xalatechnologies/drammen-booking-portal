
// Simple translation system for Norwegian/English
export const useTranslation = () => {
  const t = (key: string, params?: Record<string, any>, fallback?: string) => {
    // For now, return the fallback or key
    return fallback || key;
  };

  const formatCurrency = (amount: number, currency: string = 'NOK') => {
    return new Intl.NumberFormat('nb-NO', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return { t, formatCurrency };
};
