
import React from "react";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FacilityHeaderProps {
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
}

export function FacilityHeader({ name, address, rating, reviewCount }: FacilityHeaderProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Idrettsanlegg
        </Badge>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{rating}</span>
          <span className="text-gray-500 text-sm">({reviewCount})</span>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">{name}</h1>
      <div className="flex items-center text-gray-600 mb-4">
        <MapPin className="h-5 w-5 mr-2" />
        <span>{address}</span>
      </div>
    </div>
  );
}
