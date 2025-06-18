
import React from "react";
import { AvailabilityTab } from "./AvailabilityTab";
import { FacilityLocation } from "../FacilityLocation";
import { Zone } from "@/components/booking/types";

interface DescriptionTabProps {
  description: string;
  capacity: number;
  address: string;
  zones?: Zone[];
}

export function DescriptionTab({ description, capacity, address, zones = [] }: DescriptionTabProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Description only */}
      <div>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* Availability Calendar */}
      {zones.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <AvailabilityTab zones={zones} startDate={new Date()} showLegend={false} />
          
          {/* Legends moved here */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-green-100 border border-green-200"></div>
                <span>Ledig</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-red-100 border border-red-200"></div>
                <span>Opptatt</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-red-200 border border-red-300"></div>
                <span>Hele lokalet</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-amber-100 border border-amber-200"></div>
                <span>Helg/begrenset</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-gray-200 border border-gray-300"></div>
                <span>Utilgjengelig</span>
              </div>
            </div>
          </div>
          
          {/* Location Map */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="h-64 rounded-lg overflow-hidden border">
              <FacilityLocation address={address} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
