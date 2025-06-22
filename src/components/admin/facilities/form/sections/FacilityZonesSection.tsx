import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Grid3X3, Loader2 } from "lucide-react";
import { useFacilityZoneStore, Zone } from "@/stores/useFacilityZoneStore";
import { ZoneRepository } from "@/dal/repositories/ZoneRepository";
import { toast } from "@/hooks/use-toast";
import { ZoneList } from "./zones/ZoneList";
import { ZoneFormDialog } from "./zones/ZoneFormDialog";

interface FacilityZonesSectionProps {
  facilityId: number;
}

interface FacilityZonesSectionRef {
  saveData: () => Promise<boolean>;
}

export const FacilityZonesSection = forwardRef<FacilityZonesSectionRef, FacilityZonesSectionProps>(({ facilityId }, ref) => {
  const queryClient = useQueryClient();

  const { zones, actions, isDirty } = useFacilityZoneStore();
  const { initialize, reset, removeZone } = actions;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);

  const { data: initialZones, isLoading, error } = useQuery({
    queryKey: ['zones', facilityId],
    queryFn: () => ZoneRepository.getZonesByFacilityId(facilityId),
    enabled: !!facilityId,
  });

  useEffect(() => {
    if (initialZones) {
      initialize(initialZones);
    }
    return () => {
      reset(); 
    };
  }, [initialZones, initialize, reset]);

  const saveZonesMutation = useMutation({
    mutationFn: (zonesToSave: Zone[]) => ZoneRepository.saveZones(facilityId, zonesToSave),
    onSuccess: () => {
      toast({ title: "Success", description: "Zones saved successfully." });
      queryClient.invalidateQueries({ queryKey: ['zones', facilityId] });
      initialize(zones); 
    },
    onError: (e: any) => {
      toast({ title: "Error", description: `Failed to save zones: ${e.message}`, variant: "destructive" });
    },
  });

  useImperativeHandle(ref, () => ({
    saveData: async () => {
      if (!isDirty) {
        return true;
      }
      if (!facilityId) {
        toast({ title: "Error", description: "Cannot save zones without a facility ID.", variant: "destructive" });
        return false;
      }
      try {
        await saveZonesMutation.mutateAsync(zones);
        return true;
      } catch (error) {
        return false;
      }
    }
  }), [isDirty, zones, facilityId, saveZonesMutation, initialize]);
  
  const handleOpenDialogForNew = () => {
    setEditingZone(null);
    setIsDialogOpen(true);
  };
  
  const handleEditZone = (zone: Zone) => {
    setEditingZone(zone);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingZone(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
        <span className="ml-2">Loading zones...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 border-2 border-dashed rounded-lg border-red-200 bg-red-50">
        <h3 className="font-medium mb-1">Error Loading Zones</h3>
        <p className="text-sm mb-4">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-5 h-5" />
              Zone Management
            </div>
             <Button onClick={handleOpenDialogForNew} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Zone
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {zones.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <Grid3X3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <h3 className="font-medium mb-1">No zones configured</h3>
              <p className="text-sm mb-4">Create zones to divide this facility into bookable areas</p>
            </div>
          ) : (
            <ZoneList zones={zones} onEdit={handleEditZone} onRemove={removeZone} />
          )}
        </CardContent>
      </Card>
      <ZoneFormDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        zone={editingZone || undefined}
      />
    </>
  );
});

FacilityZonesSection.displayName = "FacilityZonesSection";
