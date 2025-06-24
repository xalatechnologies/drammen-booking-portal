
import React from "react";
import { Eye, Calendar, Settings, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-base font-semibold">
                {tSync("admin.facilities.table.name", "Name")}
              </TableHead>
              <TableHead className="text-base font-semibold">
                {tSync("admin.facilities.details.type", "Type:")}
              </TableHead>
              <TableHead className="text-base font-semibold">
                {tSync("admin.facilities.details.capacity", "Kapasitet:")}
              </TableHead>
              <TableHead className="text-base font-semibold">
                {tSync("admin.facilities.table.location", "Location")}
              </TableHead>
              <TableHead className="text-base font-semibold">
                {tSync("admin.facilities.table.status", "Status")}
              </TableHead>
              <TableHead className="text-base font-semibold text-right">
                {tSync("admin.facilities.table.actions", "Actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {facilities.map((facility) => (
              <TableRow key={facility.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-base">
                  <div className="flex flex-col">
                    <span className="font-semibold">{facility.name}</span>
                    <span className="text-sm text-gray-500">{facility.area}</span>
                  </div>
                </TableCell>
                <TableCell className="text-base">
                  <Badge variant="outline" className="text-sm">
                    {tSync(`admin.facilities.types.${facility.type}`, facility.type)}
                  </Badge>
                </TableCell>
                <TableCell className="text-base">
                  {facility.capacity} {tSync("admin.facilities.details.people", "personer")}
                </TableCell>
                <TableCell className="text-base">
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">
                      {facility.address_city || tSync("admin.facilities.details.notAvailable", "Ikke tilgjengelig")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`text-sm ${getStatusColor(facility.status)}`}>
                    {tSync(`admin.facilities.status.${facility.status}`, facility.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(facility)}
                      className="h-8 px-2"
                      aria-label={tSync("admin.facilities.actions.view_details", "Se detaljer om lokalet")}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">{tSync("admin.facilities.actions.view", "Vis")}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCalendar(facility)}
                      className="h-8 px-2"
                      aria-label={tSync("admin.facilities.actions.view_calendar", "Se kalender")}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(facility)}
                      className="h-8 px-2"
                      aria-label={tSync("admin.facilities.actions.edit_settings", "Rediger lokale innstillinger")}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
