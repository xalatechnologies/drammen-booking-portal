
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FacilityService } from "@/services/facilityService";
import { facilityFormSchema, FacilityFormData, FACILITY_TYPES, BOOKING_TYPES } from "./FacilityFormSchema";
import { FacilityBasicSection } from "./sections/FacilityBasicSection";
import { FacilityAddressSection } from "./sections/FacilityAddressSection";
import { FacilityContactSection } from "./sections/FacilityContactSection";
import { FacilityConfigSection } from "./sections/FacilityConfigSection";
import { FacilityFeaturesSection } from "./sections/FacilityFeaturesSection";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, X } from "lucide-react";

interface EnhancedFacilityFormProps {
  facility?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EnhancedFacilityForm: React.FC<EnhancedFacilityFormProps> = ({
  facility,
  onSuccess,
  onCancel
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!facility;

  const form = useForm<FacilityFormData>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: {
      name: facility?.name || "",
      type: facility?.type || "",
      area: facility?.area || "",
      description: facility?.description || "",
      capacity: facility?.capacity || 1,
      area_sqm: facility?.area_sqm || 0,
      address_street: facility?.address_street || "",
      address_city: facility?.address_city || "",
      address_postal_code: facility?.address_postal_code || "",
      address_country: facility?.address_country || "Norway",
      contact_name: facility?.contact_name || "",
      contact_email: facility?.contact_email || "",
      contact_phone: facility?.contact_phone || "",
      status: facility?.status || "active",
      has_auto_approval: facility?.has_auto_approval || false,
      price_per_hour: facility?.price_per_hour || 450,
      time_slot_duration: facility?.time_slot_duration || 1,
      booking_lead_time_hours: facility?.booking_lead_time_hours || 2,
      max_advance_booking_days: facility?.max_advance_booking_days || 365,
      cancellation_deadline_hours: facility?.cancellation_deadline_hours || 24,
      allowed_booking_types: facility?.allowed_booking_types || ["engangs"],
      equipment: facility?.equipment || [],
      amenities: facility?.amenities || [],
      accessibility_features: facility?.accessibility_features || [],
      latitude: facility?.latitude || undefined,
      longitude: facility?.longitude || undefined,
      season_from: facility?.season_from || "",
      season_to: facility?.season_to || "",
      is_featured: facility?.is_featured || false,
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: FacilityFormData) => {
      if (isEditing) {
        return FacilityService.updateFacility(facility.id.toString(), data);
      } else {
        return FacilityService.createFacility(data);
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Success",
          description: `Facility ${isEditing ? 'updated' : 'created'} successfully`,
        });
        queryClient.invalidateQueries({ queryKey: ['facilities'] });
        onSuccess();
      } else {
        toast({
          title: "Error",
          description: response.error?.message || `Failed to ${isEditing ? 'update' : 'create'} facility`,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? 'update' : 'create'} facility`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FacilityFormData) => {
    console.log('Submitting facility form data:', data);
    mutation.mutate(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Facilities
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? `Edit: ${facility.name}` : 'Add New Facility'}
          </h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FacilityBasicSection form={form} />
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FacilityAddressSection form={form} />
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FacilityContactSection form={form} />
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <FacilityConfigSection form={form} />
            </CardContent>
          </Card>

          {/* Features & Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Features & Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <FacilityFeaturesSection form={form} />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {mutation.isPending ? "Saving..." : (isEditing ? "Update Facility" : "Create Facility")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
