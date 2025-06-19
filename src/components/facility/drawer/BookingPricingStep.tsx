
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectedTimeSlot } from '@/utils/recurrenceEngine';
import { ActorType, BookingType } from '@/types/pricing';
import { Zone } from '@/components/booking/types';
import { BookingOverviewCard } from './BookingOverviewCard';
import { CustomerTypeSection } from './CustomerTypeSection';
import { IntegratedPriceCalculation } from '@/components/booking/IntegratedPriceCalculation';
import { useTranslation } from '@/i18n/hooks/useTranslation';

interface BookingPricingStepProps {
  selectedSlots: SelectedTimeSlot[];
  facilityId: string;
  facilityName: string;
  zones: Zone[];
  actorType: ActorType;
  onActorTypeChange: (type: ActorType) => void;
  bookingType: BookingType;
  onBack: () => void;
  onComplete: () => void;
  onAddToCart: () => void;
}

export function BookingPricingStep({
  selectedSlots,
  facilityId,
  facilityName,
  zones,
  actorType,
  onActorTypeChange,
  bookingType,
  onBack,
  onComplete,
  onAddToCart
}: BookingPricingStepProps) {
  const { t } = useTranslation();

  // Check if booking requires approval
  const requiresApproval = ['lag-foreninger', 'paraply'].includes(actorType);

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">Aktørtype og pris</h2>
      </div>

      <BookingOverviewCard selectedSlots={selectedSlots} facilityName={facilityName} zones={zones} />

      <CustomerTypeSection value={actorType} onChange={onActorTypeChange} />

      {/* Integrated Price Calculation - positioned prominently after actor type */}
      <IntegratedPriceCalculation 
        selectedSlots={selectedSlots} 
        facilityId={facilityId}
        actorType={actorType} 
        bookingType={bookingType} 
      />

      <div className="flex gap-3">
        <Button 
          onClick={onAddToCart} 
          variant="outline"
          className="flex-1 text-lg py-6" 
          size="lg"
        >
          {t('forms.buttons.addToCart', {}, 'Legg til handlekurv')}
        </Button>
        
        <Button 
          onClick={onComplete} 
          className="flex-1 text-lg py-6" 
          size="lg"
        >
          {requiresApproval ? t('forms.buttons.submitForApproval', {}, 'Fullfør') : t('forms.buttons.complete', {}, 'Fullfør')}
        </Button>
      </div>
    </>
  );
}
