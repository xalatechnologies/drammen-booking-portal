
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Music, Wifi, Car } from "lucide-react";
import { useTranslation } from '@/i18n';

interface EnhancedFeaturesTabProps {
  amenities: string[];
  equipment: string[];
}

export function EnhancedFeaturesTab({ amenities, equipment }: EnhancedFeaturesTabProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            {t('facility.features.equipment')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {equipment.map((item, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                {item}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            {t('facility.features.amenities')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, index) => (
              <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                {amenity}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
