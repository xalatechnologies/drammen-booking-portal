
import React from "react";
import { Card } from "@/components/ui/card";
import { Users, Clock, CheckCircle } from "lucide-react";
import { useTranslation } from "@/i18n/hooks/useTranslation";

interface FeaturesTabProps {
  capacity: number;
  equipment: string[];
  amenities: string[];
  getAmenityIcon: (amenity: string) => JSX.Element;
}

export function FeaturesTab({ capacity, equipment, amenities, getAmenityIcon }: FeaturesTabProps) {
  const { t } = useTranslation();

  // Filter out Wi-Fi from equipment since it's shown in amenities
  const filteredEquipment = equipment.filter(item => 
    !item.toLowerCase().includes('wi-fi') && !item.toLowerCase().includes('wifi')
  );

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">{t('facility.tabs.features.title')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="font-semibold text-xl mb-4 flex items-center gap-3">
              <Users className="h-6 w-6 text-[#1e3a8a]" />
              {t('facility.tabs.features.capacityAndSize')}
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between">
                <span className="text-gray-700">{t('facility.tabs.features.maxPersons')}:</span>
                <span className="font-semibold">{capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">{t('facility.tabs.features.area')}:</span>
                <span className="font-semibold">120 m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">{t('facility.tabs.features.ceilingHeight')}:</span>
                <span className="font-semibold">6 {t('common.units.meters')}</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold text-xl mb-4 flex items-center gap-3">
              <Clock className="h-6 w-6 text-green-600" />
              {t('facility.tabs.features.openingHours')}
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between">
                <span className="text-gray-700">{t('facility.tabs.features.weekdays')}:</span>
                <span className="font-semibold">06:00 - 23:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">{t('facility.tabs.features.weekends')}:</span>
                <span className="font-semibold">08:00 - 22:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">{t('facility.tabs.features.holidays')}:</span>
                <span className="font-semibold">{t('facility.tabs.features.closed')}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold text-xl mb-4">{t('facility.tabs.features.availableEquipment')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEquipment.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-base font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-xl mb-4">{t('facility.tabs.features.facilitiesAndServices')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {amenities.map((amenity, i) => (
            <div key={i} className="flex items-center gap-3 p-4 bg-[#1e3a8a] bg-opacity-10 rounded-lg">
              {getAmenityIcon(amenity)}
              <span className="text-base font-medium text-[#1e3a8a]">{amenity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
