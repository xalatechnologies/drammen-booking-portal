
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";

interface FacilityListProps {
  date?: Date;
  facilityType: string;
  location: string;
}

const mockFacilities = [
  {
    id: 1,
    name: "Kulturhuset Drammen - Storstudio",
    type: "Kultursal",
    location: "Sentrum",
    capacity: 200,
    available: true,
  },
  {
    id: 2,
    name: "Marienlyst Skole - Gymsal",
    type: "Idrettshall",
    location: "Strømsø",
    capacity: 100,
    available: true,
  },
];

const FacilityList: React.FC<FacilityListProps> = ({
  facilityType,
  location,
}) => {
  return (
    <div className="space-y-4">
      {mockFacilities.map((facility) => (
        <Card key={facility.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{facility.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {facility.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {facility.capacity} personer
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={facility.available ? "default" : "secondary"}>
                  {facility.available ? "Ledig" : "Opptatt"}
                </Badge>
                <Button disabled={!facility.available}>
                  {facility.available ? "Book" : "Opptatt"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FacilityList;
