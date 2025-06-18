
import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n";

interface Facility {
  id: number;
  name: string;
  address: string;
  type: string;
  image: string;
  nextAvailable: string;
  capacity: number;
  accessibility: string[];
  area: string;
  suitableFor: string[];
  equipment: string[];
  openingHours: string;
  description: string;
  availableTimes?: {
    date: Date;
    slots: {
      start: string;
      end: string;
      available: boolean;
    }[];
  }[];
}

interface FacilityCardProps {
  facility: Facility;
  onAddressClick: (e: React.MouseEvent, facility: Facility) => void;
}

export function FacilityCard({ facility, onAddressClick }: FacilityCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px] group border border-gray-200 flex flex-col cursor-pointer"
      onClick={() => navigate(`/facilities/${facility.id}`)}
    >
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        <img 
          src={facility.image} 
          alt={facility.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1525361147853-4bf9f54a0e98?w=600&auto=format&fit=crop";
            target.onerror = null;
          }}
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 border-0 font-medium px-2.5 py-1 shadow-sm text-sm">
            {t(`facility.types.${facility.type}`, {}, facility.type)}
          </Badge>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-gray-700 border-gray-200 font-medium px-2.5 py-1 shadow-sm text-sm">
            {facility.area}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5 flex flex-col flex-grow">
        {/* Header */}
        <div className="mb-4">
          <h3 className="font-bold text-xl mb-3 text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {facility.name}
          </h3>
          <div className="flex items-start gap-1.5 text-base text-gray-600 mb-3">
            <MapPin className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
            <span 
              className="line-clamp-1 hover:text-blue-600 hover:underline cursor-pointer transition-colors"
              onClick={(e) => onAddressClick(e, facility)}
              title={t('facility.details.shareText')}
            >
              {facility.address}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed line-clamp-2 text-base">
            {facility.description}
          </p>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-2 text-base text-gray-600 mb-4">
          <Users className="h-5 w-5 text-gray-500" />
          <span>{t('facility.details.capacity')}: {facility.capacity} personer</span>
        </div>

        {/* Suitable For */}
        <div className="space-y-3 flex-grow">
          <div className="flex items-center text-gray-700">
            <span className="font-semibold text-base">{t('facility.details.suitableFor')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {facility.suitableFor.slice(0, 3).map((activity, index) => (
              <Badge
                key={index}
                className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-3 py-1.5 text-sm hover:bg-blue-100 transition-colors"
              >
                {activity}
              </Badge>
            ))}
            {facility.suitableFor.length > 3 && (
              <Badge 
                variant="outline" 
                className="bg-gray-50 text-gray-600 border-gray-300 font-medium px-3 py-1.5 text-sm"
              >
                +{facility.suitableFor.length - 3} flere
              </Badge>
            )}
          </div>
        </div>

        {/* Next Available */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-sm font-medium text-green-800 mb-1">{t('facility.details.nextAvailable')}</div>
            <div className="text-lg font-bold text-green-700">{facility.nextAvailable}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
