
import { SimpleRepository } from './SimpleRepository';

export class PricingRuleRepository extends SimpleRepository {
  constructor() {
    super('pricing_rules');
  }

  async getAllPricingRules(facilityId?: number) {
    console.log("PricingRuleRepository.getAllPricingRules - Using simplified approach", { facilityId });
    return this.getAll();
  }

  async getPricingRulesByFacilityAndZone(facilityId: number, zoneId?: string) {
    console.log("PricingRuleRepository.getPricingRulesByFacilityAndZone - Using simplified approach", { facilityId, zoneId });
    return this.getAll();
  }
}

export const pricingRuleRepository = new PricingRuleRepository();
