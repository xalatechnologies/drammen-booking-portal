
import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, MapPin, Users, Map, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ZoneBookingCard } from "./ZoneBookingCard";
import { AutoApprovalCard } from "./AutoApprovalCard";
import { Zone } from "@/components/booking/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface FacilitySidebarProps {
  zones: Zone[];
  facilityName: string;
  facilityId?: string;
  hasAutoApproval: boolean;
  openingHours: string;
  onZoneBookClick?: (zoneId: string) => void;
  onShare?: () => void;
  onToggleFavorite?: () => void;
  isFavorited?: boolean;
}

export function FacilitySidebar({ 
  zones, 
  facilityName, 
  facilityId,
  hasAutoApproval, 
  openingHours,
  onZoneBookClick,
  onShare,
  onToggleFavorite,
  isFavorited = false
}: FacilitySidebarProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const translations = {
    NO: {
      reserveNow: "Reserver nå",
      availableZones: "Tilgjengelige soner",
      freeCancellation: "Gratis avbestilling",
      cancellationPolicy: "opptil 24 timer før reservert tid"
    },
    EN: {
      reserveNow: "Reserve now",
      availableZones: "Available zones",
      freeCancellation: "Free cancellation",
      cancellationPolicy: "up to 24 hours before reserved time"
    }
  };

  const t = translations[language];

  const handleBookingClick = (zoneId?: string) => {
    const bookingPath = `/booking/${facilityId}${zoneId ? `?zone=${zoneId}` : ''}`;
    navigate(bookingPath);
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          onClick={() => handleBookingClick()}
          className="flex-1 bg-[#1e3a8a] hover:bg-[#1e40af] text-white"
          size="lg"
        >
          {t.reserveNow}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onToggleFavorite}
          className="px-3"
        >
          <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onShare}
          className="px-3"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Auto Approval Info */}
      {hasAutoApproval && <AutoApprovalCard hasAutoApproval={hasAutoApproval} />}

      {/* Zones Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            {t.availableZones}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {zones.map((zone, index) => (
            <div key={zone.id}>
              <ZoneBookingCard
                zone={zone}
                facilityName={facilityName}
                onBookClick={() => handleBookingClick(zone.id)}
              />
              {index < zones.length - 1 && <Separator className="my-3" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Cancellation Policy */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-xs text-green-800">
          <strong>{t.freeCancellation}</strong> {t.cancellationPolicy}
        </p>
      </div>
    </div>
  );
}
