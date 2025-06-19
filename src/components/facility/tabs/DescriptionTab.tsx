
import React from "react";
import { FacilityLocation } from "../FacilityLocation";
import { useTranslation } from "@/i18n/hooks/useTranslation";

interface DescriptionTabProps {
  description: string;
  capacity: number;
  address: string;
}

export function DescriptionTab({ description, capacity, address }: DescriptionTabProps) {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6">
      {/* Description only */}
      <div>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* Location Map */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('facility.details.location')}</h3>
        <div className="h-64 rounded-lg overflow-hidden border">
          <FacilityLocation address={address} />
        </div>
      </div>
    </div>
  );
}
