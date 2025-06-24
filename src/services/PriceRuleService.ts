
import { supabase } from '@/integrations/supabase/client';

export enum PriceRuleType {
  BASE = 'BASE',
  SURCHARGE = 'SURCHARGE', 
  DISCOUNT = 'DISCOUNT',
  OVERRIDE = 'OVERRIDE'
}

export enum ActorType {
  INDIVIDUAL = 'INDIVIDUAL',
  ORGANIZATION = 'ORGANIZATION', 
  PARAPLY = 'PARAPLY'
}

export interface PriceRule {
  id: string;
  locationId?: string;
  zoneId?: string;
  actorType?: ActorType;
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
  static async getPriceRules(locationId?: string, zoneId?: string): Promise<PriceRule[]> {
    let query = supabase
      .from('app_price_rules')
      .select('*')
      .eq('is_active', true);

    if (locationId) {
      query = query.eq('location_id', locationId);
    }
    if (zoneId) {
      query = query.eq('zone_id', zoneId);
    }

    const { data, error } = await query.order('priority', { ascending: true });

    if (error) throw new Error(error.message);
    
    return (data || []).map(rule => ({
      id: rule.id,
      locationId: rule.location_id,
      zoneId: rule.zone_id,
      actorType: rule.actor_type as ActorType,
      type: rule.type as PriceRuleType,
      priority: rule.priority,
      config: rule.config || {},
      price: parseFloat(rule.price.toString()),
      isActive: rule.is_active,
      createdAt: rule.created_at,
      updatedAt: rule.updated_at
    }));
  }

  static calculateUnitPrice(
    rules: PriceRule[],
    bookingDate: Date,
    actorType: ActorType
  ): number {
    const applicable = rules
      .filter(r => r.isActive && this.isRuleApplicable(r, bookingDate, actorType))
      .sort((a, b) => a.priority - b.priority);

    let price = 0;
    for (const rule of applicable) {
      switch (rule.type) {
        case PriceRuleType.BASE:
          price = rule.price;
          break;
        case PriceRuleType.SURCHARGE:
          price = price * (1 + (rule.config.percent ?? 0) / 100);
          break;
        case PriceRuleType.DISCOUNT:
          price = price * (1 - (rule.config.percent ?? 0) / 100);
          break;
        case PriceRuleType.OVERRIDE:
          price = rule.price;
          break;
      }
    }
    return price;
  }

  private static isRuleApplicable(rule: PriceRule, date: Date, actorType: ActorType): boolean {
    // Check actor type match
    if (rule.actorType && rule.actorType !== actorType) {
      return false;
    }

    // Check day of week
    if (rule.config.daysOfWeek && rule.config.daysOfWeek.length > 0) {
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      if (!rule.config.daysOfWeek.includes(dayOfWeek)) {
        return false;
      }
    }

    // Check time of day (simplified - would need more complex logic for real implementation)
    if (rule.config.startTime && rule.config.endTime) {
      const timeStr = date.toTimeString().substring(0, 5); // "HH:MM"
      if (timeStr < rule.config.startTime || timeStr > rule.config.endTime) {
        return false;
      }
    }

    return true;
  }
}
