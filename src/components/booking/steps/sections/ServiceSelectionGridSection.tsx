
import React from "react";
import { ServiceSelectionCard } from "../../services/ServiceSelectionCard";
import { Card, CardContent } from "@/components/ui/card";
import { AdditionalService } from "@/types/additionalServices";
import { useTranslation } from "@/i18n/hooks/useTranslation";

interface ServiceSelectionGridSectionProps {
  services: AdditionalService[];
  isLoading: boolean;
  actorType: string;
  attendees?: number;
  selectedServices: Record<string, number>;
  onQuantityChange: (serviceId: string, quantity: number) => void;
}

export function ServiceSelectionGridSection({
  services,
  isLoading,
  actorType,
  attendees,
  selectedServices,
  onQuantityChange
}: ServiceSelectionGridSectionProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">
          {t('common.messages.loading', {}, 'Laster...')}
        </p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">
            {t('services.noServicesAvailable', {}, 'Ingen tjenester tilgjengelig i denne kategorien')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map(service => (
        <ServiceSelectionCard
          key={service.id}
          service={service}
          actorType={actorType as any}
          attendees={attendees}
          selectedQuantity={selectedServices[service.id] || 0}
          onQuantityChange={onQuantityChange}
          isSelected={(selectedServices[service.id] || 0) > 0}
        />
      ))}
    </div>
  );
}
