
import React from "react";
import { MapPin, Clock, Square, Users, CheckCircle } from "lucide-react";
import { Zone } from "@/components/booking/types";
import { FlatAmenitiesGrid } from "../FlatAmenitiesGrid";
import { useTranslation } from "@/i18n";

interface EnhancedAboutTabProps {
  description: string;
  capacity: number;
  address: string;
  openingHours: string;
  area: string;
  zones: Zone[];
  hasAutoApproval: boolean;
  amenities: string[];
}

export function EnhancedAboutTab({
  description,
  capacity,
  address,
  openingHours,
  area,
  zones,
  hasAutoApproval,
  amenities
}: EnhancedAboutTabProps) {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-8">
      {/* Description */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {t('facility.tabs.description', {}, 'About this space')}
        </h3>
        <p className="text-gray-700 text-base leading-relaxed">{description}</p>
      </div>

      {/* Quick Facts */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {t('facility.details.quickFacts', {}, 'Space details')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-gray-700" />
            <span className="text-gray-700 text-base">{capacity} {t('facility.details.guests', {}, 'guests')}</span>
          </div>
          <div className="flex items-center gap-3">
            <Square className="h-6 w-6 text-gray-700" />
            <span className="text-gray-700 text-base">{area}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-gray-700" />
            <span className="text-gray-700 text-base">{address}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-gray-700" />
            <span className="text-gray-700 text-base">{openingHours}</span>
          </div>
        </div>
      </div>

      {/* Amenities */}
      {amenities && amenities.length > 0 && (
        <FlatAmenitiesGrid 
          amenities={amenities} 
          title={t('facility.amenities.available', {}, 'What this place offers')}
          showAll={true}
        />
      )}

      {/* Approval Process */}
      <div className="bg-green-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-semibold text-green-900">
            {hasAutoApproval 
              ? t('facility.booking.instantApproval', {}, 'Instant booking') 
              : t('facility.booking.requiresApproval', {}, 'Requires approval')
            }
          </h3>
        </div>
        <p className="text-green-700 text-base">
          {hasAutoApproval 
            ? t('facility.booking.instantApprovalDesc', {}, 'Book instantly without waiting for approval')
            : t('facility.booking.requiresApprovalDesc', {}, 'Your booking request will be reviewed by our team')
          }
        </p>
      </div>
    </div>
  );
}
