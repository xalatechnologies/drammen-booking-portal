
import { Zone } from "@/components/booking/types";
import { RecommendationEngine } from "./conflict/recommendationEngine";
import { ExistingBooking } from "./conflict/types";

export { ExistingBooking } from "./conflict/types";

export class ZoneConflictManager extends RecommendationEngine {
  protected zones: Zone[];
  private existingBookings: ExistingBooking[];

  constructor(zones: Zone[], existingBookings: ExistingBooking[] = []) {
    super(zones, existingBookings);
    this.zones = zones;
    this.existingBookings = existingBookings;
  }
}
