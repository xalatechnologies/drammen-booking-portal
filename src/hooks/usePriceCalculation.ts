
import { useQuery } from '@tanstack/react-query';
import { PriceRuleService, ActorType as PriceActorType } from '@/services/PriceRuleService';
import { ActorType } from '@/types/pricing';

interface PriceCalculationParams {
  facilityId: string;
  zoneId?: string;
  startDate?: Date;
  customerType: ActorType;
  timeSlot?: string;
  bookingMode?: 'one-time' | 'recurring';
}

// Convert between ActorType formats
const convertActorType = (actorType: ActorType): PriceActorType => {
  switch (actorType) {
    case 'private-person': return PriceActorType.INDIVIDUAL;
    case 'lag-foreninger': return PriceActorType.ORGANIZATION;
    case 'paraply': return PriceActorType.PARAPLY;
    case 'private-firma': return PriceActorType.ORGANIZATION;
    case 'kommunale-enheter': return PriceActorType.ORGANIZATION;
    default: return PriceActorType.INDIVIDUAL;
  }
};

export function usePriceCalculation({
  facilityId,
  zoneId,
  startDate,
  customerType,
  timeSlot,
  bookingMode = 'one-time'
}: PriceCalculationParams) {
  return useQuery({
    queryKey: ['price-calculation', facilityId, zoneId, startDate?.toISOString(), customerType, timeSlot, bookingMode],
    queryFn: async () => {
      if (!facilityId || !startDate) {
        return null;
      }

      const rules = await PriceRuleService.getPriceRules(facilityId);
      const priceActorType = convertActorType(customerType);
      const unitPrice = PriceRuleService.calculateUnitPrice(rules, startDate, priceActorType);
      
      // Basic calculation structure
      return {
        basePrice: unitPrice,
        totalHours: 2, // Default
        totalDays: 1,
        actorTypeDiscount: 0,
        timeSlotMultiplier: 1,
        bookingTypeDiscount: 0,
        weekendSurcharge: 0,
        subtotal: unitPrice,
        finalPrice: unitPrice,
        requiresApproval: ['lag-foreninger', 'paraply'].includes(customerType),
        breakdown: [
          {
            description: 'Base price',
            amount: unitPrice,
            type: 'base' as const
          }
        ],
        discounts: [],
        surcharges: [],
        totalPrice: unitPrice,
        currency: 'NOK'
      };
    },
    enabled: !!facilityId && !!startDate,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
