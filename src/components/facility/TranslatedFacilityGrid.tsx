
import React from "react";
import { useTranslatedFacilities } from "@/hooks/useTranslatedFacilities";
import { TranslatedFacilityCard } from "./TranslatedFacilityCard";

export const TranslatedFacilityGrid = () => {
  const { data: response, isLoading, error } = useTranslatedFacilities();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load facilities</p>
      </div>
    );
  }

  const facilities = response?.data || [];

  if (facilities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No facilities found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {facilities.map((facility: any) => (
        <TranslatedFacilityCard key={facility.id} facility={facility} />
      ))}
    </div>
  );
};
