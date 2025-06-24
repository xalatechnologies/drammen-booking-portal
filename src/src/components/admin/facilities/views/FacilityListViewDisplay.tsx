
import React from "react";
import { Grid3X3, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "@/hooks/useTranslation";

interface FacilityListViewDisplayProps {
  facilities: any[];
  onView: (facility: any) => void;
  onCalendar: (facility: any) => void;
  onEdit: (facility: any) => void;
}

export const FacilityListViewDisplay: React.FC<FacilityListViewDisplayProps> = ({
  facilities,
  onView,
  onCalendar,
  onEdit
}) => {
  const { tSync } = useTranslation();

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {facilities.map((facility) => (
          <Card key={facility.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{facility.name}</h3>
                      <p className="text-base text-gray-600">
                        {facility.address_street}, {facility.address_city}
                      </p>
                    </div>
                    <div className="flex items-center gap-6 text-base">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-1 font-medium">{facility.type}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Capacity:</span>
                        <span className="ml-1 font-medium">{facility.capacity} people</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Area:</span>
                        <span className="ml-1 font-medium">{facility.area_sqm || 'N/A'} m²</span>
                      </div>
                      <Badge
                        variant={facility.status === 'active' ? 'default' : 
                                facility.status === 'maintenance' ? 'secondary' : 'destructive'}
                        className="text-base"
                      >
                        {facility.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => onView(facility)} className="text-base">
                        <Grid3X3 className="h-4 w-4 mr-1" />
                        View
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
};
