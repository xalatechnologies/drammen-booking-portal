
import React from "react";
import { Wifi, Car, Coffee, Shield, CheckCircle } from "lucide-react";

export function getAmenityIcon(amenity: string): JSX.Element {
  switch (amenity.toLowerCase()) {
    case 'wi-fi':
    case 'wifi':
      return <Wifi className="h-4 w-4" />;
    case 'parkering':
      return <Car className="h-4 w-4" />;
    case 'kafeteria':
      return <Coffee className="h-4 w-4" />;
    case 'sikkerhetskameraer':
    case 'brannsikkerhet':
    case 'førstehjelpsutstyr':
      return <Shield className="h-4 w-4" />;
    default:
      return <CheckCircle className="h-4 w-4" />;
  }
}
