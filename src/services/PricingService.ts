
import { supabase } from "@/integrations/supabase/client";
import { ActorType } from "@/types/pricing";

export class PricingService {
  static async calculatePrice(
    locationId: string,
    actorType: ActorType,
    startDateTime: Date,
    endDateTime: Date,
    attendees: number = 1
  ): Promise<number> {
    try {
      // Get base price rules for the location
      const { data: priceRules, error } = await supabase
        .from('app_price_rules')
        .select('*')
        .eq('location_id', locationId)
        .eq('actor_type', actorType)
        .order('priority', { ascending: true });

      if (error) throw new Error(error.message);

      let basePrice = 450; // Default price per hour

      // Apply the first matching price rule
      if (priceRules && priceRules.length > 0) {
        basePrice = priceRules[0].price;
      }

      // Calculate duration in hours
      const durationMs = endDateTime.getTime() - startDateTime.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);

      return basePrice * durationHours;
    } catch (error) {
      console.error('Error calculating price:', error);
      return 450; // Fallback price
    }
  }

  static async getBasePriceForLocation(locationId: string, actorType: ActorType): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('app_price_rules')
        .select('price')
        .eq('location_id', locationId)
        .eq('actor_type', actorType)
        .order('priority', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw new Error(error.message);

      return data?.price || 450;
    } catch (error) {
      console.error('Error getting base price:', error);
      return 450;
    }
  }
}
