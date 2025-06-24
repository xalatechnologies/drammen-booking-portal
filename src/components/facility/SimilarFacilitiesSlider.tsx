
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Clock } from "lucide-react";
import { useFacilities } from "@/hooks/useFacilities";

interface SimilarFacilitiesSliderProps {
  currentFacilityId: number;
  facilityType?: string;
}

export const SimilarFacilitiesSlider: React.FC<SimilarFacilitiesSliderProps> = ({
  currentFacilityId,
  facilityType
}) => {
  const { data: allFacilities, isLoading } = useFacilities();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Similar Facilities</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-none w-80 h-48 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const similarFacilities = (allFacilities || [])
    .filter(facility => 
      facility.id !== currentFacilityId && 
      (!facilityType || facility.type === facilityType)
    )
    .slice(0, 5);

  if (similarFacilities.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Similar Facilities</h3>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {similarFacilities.map((facility) => (
          <Card key={facility.id} className="flex-none w-80 cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="relative h-32 bg-gray-100 rounded-t-lg overflow-hidden">
                {facility.facility_images?.[0]?.image_url && (
                  <img 
                    src={facility.facility_images[0].image_url} 
                    alt={facility.facility_images[0].alt_text || facility.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <Badge className="absolute top-2 right-2 bg-white/90 text-gray-800">
                  {facility.type}
                </Badge>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-semibold truncate">{facility.name}</h4>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="truncate">{facility.area}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{facility.capacity}</span>
                  </div>
                  <div className="flex items-center text-green-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Available</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
