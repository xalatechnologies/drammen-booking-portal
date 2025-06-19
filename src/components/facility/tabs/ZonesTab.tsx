
import React from "react";
import { MapPin, Users, CreditCard } from "lucide-react";
import { Zone } from "@/components/booking/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FlatAmenitiesGrid } from "../FlatAmenitiesGrid";
import { useTranslation } from "@/i18n";
import { useNavigate } from "react-router-dom";

interface ZonesTabProps {
  zones: Zone[];
  facilityId?: string;
}

export function ZonesTab({ zones, facilityId }: ZonesTabProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBookZone = (zoneId: string) => {
    navigate(`/booking/${facilityId}?zone=${zoneId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {t('facility.zones.title', {}, 'Tilgjengelige soner')}
        </h3>
        <p className="text-gray-600 mb-6">
          {t('facility.zones.description', {}, 'Dette lokalet kan bookes som helhet eller i separate soner avhengig av dine behov.')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {zones.map((zone) => (
          <Card key={zone.id} className="border border-gray-200 hover:border-blue-300 transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {zone.name}
                  </CardTitle>
                  {zone.isMainZone && (
                    <Badge className="mt-2 bg-blue-100 text-blue-800 border-blue-200">
                      {t('facility.zones.mainZone', {}, 'Hovedsone')}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {zone.pricePerHour} kr
                  </div>
                  <div className="text-sm text-gray-500">
                    {t('facility.zones.perHour', {}, 'per time')}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-base leading-relaxed">
                {zone.description}
              </p>

              {/* Zone Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{zone.capacity} plasser</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{zone.area}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700">
                    Min {zone.bookingRules?.minBookingDuration || 1}t booking
                  </span>
                </div>
              </div>

              {/* Equipment */}
              {zone.equipment && zone.equipment.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    {t('facility.zones.equipment', {}, 'Utstyr inkludert')}
                  </h4>
                  <FlatAmenitiesGrid 
                    amenities={zone.equipment} 
                    title=""
                    showAll={false}
                    maxItems={6}
                  />
                </div>
              )}

              {/* Accessibility */}
              {zone.accessibility && zone.accessibility.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    {t('facility.zones.accessibility', {}, 'Tilgjengelighet')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {zone.accessibility.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <Button 
                  onClick={() => handleBookZone(zone.id)}
                  className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
                >
                  {t('facility.zones.book', {}, 'Book denne sonen')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
