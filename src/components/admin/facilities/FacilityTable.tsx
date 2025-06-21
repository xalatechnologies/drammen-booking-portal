
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MapPin } from "lucide-react";
import { Facility } from "@/types/facility";

interface FacilityTableProps {
  facilities: Facility[];
  onEdit: (facility: Facility) => void;
  onView: (facility: Facility) => void;
  isLoading?: boolean;
}

const FacilityTable: React.FC<FacilityTableProps> = ({
  facilities,
  onEdit,
  onView,
  isLoading = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'maintenance': return 'secondary';
      case 'inactive': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="text-lg text-gray-500">Laster fasiliteter...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b-2">
            <TableHead className="text-base font-semibold text-gray-900 py-4">Navn</TableHead>
            <TableHead className="text-base font-semibold text-gray-900 py-4">Type</TableHead>
            <TableHead className="text-base font-semibold text-gray-900 py-4">Område</TableHead>
            <TableHead className="text-base font-semibold text-gray-900 py-4">Areal (m²)</TableHead>
            <TableHead className="text-base font-semibold text-gray-900 py-4">Kapasitet</TableHead>
            <TableHead className="text-base font-semibold text-gray-900 py-4">Status</TableHead>
            <TableHead className="text-base font-semibold text-gray-900 py-4">Pris/time</TableHead>
            <TableHead className="text-base font-semibold text-gray-900 py-4 w-32">Handlinger</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facilities.map((facility) => (
            <TableRow key={facility.id} className="hover:bg-blue-50 transition-colors duration-200">
              <TableCell className="text-base py-4 font-medium">
                <div className="flex items-center space-x-3">
                  {facility.image && (
                    <img 
                      src={facility.image} 
                      alt={facility.name}
                      className="w-10 h-10 rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{facility.name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {facility.address}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-base py-4 capitalize">{facility.type}</TableCell>
              <TableCell className="text-base py-4">{facility.area}</TableCell>
              <TableCell className="text-base py-4">
                {facility.area_sqm ? `${facility.area_sqm} m²` : '-'}
              </TableCell>
              <TableCell className="text-base py-4">{facility.capacity} personer</TableCell>
              <TableCell className="py-4">
                <Badge 
                  variant={getStatusColor(facility.status)}
                  className="text-sm px-3 py-1"
                >
                  {facility.status === 'active' ? 'Aktiv' : 
                   facility.status === 'maintenance' ? 'Vedlikehold' : 'Inaktiv'}
                </Badge>
              </TableCell>
              <TableCell className="text-base py-4">
                {facility.pricePerHour ? `${facility.pricePerHour} NOK` : '-'}
              </TableCell>
              <TableCell className="py-4">
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onView(facility)}
                    className="text-sm px-3 py-2"
                  >
                    <Eye size={14} className="mr-1" />
                    Vis
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEdit(facility)}
                    className="text-sm px-3 py-2"
                  >
                    <Edit size={14} className="mr-1" />
                    Rediger
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {facilities.length === 0 && (
        <div className="w-full p-8 text-center">
          <div className="text-lg text-gray-500">Ingen fasiliteter funnet</div>
        </div>
      )}
    </div>
  );
};

export default FacilityTable;
