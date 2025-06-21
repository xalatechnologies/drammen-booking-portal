import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FacilityService } from "@/services/facilityService";
import { FacilityBlackoutService } from "@/services/FacilityBlackoutService";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface BlackoutPeriodsManagementProps {
  selectedFacilityId?: number;
}

export const BlackoutPeriodsManagement: React.FC<BlackoutPeriodsManagementProps> = ({
  selectedFacilityId
}) => {
  const [editingFacilityId, setEditingFacilityId] = useState<number | null>(
    selectedFacilityId || null
  );
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    reason: '',
    type: 'maintenance'
  });
  const queryClient = useQueryClient();

  const { data: facilitiesResponse } = useQuery({
    queryKey: ['admin-facilities-list'],
    queryFn: () => FacilityService.getFacilities({ page: 1, limit: 100 }, {}, {}),
  });

  const { data: blackoutsResponse, isLoading } = useQuery({
    queryKey: ['facility-blackouts', editingFacilityId],
    queryFn: () => editingFacilityId ? FacilityBlackoutService.getBlackoutsByFacility(editingFacilityId) : null,
    enabled: !!editingFacilityId,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => FacilityBlackoutService.createBlackout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-blackouts'] });
      setShowForm(false);
      setFormData({ start_date: '', end_date: '', reason: '', type: 'maintenance' });
      toast({
        title: "Success",
        description: "Blackout period created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create blackout period",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => FacilityBlackoutService.deleteBlackout(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-blackouts'] });
      toast({
        title: "Success",
        description: "Blackout period deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blackout period",
        variant: "destructive",
      });
    },
  });

  const facilities = facilitiesResponse?.success ? facilitiesResponse.data?.data || [] : [];
  const blackouts = blackoutsResponse?.success ? blackoutsResponse.data?.data || [] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFacilityId) return;

    createMutation.mutate({
      facility_id: editingFacilityId,
      ...formData
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blackout period?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center">
          <Calendar className="w-6 h-6 mr-2" />
          Blackout Periods Management
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
              <SelectValue placeholder="Select a facility to manage blackout periods" />
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
        <>
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Current Blackout Periods</CardTitle>
                <Button onClick={() => setShowForm(!showForm)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Blackout Period
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading blackout periods...</div>
              ) : blackouts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No blackout periods configured
                </div>
              ) : (
                <div className="space-y-4">
                  {blackouts.map((blackout: any) => (
                    <div key={blackout.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{blackout.type}</Badge>
                          <span className="font-medium">{blackout.reason}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(blackout.start_date), 'MMM dd, yyyy')} - {format(new Date(blackout.end_date), 'MMM dd, yyyy')}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(blackout.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Blackout Period</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input
                        id="start_date"
                        type="datetime-local"
                        value={formData.start_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date</Label>
                      <Input
                        id="end_date"
                        type="datetime-local"
                        value={formData.end_date}
                        onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="holiday">Holiday</SelectItem>
                        <SelectItem value="event">Special Event</SelectItem>
                        <SelectItem value="renovation">Renovation</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Enter reason for blackout period..."
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" type="button" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? "Creating..." : "Create Blackout"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
