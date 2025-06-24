
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye } from "lucide-react";
import { useZones } from "@/hooks/useZones";

interface FacilityZonesSectionProps {
  facility: any;
}

export const FacilityZonesSection: React.FC<FacilityZonesSectionProps> = ({ facility }) => {
  const { data: zones = [], isLoading } = useZones(facility.id?.toString());

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading zones...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Zones & Areas</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Zone
        </Button>
      </div>

      {zones.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Zones Configured</h3>
            <p className="text-gray-600 mb-4">
              This facility doesn't have any zones configured yet. Zones help organize bookable areas within the facility.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create First Zone
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {zones.map((zone: any) => (
            <Card key={zone.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{zone.displayName || zone.code}</CardTitle>
                  <Badge variant="default">active</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Code:</span>
                    <span className="font-medium">{zone.code}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">{zone.capacity} people</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Interval:</span>
                    <span className="font-medium">{zone.interval}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
