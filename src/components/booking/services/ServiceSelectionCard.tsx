
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Info } from 'lucide-react';
import { AdditionalService } from '@/types/additionalServices';
import { ActorType } from '@/types/pricing';
import { useTranslation } from '@/i18n';
import { useServicePricing } from '@/hooks/useAdditionalServices';

interface ServiceSelectionCardProps {
  service: AdditionalService;
  actorType: ActorType;
  attendees?: number;
  selectedQuantity: number;
  onQuantityChange: (serviceId: string, quantity: number) => void;
  isSelected: boolean;
}

export function ServiceSelectionCard({
  service,
  actorType,
  attendees,
  selectedQuantity,
  onQuantityChange,
  isSelected
}: ServiceSelectionCardProps) {
  const { t, formatCurrency } = useTranslation();
  const { calculateServicePrice } = useServicePricing();
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  React.useEffect(() => {
    const calculatePrice = async () => {
      if (selectedQuantity > 0) {
        const result = await calculateServicePrice(
          service.id,
          selectedQuantity,
          actorType,
          attendees
        );
        
        if (result.success && result.data) {
          setCalculatedPrice(result.data.totalPrice);
        }
      } else {
        setCalculatedPrice(null);
      }
    };

    calculatePrice();
  }, [service.id, selectedQuantity, actorType, attendees]);

  const multiplier = service.pricing.actorTypeMultipliers[actorType] || 1.0;
  const discountPercentage = multiplier < 1.0 ? Math.round((1 - multiplier) * 100) : 0;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(0, selectedQuantity + delta);
    onQuantityChange(service.id, newQuantity);
  };

  const getPricingTypeLabel = () => {
    switch (service.pricing.pricingType) {
      case 'hourly': return t('pricing.perHour', {}, 'pr. time');
      case 'daily': return t('pricing.perDay', {}, 'pr. dag');
      case 'per-person': return t('pricing.perPerson', {}, 'pr. person');
      case 'per-item': return t('pricing.perItem', {}, 'pr. stk');
      case 'flat': return t('pricing.flatRate', {}, 'fast pris');
      default: return '';
    }
  };

  return (
    <Card className={`transition-all duration-200 ${
      isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">
            {service.name}
          </CardTitle>
          {discountPercentage > 0 && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              -{discountPercentage}%
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-gray-600">
          {service.shortDescription || service.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pricing Information */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(service.pricing.basePrice * multiplier)}
            </span>
            <span className="text-sm text-gray-500 ml-1">
              {getPricingTypeLabel()}
            </span>
            {discountPercentage > 0 && (
              <div className="text-xs text-gray-500 line-through">
                {formatCurrency(service.pricing.basePrice)}
              </div>
            )}
          </div>
        </div>

        {/* Minimum charges */}
        {service.pricing.minimumCharge && (
          <div className="text-xs text-gray-500">
            {t('pricing.minimumCharge', {}, 'Minimum')}: {formatCurrency(service.pricing.minimumCharge)}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {t('services.quantity', {}, 'Antall')}:
          </span>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(-1)}
              disabled={selectedQuantity <= 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <span className="w-8 text-center font-medium">
              {selectedQuantity}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Total Price */}
        {calculatedPrice && (
          <div className="bg-gray-50 rounded-lg p-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {t('pricing.totalPrice', {}, 'Total pris')}:
              </span>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(calculatedPrice)}
              </span>
            </div>
          </div>
        )}

        {/* Service Details */}
        {service.requirements.equipmentProvided.length > 0 && (
          <div className="text-xs text-gray-500">
            <strong>{t('services.included', {}, 'Inkludert')}:</strong> {' '}
            {service.requirements.equipmentProvided.slice(0, 3).join(', ')}
            {service.requirements.equipmentProvided.length > 3 && '...'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
