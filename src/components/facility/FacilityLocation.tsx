
import React from "react";
import MapView from "@/components/MapView";

interface FacilityLocationProps {
  address: string;
}

export function FacilityLocation({ address }: FacilityLocationProps) {
  return (
    <div className="h-full w-full">
      <MapView facilityType="" location={address} />
    </div>
  );
}
