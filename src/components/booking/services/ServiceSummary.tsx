
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { AdditionalService } from '@/types/additionalServices';
import { useTranslation } from '@/i18n';

interface SelectedService {
  service: AdditionalService;
  quantity: number;
  totalPrice: number;
}

interface ServiceSummaryProps {
  selectedServices: SelectedService[];
  onRemoveService: (serviceId: string) => void;
  totalServicesCost: number;
}

export function ServiceSummary({
  selectedServices,
  onRemoveService,
  totalServicesCost
}: ServiceSummaryProps) {
  const { t, formatCurrency } = useTranslation();

  if (selectedServices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('services.selectedServices', {}, 'Valgte tjenester')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">
            {t('services.noServicesSelected', {}, 'Ingen ekstra tjenester valgt')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          {t('services.selectedServices', {}, 'Valgte tjenester')}
          <Badge variant="secondary">
            {selectedServices.length} {t('services.services', {}, 'tjenester')}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {selectedServices.map(({ service, quantity, totalPrice }) => (
          <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">{service.name}</h4>
                {quantity > 1 && (
                  <Badge variant="outline" className="text-xs">
                    {quantity}x
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {service.shortDescription}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-600">
                {formatCurrency(totalPrice)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveService(service.id)}
                className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
        
        {/* Total Services Cost */}
        <div className="border-t pt-3 mt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {t('services.totalServicesCost', {}, 'Totalt for tjenester')}:
            </span>
            <span className="text-lg font-bold text-blue-600">
              {formatCurrency(totalServicesCost)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
