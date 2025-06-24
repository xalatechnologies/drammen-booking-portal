
import React from "react";
import { FlatAmenitiesGrid } from "../FlatAmenitiesGrid";
import { useTranslation } from "@/i18n";

interface FeaturesTabProps {
  capacity: number;
  equipment: string[];
  amenities: string[];
  getAmenityIcon: (amenity: string) => JSX.Element;
}

export function FeaturesTab({ capacity, equipment, amenities }: FeaturesTabProps) {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-8">
      {/* Equipment Section */}
      {equipment && equipment.length > 0 && (
        <FlatAmenitiesGrid 
          amenities={equipment} 
          title={t('facility.amenities.equipment', {}, 'Equipment & Technology')}
          showAll={true}
        />
      )}

      {/* General Amenities Section */}
      {amenities && amenities.length > 0 && (
        <FlatAmenitiesGrid 
          amenities={amenities} 
          title={t('facility.amenities.general', {}, 'General Amenities')}
          showAll={true}
        />
      )}

      {/* Capacity Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t('facility.details.capacity', {}, 'Capacity')}
        </h3>
        <p className="text-gray-700 text-base">
          {t('facility.details.accommodates', { count: capacity }, `Accommodates up to ${capacity} people`)}
        </p>
      </div>
    </div>
  );
}
