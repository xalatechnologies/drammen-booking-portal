
import React from "react";
import { ServiceSummary } from "../../services/ServiceSummary";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/i18n/hooks/useTranslation";

interface SelectedService {
  service: any;
  quantity: number;
  totalPrice: number;
}

interface ServiceSummarySectionProps {
  calculatedServices: SelectedService[];
  totalServicesCost: number;
  onRemoveService: (serviceId: string) => void;
  onClearAll: () => void;
}

export function ServiceSummarySection({
  calculatedServices,
  totalServicesCost,
  onRemoveService,
  onClearAll
}: ServiceSummarySectionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <ServiceSummary
        selectedServices={calculatedServices}
        onRemoveService={onRemoveService}
        totalServicesCost={totalServicesCost}
      />

      {calculatedServices.length > 0 && (
        <Button
          variant="outline"
          onClick={onClearAll}
          className="w-full"
        >
          {t('services.clearAll', {}, 'Fjern alle tjenester')}
        </Button>
      )}
    </div>
  );
}
