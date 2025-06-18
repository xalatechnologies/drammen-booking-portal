
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface MapViewProps {
  facilityType: string;
  location: string;
}

const MapView: React.FC<MapViewProps> = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Kartet lastes inn...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;
