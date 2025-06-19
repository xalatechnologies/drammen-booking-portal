
import React from "react";
import { MapPin, Clock, Square, Users } from "lucide-react";
import { Zone } from "@/components/booking/types";
import { FlatAmenitiesGrid } from "../FlatAmenitiesGrid";
import { FacilityLocation } from "../FacilityLocation";
import { AvailabilityTab } from "./AvailabilityTab";
import { useTranslation } from "@/i18n";
import { SelectedTimeSlot } from "@/utils/recurrenceEngine";

interface GeneralInfoTabProps {
  description: string;
  capacity: number;
  address: string;
  area: string;
  suitableFor: string[];
  zones: Zone[];
  facilityId?: string;
  facilityName?: string;
  openingHours?: string;
}

export function GeneralInfoTab({
  description,
  capacity,
  address,
  area,
  suitableFor,
  zones,
  facilityId = "",
  facilityName = "",
  openingHours = "08:00-22:00"
}: GeneralInfoTabProps) {
  const { t } = useTranslation();
  const [selectedSlots, setSelectedSlots] = React.useState<SelectedTimeSlot[]>([]);

  return (
    <div className="p-6 space-y-8">
      {/* Basic Description */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {t('facility.tabs.description', {}, 'Om dette lokalet')}
        </h3>
        <p className="text-gray-700 text-base leading-relaxed">{description}</p>
      </div>

      {/* Suitable For Section */}
      {suitableFor && suitableFor.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {t('facility.suitableFor', {}, 'Egnet for')}
          </h3>
          <FlatAmenitiesGrid 
            amenities={suitableFor} 
            title=""
            showAll={true}
          />
        </div>
      )}

      {/* Quick Facts */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {t('facility.details.quickFacts', {}, 'Grunnleggende informasjon')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-gray-700" />
            <span className="text-gray-700 text-base">{capacity} {t('facility.details.guests', {}, 'plasser')}</span>
          </div>
          <div className="flex items-center gap-3">
            <Square className="h-6 w-6 text-gray-700" />
            <span className="text-gray-700 text-base">{area}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-gray-700" />
            <span className="text-gray-700 text-base">{openingHours}</span>
          </div>
          <div className="flex items-center gap-3 md:col-span-1">
            <MapPin className="h-6 w-6 text-gray-700" />
            <span className="text-gray-700 text-base">{address}</span>
          </div>
        </div>
      </div>

      {/* Location Map */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {t('facility.location.title', {}, 'Lokasjon')}
        </h3>
        <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
          <FacilityLocation address={address} />
        </div>
      </div>

      {/* Calendar Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {t('facility.booking.availability', {}, 'Tilgjengelighet og booking')}
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <AvailabilityTab 
            zones={zones} 
            facilityId={facilityId}
            facilityName={facilityName}
            selectedSlots={selectedSlots}
            onSlotsChange={setSelectedSlots}
          />
        </div>
      </div>
    </div>
  );
}
