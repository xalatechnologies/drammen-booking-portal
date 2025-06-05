
import React from "react";
import { ZoneAvailabilityTable } from "@/components/facility/ZoneAvailabilityTable";
import { Zone } from "@/components/booking/types";

interface AvailabilityTabProps {
  zones: Zone[];
  startDate: Date;
}

export function AvailabilityTab({ zones, startDate }: AvailabilityTabProps) {
  return (
    <div className="p-6">
      <div>
        <h2 className="text-xl font-medium mb-4">Tilgjengelighet per sone</h2>
        <ZoneAvailabilityTable 
          zones={zones}
          startDate={startDate}
          timeSlots={["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]}
        />
      </div>
    </div>
  );
}
