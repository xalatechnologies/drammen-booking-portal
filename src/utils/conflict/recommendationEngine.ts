
import { Zone } from "@/components/booking/types";
import { AvailabilityUtils } from "./availabilityUtils";
import { ExistingBooking } from "./types";

export class RecommendationEngine extends AvailabilityUtils {
  constructor(zones: Zone[], existingBookings: ExistingBooking[]) {
    super(zones, existingBookings);
  }

  /**
   * Get booking recommendations based on requirements
   */
  getBookingRecommendations(
    requiredCapacity: number,
    preferredEquipment: string[],
    date: Date,
    timeSlot: string
  ): Zone[] {
    const availabilityStatuses = this.getZoneAvailabilityStatus(date, timeSlot);
    
    return this.zones
      .filter(zone => {
        const status = availabilityStatuses.find(s => s.zoneId === zone.id);
        return (
          status?.isAvailable &&
          zone.capacity >= requiredCapacity &&
          zone.isActive
        );
      })
      .sort((a, b) => {
        // Score zones based on equipment match and efficiency
        const aEquipmentScore = preferredEquipment.filter(eq => a.equipment.includes(eq)).length;
        const bEquipmentScore = preferredEquipment.filter(eq => b.equipment.includes(eq)).length;
        
        if (aEquipmentScore !== bEquipmentScore) {
          return bEquipmentScore - aEquipmentScore;
        }
        
        // Prefer zones that are closer to required capacity (more efficient)
        const aEfficiency = Math.abs(a.capacity - requiredCapacity);
        const bEfficiency = Math.abs(b.capacity - requiredCapacity);
        
        return aEfficiency - bEfficiency;
      });
  }
}
