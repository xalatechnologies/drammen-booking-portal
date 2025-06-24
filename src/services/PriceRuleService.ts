
import { supabase } from "@/integrations/supabase/client";
import { ActorType, PriceRuleType } from "@/types/pricing";

interface PriceRule {
  id: string;
  locationId: string;
  actorType: ActorType;
  type: PriceRuleType;
  priority: number;
  config: {
    daysOfWeek?: number[];
    startTime?: string;
    endTime?: string;
    percent?: number;
  };
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class PriceRuleService {
  static async getPriceRules(locationId?: string): Promise<PriceRule[]> {
    try {
      let query = supabase
        .from('app_price_rules')
        .select('*')
        .order('priority', { ascending: true });

      if (locationId) {
        query = query.eq('location_id', locationId);
      }

      const { data, error } = await query;

      if (error) throw new Error(error.message);

      return (data || []).map(rule => ({
        id: rule.id,
        locationId: rule.location_id || '',
        actorType: rule.actor_type as ActorType,
        type: rule.type as PriceRuleType,
        priority: rule.priority || 1,
        config: typeof rule.config === 'object' ? rule.config as any : {},
        price: rule.price,
        isActive: true, // Default since this field doesn't exist in schema
        createdAt: rule.created_at || '',
        updatedAt: rule.created_at || '' // Use created_at since updated_at doesn't exist
      }));
    } catch (error) {
      console.error('Error fetching price rules:', error);
      return [];
    }
  }

  static async createPriceRule(rule: Omit<PriceRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<PriceRule | null> {
    try {
      const { data, error } = await supabase
        .from('app_price_rules')
        .insert({
          location_id: rule.locationId,
          actor_type: rule.actorType,
          type: rule.type,
          priority: rule.priority,
          config: rule.config,
          price: rule.price
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      return {
        id: data.id,
        locationId: data.location_id || '',
        actorType: data.actor_type as ActorType,
        type: data.type as PriceRuleType,
        priority: data.priority || 1,
        config: typeof data.config === 'object' ? data.config as any : {},
        price: data.price,
        isActive: true,
        createdAt: data.created_at || '',
        updatedAt: data.created_at || ''
      };
    } catch (error) {
      console.error('Error creating price rule:', error);
      return null;
    }
  }
}
