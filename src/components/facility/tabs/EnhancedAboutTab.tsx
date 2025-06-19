
import React from "react";
import { MapPin, Users, Clock, CheckCircle, Tag, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zone } from "@/components/booking/types";
import { useTranslation } from "@/i18n/hooks/useTranslation";

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
    <div className="p-6 space-y-6">
      {/* Description */}
      <div>
        <h3 className="text-xl font-semibold mb-3">{t('facility.description')}</h3>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </div>

      {/* Key Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('facility.capacity')}</p>
                <p className="text-lg font-semibold">{capacity} {t('common.people')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('facility.area')}</p>
                <p className="text-lg font-semibold">{area}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('facility.openingHours')}</p>
                <p className="text-lg font-semibold">{openingHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{t('facility.zones')}</p>
                <p className="text-lg font-semibold">{zones.length} {t('common.zones')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auto Approval Status */}
      {hasAutoApproval && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">{t('facility.autoApproval')}</h4>
                <p className="text-sm text-green-700">{t('facility.autoApprovalDescription')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Zones Information */}
      <div>
        <h3 className="text-xl font-semibold mb-4">{t('facility.availableZones')}</h3>
        <div className="space-y-3">
          {zones.map((zone) => (
            <Card key={zone.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <h4 className="font-medium text-lg mb-2">{zone.name}</h4>
                <p className="text-gray-600 text-sm mb-3">{zone.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">
                    {zone.capacity} {t('common.people')}
                  </Badge>
                  <Badge variant="outline">
                    {zone.area} m²
                  </Badge>
                  <Badge variant="outline">
                    {zone.pricePerHour} kr/{t('common.hour')}
                  </Badge>
                </div>
                {zone.equipment && zone.equipment.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">{t('facility.equipment')}:</p>
                    <div className="flex flex-wrap gap-1">
                      {zone.equipment.map((item, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Suitable For */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Tag className="h-5 w-5" />
          {t('facility.suitableFor')}
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {t('common.activities.sports')}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {t('common.activities.training')}
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {t('common.activities.events')}
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {t('common.activities.groups')}
          </Badge>
        </div>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t('facility.contactInformation')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{openingHours}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
