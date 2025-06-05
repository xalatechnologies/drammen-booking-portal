
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
        <h2 className="text-2xl font-semibold mb-6">Tilgjengelighet per sone</h2>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Se hvilke soner som er tilgjengelige for booking på ulike tidspunkt. 
          Grønne felt viser ledige tider, røde felt viser opptatte tider.
        </p>
        <ZoneAvailabilityTable 
          zones={zones}
          startDate={startDate}
          timeSlots={["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]}
        />
      </div>
    </div>
  );
}
