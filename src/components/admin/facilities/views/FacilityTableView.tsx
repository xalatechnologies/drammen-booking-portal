
import React from "react";
import { Grid3X3, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { tSync } = useTranslation();

  return (
    <TooltipProvider>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-lg">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left p-5 font-medium text-lg">Name</th>
                  <th className="text-left p-5 font-medium text-lg">Type</th>
                  <th className="text-left p-5 font-medium text-lg">Location</th>
                  <th className="text-left p-5 font-medium text-lg">Capacity</th>
                  <th className="text-left p-5 font-medium text-lg">Area (m²)</th>
                  <th className="text-left p-5 font-medium text-lg">Status</th>
                  <th className="text-left p-5 font-medium text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((facility) => (
                  <tr key={facility.id} className="border-b hover:bg-gray-50">
                    <td className="p-5">
                      <div>
                        <div className="font-medium text-lg">{facility.name}</div>
                        <div className="text-base text-gray-500">{facility.area}</div>
                      </div>
                    </td>
                    <td className="p-5 text-base">{facility.type}</td>
                    <td className="p-5 text-base">
                      {facility.address_street}, {facility.address_city}
                    </td>
                    <td className="p-5 text-base">{facility.capacity} people</td>
                    <td className="p-5 text-base">{facility.area_sqm || 'N/A'} m²</td>
                    <td className="p-5">
                      <Badge
                        variant={facility.status === 'active' ? 'default' : 
                                facility.status === 'maintenance' ? 'secondary' : 'destructive'}
                        className="text-sm"
                      >
                        {facility.status}
                      </Badge>
                    </td>
                    <td className="p-5">
                      <div className="flex gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => onView(facility)}>
                              <Grid3X3 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tSync('admin.facilities.actions.view_details', 'View facility details')}</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => onCalendar(facility)}>
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tSync('admin.facilities.actions.view_calendar', 'View calendar')}</p>
                          </TooltipContent>
                        </Tooltip>
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => onEdit(facility)}>
                              <Settings className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tSync('admin.facilities.actions.edit_settings', 'Edit facility settings')}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
