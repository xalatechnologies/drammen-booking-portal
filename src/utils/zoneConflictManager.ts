
import { Zone } from "@/components/booking/types";
import { RecommendationEngine } from "./conflict/recommendationEngine";
import type { ExistingBooking } from "./conflict/types";

export type { ExistingBooking } from "./conflict/types";

export class ZoneConflictManager extends RecommendationEngine {
  constructor(zones: Zone[], existingBookings: ExistingBooking[] = []) {
    super(zones, existingBookings);
  }
}
