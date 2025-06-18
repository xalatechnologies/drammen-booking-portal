
import React, { useState } from "react";
import { CheckCircle, Info, Clock, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FacilityBookingCardProps {
  facility: {
    id: string | undefined;
    name: string;
    pricePerHour: number;
    openingHours: string;
  };
  onBookClick: () => void;
}

export function FacilityBookingCard({ facility, onBookClick }: FacilityBookingCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: facility.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      {/* Action buttons */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-purple-50"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-navy-500'}`} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="hover:bg-purple-50"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 text-navy-500" />
        </Button>
      </div>

      {/* Price Card */}
      <Card className="mb-6 glass border-0 shadow-medium">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-navy-900">{facility.pricePerHour} kr</div>
            <div className="text-navy-500">per time</div>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg mb-4 text-center border border-green-100">
            <p className="text-green-800 text-sm">
              <CheckCircle className="inline h-4 w-4 mr-1" />
              Tilgjengelig for umiddelbar booking
            </p>
          </div>

          <Button 
            className="w-full bg-gradient-primary hover:opacity-90 text-white font-medium shadow-medium h-12 transition-all duration-200"
            onClick={onBookClick}
          >
            Reserver nå
          </Button>
        </CardContent>
      </Card>
      
      {/* Additional info cards */}
      <Card className="mb-6 glass border-0 shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-md">
              <Info className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-navy-900">Avbestilling</h3>
              <p className="text-sm text-navy-600">
                Gratis avbestilling inntil 48 timer før
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass border-0 shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-md">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-navy-900">Åpningstider</h3>
              <p className="text-sm text-navy-600">
                {facility.openingHours}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
