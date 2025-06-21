
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FacilityService } from "@/services/facilityService";
import { FacilityFormView } from "./FacilityFormView";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FacilityListViewProps {
  selectedFacilityId?: number;
  onFacilitySelect?: (id: number) => void;
}

export const FacilityListView: React.FC<FacilityListViewProps> = ({
  selectedFacilityId,
  onFacilitySelect
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: facilitiesResponse, isLoading, error } = useQuery({
    queryKey: ['admin-facilities', { searchTerm }],
    queryFn: () => FacilityService.getFacilities(
      { page: 1, limit: 50 },
      { searchTerm }
    ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => FacilityService.deleteFacility(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-facilities'] });
      toast({
        title: "Success",
        description: "Facility deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete facility",
        variant: "destructive",
      });
    },
  });

  const facilities = facilitiesResponse?.success ? facilitiesResponse.data?.data || [] : [];

  const handleEdit = (facility: any) => {
    setEditingFacility(facility);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this facility?")) {
      deleteMutation.mutate(id.toString());
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingFacility(null);
    queryClient.invalidateQueries({ queryKey: ['admin-facilities'] });
  };

  if (showForm) {
    return (
      <FacilityFormView
        facility={editingFacility}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingFacility(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Facility Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Facility
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8">Loading facilities...</div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500">
          Error loading facilities: {error.message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {facilities.map((facility: any) => (
          <Card 
            key={facility.id} 
            className={`cursor-pointer transition-colors ${
              selectedFacilityId === facility.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onFacilitySelect?.(facility.id)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{facility.name}</CardTitle>
                <Badge variant={facility.status === 'active' ? 'default' : 'secondary'}>
                  {facility.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{facility.type}</p>
                <p className="text-sm">{facility.address_street}, {facility.address_city}</p>
                <p className="text-sm">Capacity: {facility.capacity}</p>
                <p className="text-sm font-medium">{facility.price_per_hour} kr/hour</p>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(facility);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(facility.id);
                    }}
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

      {facilities.length === 0 && !isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          No facilities found. {searchTerm && "Try adjusting your search terms."}
        </div>
      )}
    </div>
  );
};
