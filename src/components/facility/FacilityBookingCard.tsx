
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
      <div className="flex items-center justify-end gap-sm mb-lg">
        <Button
          variant="ghost"
          size="sm"
          className="btn-ghost"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-semantic-error text-semantic-error' : 'text-text-secondary'}`} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="btn-ghost"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 text-text-secondary" />
        </Button>
      </div>

      {/* Price Card */}
      <Card className="card-glass mb-lg">
        <CardContent className="p-lg">
          <div className="text-center mb-lg">
            <div className="text-3xl font-bold text-text-primary">{facility.pricePerHour} kr</div>
            <div className="text-text-secondary">per time</div>
          </div>
          
          <div className="p-lg bg-semantic-success/10 rounded-lg mb-lg text-center border border-semantic-success/20">
            <p className="text-semantic-success-dark text-sm">
              <CheckCircle className="inline h-4 w-4 mr-1" />
              Tilgjengelig for umiddelbar booking
            </p>
          </div>

          <Button 
            className="btn-primary w-full h-12"
            onClick={onBookClick}
          >
            Reserver nå
          </Button>
        </CardContent>
      </Card>
      
      {/* Additional info cards */}
      <Card className="card-primary mb-lg">
        <CardContent className="p-lg">
          <div className="flex items-center gap-md">
            <div className="bg-semantic-warning/10 p-sm rounded-md">
              <Info className="h-5 w-5 text-semantic-warning" />
            </div>
            <div>
              <h3 className="heading-secondary text-text-primary">Avbestilling</h3>
              <p className="body-secondary text-sm">
                Gratis avbestilling inntil 48 timer før
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-primary">
        <CardContent className="p-lg">
          <div className="flex items-center gap-md">
            <div className="bg-brand-accent/10 p-sm rounded-md">
              <Clock className="h-5 w-5 text-brand-accent" />
            </div>
            <div>
              <h3 className="heading-secondary text-text-primary">Åpningstider</h3>
              <p className="body-secondary text-sm">
                {facility.openingHours}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
