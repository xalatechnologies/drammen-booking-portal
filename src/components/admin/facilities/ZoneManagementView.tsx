
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useFacilities } from "@/hooks/useFacilities";
import { useZones } from "@/hooks/useZones";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Edit, Trash2, Map } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ZoneManagementViewProps {
  selectedFacilityId?: number;
}

export const ZoneManagementView: React.FC<ZoneManagementViewProps> = ({
  selectedFacilityId
}) => {
  const [editingFacilityId, setEditingFacilityId] = useState<number | null>(
    selectedFacilityId || null
  );
  const queryClient = useQueryClient();

  const { data: facilities = [] } = useFacilities();
  const { data: zones = [], isLoading } = useZones(editingFacilityId || 0);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('zones')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
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

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this zone?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Map className="w-6 h-6 mr-2" />
          Zone Management
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Facility</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={editingFacilityId?.toString() || ""} 
            onValueChange={(value) => setEditingFacilityId(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a facility to manage zones" />
            </SelectTrigger>
            <SelectContent>
              {facilities.map((facility: any) => (
                <SelectItem key={facility.id} value={facility.id.toString()}>
                  {facility.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {editingFacilityId && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Zones</CardTitle>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Zone
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading zones...</div>
            ) : zones.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No zones configured for this facility
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {zones.map((zone: any) => (
                  <Card key={zone.id} className="relative">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{zone.name}</CardTitle>
                        <Badge variant={zone.status === 'active' ? 'default' : 'secondary'}>
                          {zone.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{zone.type}</p>
                        <p className="text-sm">Capacity: {zone.capacity}</p>
                        {zone.description && (
                          <p className="text-sm text-muted-foreground">{zone.description}</p>
                        )}
                        
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(zone.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
