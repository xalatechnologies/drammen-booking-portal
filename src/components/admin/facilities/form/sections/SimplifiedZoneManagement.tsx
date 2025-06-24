
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoneService } from "@/services/ZoneService";
import { Plus, Edit, Trash2, Map } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SimplifiedZoneManagementProps {
  facilityId: number;
}

interface Zone {
  id: string;
  name: string;
  type: string;
  status: string;
  capacity: number;
  description?: string;
}

export const SimplifiedZoneManagement: React.FC<SimplifiedZoneManagementProps> = ({
  facilityId
}) => {
  const queryClient = useQueryClient();

  const { data: zonesResponse, isLoading } = useQuery({
    queryKey: ['facility-zones', facilityId],
    queryFn: () => ZoneService.getZonesByFacilityId(facilityId),
    enabled: !!facilityId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ZoneService.deleteZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-zones', facilityId] });
      toast({
        title: "Success",
        description: "Zone deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete zone",
        variant: "destructive",
      });
    },
  });

  const zones: Zone[] = zonesResponse?.success ? zonesResponse.data || [] : [];

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this zone?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Loading zones...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Zones for this facility</h3>
          <p className="text-sm text-gray-600">Create and manage zones within this facility</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Zone
        </Button>
      </div>

      {zones.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <Map className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h4 className="font-medium mb-2">No zones configured</h4>
          <p className="text-sm mb-4">Create zones to divide this facility into bookable areas</p>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create First Zone
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone) => (
            <div key={zone.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{zone.name}</h4>
                  <p className="text-sm text-gray-600">{zone.type}</p>
                </div>
                <Badge variant={zone.status === 'active' ? 'default' : 'secondary'}>
                  {zone.status}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Capacity:</span> {zone.capacity} people
                </p>
                {zone.description && (
                  <p className="text-sm text-gray-600">{zone.description}</p>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(zone.id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
