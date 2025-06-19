
import React from "react";
import { MapPin, Clock, Square, Users, CheckCircle } from "lucide-react";
import { Zone } from "@/components/booking/types";
import { FlatAmenitiesGrid } from "../FlatAmenitiesGrid";
import { useLanguage } from "@/contexts/LanguageContext";

interface GeneralInfoTabProps {
  description: string;
  capacity: number;
  address: string;
  area: string;
  suitableFor: string[];
  zones: Zone[];
  facilityId?: string;
  facilityName?: string;
}

export function GeneralInfoTab({
  description,
  capacity,
  address,
  area,
  suitableFor,
  zones
}: GeneralInfoTabProps) {
  const { language } = useLanguage();

  const translations = {
    NO: {
      description: "Om dette lokalet",
      quickFacts: "Nøkkelinformasjon",
      guests: "gjester",
      suitableFor: "Egnet for",
      instantApproval: "Øyeblikkelig godkjenning",
      requiresApproval: "Krever godkjenning",
      instantApprovalDesc: "Book øyeblikkelig uten å vente på godkjenning",
      requiresApprovalDesc: "Din booking vil bli vurdert av vårt team"
    },
    EN: {
      description: "About this space",
      quickFacts: "Space details",
      guests: "guests",
      suitableFor: "Suitable for",
      instantApproval: "Instant booking",
      requiresApproval: "Requires approval",
      instantApprovalDesc: "Book instantly without waiting for approval",
      requiresApprovalDesc: "Your booking request will be reviewed by our team"
    }
  };

  const t = translations[language];
  const hasAutoApproval = true; // Default to auto approval

  return (
    <div className="p-6 space-y-8">
      {/* Description */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {t.description}
        </h3>
        <p className="text-gray-700 text-base leading-relaxed">{description}</p>
      </div>

      {/* Quick Facts */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {t.quickFacts}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-gray-700" />
            <span className="text-gray-700 text-base">{capacity} {t.guests}</span>
          </div>
          <div className="flex items-center gap-3">
            <Square className="h-6 w-6 text-gray-700" />
            <span className="text-gray-700 text-base">{area}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-gray-700" />
            <span className="text-gray-700 text-base">{address}</span>
          </div>
        </div>
      </div>

      {/* Suitable For Section */}
      {suitableFor && suitableFor.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {t.suitableFor}
          </h3>
          <div className="flex flex-wrap gap-2">
            {suitableFor.map((activity, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm border border-blue-200"
              >
                {activity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Approval Process */}
      <div className="bg-green-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-semibold text-green-900">
            {hasAutoApproval ? t.instantApproval : t.requiresApproval}
          </h3>
        </div>
        <p className="text-green-700 text-base">
          {hasAutoApproval ? t.instantApprovalDesc : t.requiresApprovalDesc}
        </p>
      </div>
    </div>
  );
}
