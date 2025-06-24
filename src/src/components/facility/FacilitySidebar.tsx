
import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, MapPin, Users, Map, Clock, CheckCircle, XCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AutoApprovalCard } from "./AutoApprovalCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface FacilitySidebarProps {
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

export function FacilitySidebar({
  facilityName,
  facilityId,
  hasAutoApproval,
  openingHours,
  capacity,
  area,
  zoneCount
}: FacilitySidebarProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  const translations = {
    NO: {
      reserveNow: "Reserver nå",
      capacity: "Kapasitet",
      area: "Areal (m²)",
      open: "Åpent",
      zones: "Soner",
      suitableFor: "Egnet for",
      sports: "Idrett",
      training: "Trening", 
      events: "Arrangementer",
      groups: "Grupper",
      freeCancellation: "Gratis avbestilling",
      cancellationPolicy: "Opptil 24 timer før reservert tid"
    },
    EN: {
      reserveNow: "Reserve now",
      capacity: "Capacity",
      area: "Area (m²)",
      open: "Open",
      zones: "Zones",
      suitableFor: "Suitable for",
      sports: "Sports",
      training: "Training",
      events: "Events", 
      groups: "Groups",
      freeCancellation: "Free cancellation",
      cancellationPolicy: "Up to 24 hours before reserved time"
    }
  };
  
  const t = translations[language];

  const handleBookingClick = () => {
    const bookingPath = `/booking/${facilityId}`;
    navigate(bookingPath);
  };

  return (
    <div className="space-y-4">
      {/* Main Booking Button - Full width and prominent */}
      <Button 
        onClick={handleBookingClick}
        className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-medium text-base h-12 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {t.reserveNow}
      </Button>

      {/* Enhanced Quick Facts */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.capacity}</p>
                <p className="text-lg font-bold text-gray-900">{capacity}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border">
              <div className="p-2 bg-green-100 rounded-full">
                <Map className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.area}</p>
                <p className="text-lg font-bold text-gray-900">{area}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border">
              <div className="p-2 bg-purple-100 rounded-full">
                <Clock className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.open}</p>
                <p className="text-sm font-bold text-gray-900">06:00-23:00</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border">
              <div className="p-2 bg-emerald-100 rounded-full">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.zones}</p>
                <p className="text-lg font-bold text-emerald-600">{zoneCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suitable For Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="h-5 w-5" />
            {t.suitableFor}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t.sports}</Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t.training}</Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">{t.events}</Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">{t.groups}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Auto Approval Policy Card */}
      {hasAutoApproval && <AutoApprovalCard hasAutoApproval={hasAutoApproval} />}

      {/* Cancellation Policy Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-md">
              <XCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-medium text-emerald-800">
                {t.freeCancellation}
              </h3>
              <p className="text-sm text-emerald-700">
                {t.cancellationPolicy}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
