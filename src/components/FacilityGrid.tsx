
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Clock } from "lucide-react";

interface FacilityGridProps {
  date?: Date;
  facilityType: string;
  location: string;
  accessibility?: string;
  capacity?: number[];
}

const mockFacilities = [
  {
    id: 1,
    name: "Kulturhuset Drammen - Storstudio",
    type: "Kultursal",
    location: "Sentrum",
    capacity: 200,
    image: "/lovable-uploads/5a43abf2-1c2e-44cb-96a6-6509c7fe3281.png",
    available: true,
  },
  {
    id: 2,
    name: "Marienlyst Skole - Gymsal",
    type: "Idrettshall",
    location: "Strømsø",
    capacity: 100,
    image: "/lovable-uploads/5a43abf2-1c2e-44cb-96a6-6509c7fe3281.png",
    available: true,
  },
  {
    id: 3,
    name: "Rådhuset - Møterom A",
    type: "Møterom",
    location: "Sentrum",
    capacity: 20,
    image: "/lovable-uploads/5a43abf2-1c2e-44cb-96a6-6509c7fe3281.png",
    available: false,
  },
];

const FacilityGrid: React.FC<FacilityGridProps> = ({
  facilityType,
  location,
}) => {
  const filteredFacilities = mockFacilities.filter(facility => {
    if (facilityType && facilityType !== "all" && !facility.type.toLowerCase().includes(facilityType)) {
      return false;
    }
    if (location && location !== "all" && !facility.location.toLowerCase().includes(location)) {
      return false;
    }
    return true;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredFacilities.map((facility) => (
        <Card key={facility.id} className="hover:shadow-lg transition-shadow">
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img
              src={facility.image}
              alt={facility.name}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{facility.name}</CardTitle>
              <Badge variant={facility.available ? "default" : "secondary"}>
                {facility.available ? "Ledig" : "Opptatt"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                {facility.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="w-4 h-4 mr-2" />
                {facility.capacity} personer
              </div>
            </div>
            <Button className="w-full" disabled={!facility.available}>
              {facility.available ? "Book lokale" : "Ikke tilgjengelig"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FacilityGrid;
