
import React from "react";
import { Heart, Share2, Info, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ZoneBookingCard } from "./ZoneBookingCard";
import { AutoApprovalCard } from "./AutoApprovalCard";
import { Zone } from "@/components/booking/types";

interface FacilitySidebarProps {
  zones: Zone[];
  facilityName: string;
  hasAutoApproval: boolean;
  openingHours: string;
  onZoneBookClick: (zoneId: string) => void;
  onShare: () => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}

export function FacilitySidebar({
  zones,
  facilityName,
  hasAutoApproval,
  openingHours,
  onZoneBookClick,
  onShare,
  isFavorited,
  onToggleFavorite,
}: FacilitySidebarProps) {
  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="space-y-6 pr-2">
          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={onToggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Zone booking cards */}
          {zones.map((zone) => (
            <ZoneBookingCard
              key={zone.id}
              zone={zone}
              facilityName={facilityName}
              onBookClick={onZoneBookClick}
            />
          ))}
          
          <AutoApprovalCard hasAutoApproval={hasAutoApproval} />
          
          {/* Additional info cards */}
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-md">
                  <Info className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-medium">Avbestilling</h3>
                  <p className="text-sm text-gray-600">
                    Gratis avbestilling inntil 48 timer før
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-md">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Åpningstider</h3>
                  <p className="text-sm text-gray-600">
                    {openingHours}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
