import { pricingRuleRepository } from '@/dal/repositories/PricingRuleRepository';
import { Database } from '@/integrations/supabase/types';

const PricingService = {
  async getPricingRulesByFacility(facilityId: number) {
    return pricingRuleRepository.findByFacilityId(facilityId);
  },
  async getPricingRulesByZone(zoneId: string) {
    return pricingRuleRepository.findByZoneId(zoneId);
  },
  async createPricingRule(data: Omit<Database['public']['Tables']['pricing_rules']['Insert'], 'id' | 'created_at' | 'updated_at'>) {
    return pricingRuleRepository.createPricingRule(data);
  },
  async updatePricingRule(id: string, data: Partial<Omit<Database['public']['Tables']['pricing_rules']['Update'], 'id' | 'created_at'>>) {
    return pricingRuleRepository.updatePricingRule(id, data);
  },
  async deletePricingRule(id: string) {
    return pricingRuleRepository.deletePricingRule(id);
  }
};

export default PricingService; 