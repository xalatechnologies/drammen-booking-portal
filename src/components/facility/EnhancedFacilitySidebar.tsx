import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, MapPin, Users, Map, Share2, Heart, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ZoneBookingCard } from "./ZoneBookingCard";
import { AutoApprovalCard } from "./AutoApprovalCard";
import { Zone } from "@/components/booking/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface EnhancedFacilitySidebarProps {
  zones: Zone[];
  facilityName: string;
  facilityId?: string;
  hasAutoApproval: boolean;
  openingHours: string;
  capacity: number;
  area: string;
  zoneCount: number;
  onZoneBookClick?: (zoneId: string) => void;
  onShare?: () => void;
  onToggleFavorite?: () => void;
  isFavorited?: boolean;
}

export function EnhancedFacilitySidebar({
  zones,
  facilityName,
  facilityId,
  hasAutoApproval,
  openingHours,
  capacity,
  area,
  zoneCount,
  onZoneBookClick,
  onShare,
  onToggleFavorite,
  isFavorited = false
}: EnhancedFacilitySidebarProps) {
  const navigate = useNavigate();
  const {
    language
  } = useLanguage();
  const translations = {
    NO: {
      capacity: "Kapasitet",
      area: "Areal",
      open: "Åpent",
      zones: "Soner"
    },
    EN: {
      capacity: "Capacity",
      area: "Area",
      open: "Open",
      zones: "Zones"
    }
  };
  const t = translations[language];
  const handleBookingClick = (zoneId?: string) => {
    const bookingPath = `/booking/${facilityId}${zoneId ? `?zone=${zoneId}` : ''}`;
    navigate(bookingPath);
  };
  return <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={() => handleBookingClick()} className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white" size="lg">
          Reserver nå
        </Button>
        <Button variant="outline" size="lg" onClick={onToggleFavorite} className="px-3">
          <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        <Button variant="outline" size="lg" onClick={onShare} className="px-3">
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Enhanced Quick Facts */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          
        </CardHeader>
        <CardContent className="space-y-4">
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

      {/* Zones Section - Individual Cards */}
      {zones.map(zone => <Card key={zone.id}>
          <CardContent className="p-0">
            <ZoneBookingCard zone={zone} facilityName={facilityName} onBookClick={() => handleBookingClick(zone.id)} />
          </CardContent>
        </Card>)}

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
                Gratis avbestilling
              </h3>
              <p className="text-sm text-emerald-700">
                Opptil 24 timer før reservert tid
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
}
