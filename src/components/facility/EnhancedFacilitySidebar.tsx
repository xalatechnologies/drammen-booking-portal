
import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, MapPin, Users, Map, Share2, Heart, Clock, CheckCircle, XCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AutoApprovalCard } from "./AutoApprovalCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface EnhancedFacilitySidebarProps {
  facilityName: string;
  facilityId?: string;
  hasAutoApproval: boolean;
  openingHours: string;
  capacity: number;
  area: string;
  zoneCount: number;
  onShare?: () => void;
  onToggleFavorite?: () => void;
  isFavorited?: boolean;
}

export function EnhancedFacilitySidebar({
  facilityName,
  facilityId,
  hasAutoApproval,
  openingHours,
  capacity,
  area,
  zoneCount,
  onShare,
  onToggleFavorite,
  isFavorited = false
}: EnhancedFacilitySidebarProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const translations = {
    NO: {
      capacity: "Kapasitet",
      area: "Areal",
      open: "Åpent",
      zones: "Soner",
      reserveNow: "Reserver nå",
      suitableFor: "Egnet for",
      freeCancellation: "Gratis avbestilling",
      upTo24Hours: "Opptil 24 timer før reservert tid"
    },
    EN: {
      capacity: "Capacity",
      area: "Area",
      open: "Open",
      zones: "Zones",
      reserveNow: "Reserve now",
      suitableFor: "Suitable for",
      freeCancellation: "Free cancellation",
      upTo24Hours: "Up to 24 hours before reserved time"
    }
  };
  
  const t = translations[language];

  const handleBookingClick = () => {
    const bookingPath = `/booking/${facilityId}`;
    navigate(bookingPath);
  };

  return (
    <div className="w-96 space-y-6 p-6 bg-gray-50/50">
      {/* Action buttons - Larger and more prominent */}
      <div className="flex gap-3">
        <Button 
          onClick={handleBookingClick}
          className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-semibold text-lg h-14 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {t.reserveNow}
        </Button>
        <Button
          variant="outline"
          onClick={onToggleFavorite}
          className="px-4 h-14 border-2 hover:bg-red-50"
        >
          <Heart className={`h-6 w-6 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </Button>
        <Button
          variant="outline"
          onClick={onShare}
          className="px-4 h-14 border-2 hover:bg-blue-50"
        >
          <Share2 className="h-6 w-6 text-gray-600" />
        </Button>
      </div>

      {/* Enhanced Quick Facts with better spacing */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-800">Hurtigfakta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t.capacity}</p>
                <p className="text-xl font-bold text-gray-900">{capacity}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-3 bg-green-100 rounded-full">
                <Map className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t.area}</p>
                <p className="text-xl font-bold text-gray-900">{area}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t.open}</p>
                <p className="text-base font-bold text-gray-900">06:00-23:00</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-3 bg-emerald-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t.zones}</p>
                <p className="text-xl font-bold text-emerald-600">{zoneCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suitable For Card with better styling */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Tag className="h-5 w-5 text-orange-600" />
            </div>
            {t.suitableFor}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5 text-sm font-medium">
              Idrett
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1.5 text-sm font-medium">
              Trening
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1.5 text-sm font-medium">
              Arrangementer
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1.5 text-sm font-medium">
              Grupper
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Auto Approval Policy Card */}
      {hasAutoApproval && <AutoApprovalCard hasAutoApproval={hasAutoApproval} />}

      {/* Enhanced Cancellation Policy Card */}
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-800 text-lg mb-1">
                {t.freeCancellation}
              </h3>
              <p className="text-sm text-emerald-700 leading-relaxed">
                {t.upTo24Hours}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
