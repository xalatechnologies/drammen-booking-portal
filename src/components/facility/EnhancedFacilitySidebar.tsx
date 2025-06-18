
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

  const handleBookingClick = () => {
    const bookingPath = `/booking/${facilityId}`;
    navigate(bookingPath);
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons - Match tab button height and font size */}
      <div className="flex gap-2 mb-6">
        <Button 
          onClick={handleBookingClick}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base h-auto py-4 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all duration-300 hover:shadow-xl hover:shadow-blue-300"
        >
          Reserver nå
        </Button>
        <Button
          variant="outline"
          onClick={onToggleFavorite}
          className="px-4 h-auto py-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
        >
          <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
        </Button>
        <Button
          variant="outline"
          onClick={onShare}
          className="px-4 h-auto py-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
        >
          <Share2 className="h-5 w-5 text-gray-700" />
        </Button>
      </div>

      {/* Enhanced Quick Facts */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 rounded-xl overflow-hidden shadow-md">
        <CardContent className="space-y-5 pt-6 pb-6">
          <div className="grid grid-cols-2 gap-5">
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-blue-50">
              <div className="p-2.5 bg-blue-100 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t.capacity}</p>
                <p className="text-xl font-bold text-gray-900">{capacity}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-blue-50">
              <div className="p-2.5 bg-green-100 rounded-full">
                <Map className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t.area}</p>
                <p className="text-xl font-bold text-gray-900">{area}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-blue-50">
              <div className="p-2.5 bg-purple-100 rounded-full">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t.open}</p>
                <p className="text-base font-bold text-gray-900">06:00-23:00</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-blue-50">
              <div className="p-2.5 bg-emerald-100 rounded-full">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t.zones}</p>
                <p className="text-xl font-bold text-emerald-600">{zoneCount}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suitable For Card */}
      <Card className="rounded-xl border-gray-100 shadow-md overflow-hidden">
        <CardHeader className="pb-3 bg-gray-50 border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
            <Tag className="h-5 w-5 text-blue-600" />
            Egnet for
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 rounded-full text-sm">Idrett</Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1 rounded-full text-sm">Trening</Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1 rounded-full text-sm">Arrangementer</Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1 rounded-full text-sm">Grupper</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Auto Approval Policy Card */}
      {hasAutoApproval && <AutoApprovalCard hasAutoApproval={hasAutoApproval} />}

      {/* Cancellation Policy Card */}
      <Card className="rounded-xl border-gray-100 shadow-md overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <XCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-800 text-lg">
                Gratis avbestilling
              </h3>
              <p className="text-base text-emerald-700">
                Opptil 24 timer før reservert tid
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
