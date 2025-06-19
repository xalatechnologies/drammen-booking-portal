
import React from "react";
import { Calculator } from "lucide-react";
import { PriceBreakdown } from "../../PriceBreakdown";
import { useModelTranslation } from "@/hooks/useModelTranslation";
import { useTranslation } from "@/i18n/hooks/useTranslation";

interface PricingDisplaySectionProps {
  calculation: any;
  isLoading: boolean;
  shouldShowPricing: boolean;
  hasTimeSlot: boolean;
}

export function PricingDisplaySection({ 
  calculation, 
  isLoading, 
  shouldShowPricing, 
  hasTimeSlot 
}: PricingDisplaySectionProps) {
  const { getSectionTitle } = useModelTranslation();
  const { t } = useTranslation();

  if (!shouldShowPricing) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-slate-600" />
        {getSectionTitle('booking', 'pricing')}
      </h3>
      
      {!hasTimeSlot && (
        <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
          💡 {t('booking.estimateNotice', {}, 'Prisberegning basert på estimert 2-timers booking. Velg tidsperiode for nøyaktig pris.')}
        </div>
      )}
      
      <PriceBreakdown 
        calculation={calculation || { 
          basePrice: 0, 
          totalHours: 2, 
          totalDays: 1, 
          actorTypeDiscount: 0, 
          timeSlotMultiplier: 1,
          bookingTypeDiscount: 0,
          weekendSurcharge: 0, 
          subtotal: 0, 
          finalPrice: 0, 
          requiresApproval: false,
          breakdown: [] 
        }}
        isLoading={isLoading}
        showDetailed={true}
      />
    </div>
  );
}
