
import { supabase } from "@/integrations/supabase/client";

export enum ActorType {
  INDIVIDUAL = 'individual',
  ORGANIZATION = 'organization',
  PARAPLY = 'paraply'
}

export enum PriceRuleType {
  BASE = 'base',
  DISCOUNT = 'discount',
  SURCHARGE = 'surcharge',
  TIME_BASED = 'time_based'
}

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
        isActive: true,
        createdAt: rule.created_at || '',
        updatedAt: rule.created_at || ''
      }));
    } catch (error) {
      console.error('Error fetching price rules:', error);
      return [];
    }
  }

  static calculateUnitPrice(rules: PriceRule[], date: Date, actorType: ActorType): number {
    const applicableRules = rules.filter(rule => 
      rule.actorType === actorType && rule.isActive
    );

    if (applicableRules.length === 0) {
      return 450; // Default price
    }

    // Return the first matching rule's price
    return applicableRules[0].price;
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
