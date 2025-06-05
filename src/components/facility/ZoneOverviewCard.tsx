
import React from "react";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zone } from "@/components/booking/types";

interface ZoneOverviewCardProps {
  zones: Zone[];
}

export function ZoneOverviewCard({ zones }: ZoneOverviewCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tilgjengelige soner</h3>
        <div className="space-y-4">
          {zones.map((zone) => (
            <Card key={zone.id} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{zone.name}</h4>
                    <p className="text-sm text-gray-600">{zone.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{zone.pricePerHour} kr</div>
                    <div className="text-xs text-gray-500">per time</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>Maks {zone.capacity}</span>
                  </div>
                  {zone.area && (
                    <div className="text-sm text-gray-600">
                      <span>{zone.area}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {zone.equipment.slice(0, 3).map((item, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                  {zone.equipment.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{zone.equipment.length - 3} mer
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
