
import React from "react";
import { Grid3X3, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FacilityGridViewProps {
  facilities: any[];
  onView: (facility: any) => void;
  onCalendar: (facility: any) => void;
  onEdit: (facility: any) => void;
}

export const FacilityGridView: React.FC<FacilityGridViewProps> = ({
  facilities,
  onView,
  onCalendar,
  onEdit
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {facilities.map((facility) => (
        <Card key={facility.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg line-clamp-2">{facility.name}</CardTitle>
              <Badge
                variant={facility.status === 'active' ? 'default' : 
                        facility.status === 'maintenance' ? 'secondary' : 'destructive'}
              >
                {facility.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-1">
              {facility.address_street}, {facility.address_city}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{facility.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-medium">{facility.capacity} people</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">{facility.price_per_hour} NOK/hour</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onView(facility)} className="flex-1">
                <Grid3X3 className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => onCalendar(facility)}>
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(facility)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
