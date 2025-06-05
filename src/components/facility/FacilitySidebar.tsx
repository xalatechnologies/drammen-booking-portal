
import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Users, CheckCircle2, MapPin, Wifi, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ZoneBookingCard } from "./ZoneBookingCard";
import { AutoApprovalCard } from "./AutoApprovalCard";
import { Zone } from "@/components/booking/types";

interface FacilitySidebarProps {
  zones: Zone[];
  facilityName: string;
  facilityId?: string;
  hasAutoApproval: boolean;
  openingHours: string;
  onZoneBookClick?: (zoneId: string) => void;
}

export function FacilitySidebar({ 
  zones, 
  facilityName, 
  facilityId,
  hasAutoApproval, 
  openingHours,
  onZoneBookClick 
}: FacilitySidebarProps) {
  const navigate = useNavigate();

  const handleBookingClick = (zoneId?: string) => {
    const bookingPath = `/booking/${facilityId}${zoneId ? `?zone=${zoneId}` : ''}`;
    navigate(bookingPath);
  };

  return (
    <div className="space-y-6">
      {/* Quick Booking Card */}
      <Card className="border-2 border-blue-100 bg-blue-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Hurtigbestilling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={() => handleBookingClick()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
            size="lg"
          >
            Reserver nå
          </Button>
          <p className="text-sm text-gray-600 text-center">
            Velg din ønskede sone og tid på neste side
          </p>
        </CardContent>
      </Card>

      {/* Auto Approval Info */}
      {hasAutoApproval && <AutoApprovalCard hasAutoApproval={hasAutoApproval} />}

      {/* Zones Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Tilgjengelige soner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {zones.map((zone, index) => (
            <div key={zone.id}>
              <ZoneBookingCard
                zone={zone}
                facilityName={facilityName}
                onBookClick={() => handleBookingClick(zone.id)}
              />
              {index < zones.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Facility Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Praktisk informasjon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Åpningstider</span>
              <span className="text-sm font-medium">{openingHours}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Kapasitet</span>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Opptil 30 personer</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Fasiliteter</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                <Car className="h-3 w-3 mr-1" />
                Parkering
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Wifi className="h-3 w-3 mr-1" />
                Wi-Fi
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Garderober
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Dusjer
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-800">
              <strong>Gratis avbestilling</strong> opptil 24 timer før reservert tid
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
