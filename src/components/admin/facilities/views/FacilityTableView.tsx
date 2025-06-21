
import React from "react";
import { Grid3X3, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FacilityTableViewProps {
  facilities: any[];
  onView: (facility: any) => void;
  onCalendar: (facility: any) => void;
  onEdit: (facility: any) => void;
}

export const FacilityTableView: React.FC<FacilityTableViewProps> = ({
  facilities,
  onView,
  onCalendar,
  onEdit
}) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Location</th>
                <th className="text-left p-4 font-medium">Capacity</th>
                <th className="text-left p-4 font-medium">Price/Hour</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((facility) => (
                <tr key={facility.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{facility.name}</div>
                      <div className="text-sm text-gray-500">{facility.area}</div>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{facility.type}</td>
                  <td className="p-4 text-sm">
                    {facility.address_street}, {facility.address_city}
                  </td>
                  <td className="p-4 text-sm">{facility.capacity} people</td>
                  <td className="p-4 text-sm">{facility.price_per_hour} NOK</td>
                  <td className="p-4">
                    <Badge
                      variant={facility.status === 'active' ? 'default' : 
                              facility.status === 'maintenance' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {facility.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => onView(facility)}>
                        <Grid3X3 className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onCalendar(facility)}>
                        <Calendar className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onEdit(facility)}>
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
