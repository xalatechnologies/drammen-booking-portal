import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Cube, Trash2, Edit, Plus, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/useTranslation";

interface VirtualTour {
  id: number;
  facility_id: number;
  title: string;
  description: string;
  url: string;
  provider: string; // 'matterport', 'google', 'custom', etc.
  created_at: string;
  display_order: number;
}

interface VirtualTourManagementProps {
  facilityId: number;
}

export const VirtualTourManagement: React.FC<VirtualTourManagementProps> = ({ facilityId }) => {
  const { tSync } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTour, setCurrentTour] = useState<VirtualTour | null>(null);
  const [newTourUrl, setNewTourUrl] = useState("");
  const [newTourTitle, setNewTourTitle] = useState("");
  const [newTourDescription, setNewTourDescription] = useState("");
  const [newTourProvider, setNewTourProvider] = useState("matterport");

  // Fetch virtual tours
  const { data: virtualTours, isLoading } = useQuery({
    queryKey: ["facility-virtual-tours", facilityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facility_virtual_tours")
        .select("*")
        .eq("facility_id", facilityId)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as VirtualTour[];
    },
    enabled: !!facilityId,
  });

  // Add virtual tour mutation
  const addTourMutation = useMutation({
    mutationFn: async (tourData: Partial<VirtualTour>) => {
      const { data, error } = await supabase
        .from("facility_virtual_tours")
        .insert([{ ...tourData, facility_id: facilityId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facility-virtual-tours", facilityId] });
      resetForm();
      toast({
        title: tSync("admin.facility.virtualTours.addSuccess", "Virtual tour added"),
        description: tSync(
          "admin.facility.virtualTours.addSuccessDesc",
          "The virtual tour has been successfully added to this facility."
        ),
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: tSync("admin.facility.virtualTours.addError", "Error adding virtual tour"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update virtual tour mutation
  const updateTourMutation = useMutation({
    mutationFn: async (tourData: Partial<VirtualTour>) => {
      const { data, error } = await supabase
        .from("facility_virtual_tours")
        .update(tourData)
        .eq("id", tourData.id!)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facility-virtual-tours", facilityId] });
      resetForm();
      toast({
        title: tSync("admin.facility.virtualTours.updateSuccess", "Virtual tour updated"),
        description: tSync(
          "admin.facility.virtualTours.updateSuccessDesc",
          "The virtual tour has been successfully updated."
        ),
      });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: tSync("admin.facility.virtualTours.updateError", "Error updating virtual tour"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete virtual tour mutation
  const deleteTourMutation = useMutation({
    mutationFn: async (tourId: number) => {
      const { error } = await supabase
        .from("facility_virtual_tours")
        .delete()
        .eq("id", tourId);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facility-virtual-tours", facilityId] });
      toast({
        title: tSync("admin.facility.virtualTours.deleteSuccess", "Virtual tour removed"),
        description: tSync(
          "admin.facility.virtualTours.deleteSuccessDesc",
          "The virtual tour has been successfully removed from this facility."
        ),
      });
    },
    onError: (error) => {
      toast({
        title: tSync("admin.facility.virtualTours.deleteError", "Error removing virtual tour"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleTourSubmit = () => {
    if (!newTourUrl.trim()) {
      toast({
        title: tSync("admin.facility.virtualTours.urlRequired", "URL required"),
        description: tSync(
          "admin.facility.virtualTours.urlRequiredDesc",
          "Please provide a valid URL for the virtual tour."
        ),
        variant: "destructive",
      });
      return;
    }

    if (currentTour) {
      updateTourMutation.mutate({
        id: currentTour.id,
        title: newTourTitle,
        description: newTourDescription,
        url: newTourUrl,
        provider: newTourProvider,
      });
    } else {
      addTourMutation.mutate({
        title: newTourTitle,
        description: newTourDescription,
        url: newTourUrl,
        provider: newTourProvider,
        display_order: virtualTours?.length || 0,
      });
    }
  };

  const resetForm = () => {
    setNewTourUrl("");
    setNewTourTitle("");
    setNewTourDescription("");
    setNewTourProvider("matterport");
    setCurrentTour(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (tour: VirtualTour) => {
    setCurrentTour(tour);
    setNewTourUrl(tour.url);
    setNewTourTitle(tour.title);
    setNewTourDescription(tour.description);
    setNewTourProvider(tour.provider);
    setIsDialogOpen(true);
  };

  const handleDeleteTour = (tourId: number) => {
    if (confirm(tSync("admin.facility.virtualTours.confirmDelete", "Are you sure you want to delete this virtual tour?"))) {
      deleteTourMutation.mutate(tourId);
    }
  };

  return (
    <div className="space-y-8">
      {/* Add Virtual Tour Button */}
      <div className="flex justify-end">
        <Button onClick={openAddDialog} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {tSync("admin.facility.virtualTours.addNew", "Add New Virtual Tour")}
        </Button>
      </div>

      {/* Virtual Tour listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 flex items-center justify-center py-12">
            <div className="text-gray-500">
              {tSync("admin.common.loading", "Loading...")}
            </div>
          </div>
        ) : !virtualTours || virtualTours.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-500 bg-gray-50 border border-gray-100 rounded-md">
            <Cube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>
              {tSync(
                "admin.facility.virtualTours.noTours",
                "No virtual tours have been added for this facility yet."
              )}
            </p>
            <Button onClick={openAddDialog} variant="outline" className="mt-4">
              {tSync("admin.facility.virtualTours.addFirst", "Add your first virtual tour")}
            </Button>
          </div>
        ) : (
          virtualTours.map((tour) => (
            <Card key={tour.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-start justify-between">
                  <span className="text-base">{tour.title}</span>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEditDialog(tour)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteTour(tour.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-md flex items-center justify-center h-28">
                  <Cube className="w-16 h-16 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                  {tour.description || tSync("admin.facility.virtualTours.noDescription", "No description provided.")}
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                  onClick={() => window.open(tour.url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  {tSync("admin.facility.virtualTours.view", "View Virtual Tour")}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Virtual Tour Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentTour
                ? tSync("admin.facility.virtualTours.editTour", "Edit Virtual Tour")
                : tSync("admin.facility.virtualTours.addTour", "Add New Virtual Tour")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tour-url">
                {tSync("admin.facility.virtualTours.tourUrl", "Virtual Tour URL")}
              </Label>
              <Input
                id="tour-url"
                value={newTourUrl}
                onChange={(e) => setNewTourUrl(e.target.value)}
                placeholder={tSync(
                  "admin.facility.virtualTours.tourUrlPlaceholder",
                  "e.g., https://my.matterport.com/show/?m=..."
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tour-title">
                {tSync("admin.facility.virtualTours.tourTitle", "Title")}
              </Label>
              <Input
                id="tour-title"
                value={newTourTitle}
                onChange={(e) => setNewTourTitle(e.target.value)}
                placeholder={tSync(
                  "admin.facility.virtualTours.tourTitlePlaceholder",
                  "Enter a title for this virtual tour"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tour-provider">
                {tSync("admin.facility.virtualTours.provider", "Provider")}
              </Label>
              <select
                id="tour-provider"
                className="w-full p-2 border rounded-md"
                value={newTourProvider}
                onChange={(e) => setNewTourProvider(e.target.value)}
              >
                <option value="matterport">Matterport</option>
                <option value="google">Google Street View</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tour-description">
                {tSync("admin.facility.virtualTours.tourDescription", "Description")}
              </Label>
              <Textarea
                id="tour-description"
                value={newTourDescription}
                onChange={(e) => setNewTourDescription(e.target.value)}
                placeholder={tSync(
                  "admin.facility.virtualTours.tourDescriptionPlaceholder",
                  "Enter a description for this virtual tour (optional)"
                )}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
            >
              {tSync("common.cancel", "Cancel")}
            </Button>
            <Button onClick={handleTourSubmit}>
              {currentTour
                ? tSync("common.save", "Save")
                : tSync("common.add", "Add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
