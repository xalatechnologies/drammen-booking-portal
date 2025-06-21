
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacilityService } from "@/services/facilityService";
import { facilityFormSchema, FacilityFormData } from "./FacilityFormSchema";
import { FacilityBasicSection } from "./sections/FacilityBasicSection";
import { FacilityAddressSection } from "./sections/FacilityAddressSection";
import { FacilityContactSection } from "./sections/FacilityContactSection";
import { FacilityConfigSection } from "./sections/FacilityConfigSection";
import { FacilityFeaturesSection } from "./sections/FacilityFeaturesSection";
import { FacilityImageManagement } from "../FacilityImageManagement";
import { FacilityCalendarManagement } from "./sections/FacilityCalendarManagement";
import { FacilityFormBreadcrumb } from "./FacilityFormBreadcrumb";
import { toast } from "@/hooks/use-toast";
import { Save, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { tSync } = useTranslation();

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
          title: tSync("admin.common.success", "Success"),
          description: `${tSync("admin.facilities.form.facility", "Facility")} ${isEditing ? tSync("admin.common.updated", "updated") : tSync("admin.common.created", "created")} ${tSync("admin.common.successfully", "successfully")}`,
        });
        queryClient.invalidateQueries({ queryKey: ['facilities'] });
        onSuccess();
      } else {
        toast({
          title: tSync("admin.common.error", "Error"),
          description: response.error?.message || `${tSync("admin.common.failedTo", "Failed to")} ${isEditing ? tSync("admin.common.update", "update") : tSync("admin.common.create", "create")} ${tSync("admin.facilities.form.facility", "facility")}`,
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: tSync("admin.common.error", "Error"),
        description: error.message || `${tSync("admin.common.failedTo", "Failed to")} ${isEditing ? tSync("admin.common.update", "update") : tSync("admin.common.create", "create")} ${tSync("admin.facilities.form.facility", "facility")}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FacilityFormData) => {
    console.log('Submitting facility form data:', data);
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Compact Breadcrumb */}
        <div className="mb-3">
          <FacilityFormBreadcrumb 
            isEditing={isEditing} 
            facilityName={facility?.name}
            onCancel={onCancel}
          />
        </div>

        {/* Compact Page Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {isEditing ? `${tSync("admin.facilities.form.edit", "Edit")}: ${facility.name}` : tSync("admin.facilities.form.addNew", "Add New Facility")}
          </h1>
          <p className="text-sm text-gray-600">
            {isEditing 
              ? tSync("admin.facilities.form.editDescription", "Update facility information and settings")
              : tSync("admin.facilities.form.createDescription", "Create a new facility with all necessary details")
            }
          </p>
        </div>

        {/* Main Content - Minimal Padding */}
        <Card className="shadow-sm border">
          <CardContent className="p-0">
            <Tabs defaultValue="details" className="w-full">
              <div className="border-b border-gray-200 px-4 pt-3">
                <TabsList className="grid w-full grid-cols-5 h-8">
                  <TabsTrigger value="details" className="text-xs py-1">
                    {tSync("admin.facilities.form.tabs.details", "Details")}
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="text-xs py-1">
                    {tSync("admin.facilities.form.tabs.contact", "Contact")}
                  </TabsTrigger>
                  <TabsTrigger value="config" className="text-xs py-1">
                    {tSync("admin.facilities.form.tabs.config", "Configuration")}
                  </TabsTrigger>
                  <TabsTrigger value="images" disabled={!isEditing} className="text-xs py-1">
                    {tSync("admin.facilities.form.tabs.images", "Images")}
                  </TabsTrigger>
                  <TabsTrigger value="calendar" disabled={!isEditing} className="text-xs py-1">
                    {tSync("admin.facilities.form.tabs.calendar", "Calendar")}
                  </TabsTrigger>
                </TabsList>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="p-4 space-y-3">
                    <TabsContent value="details" className="mt-0 space-y-3">
                      <FacilityBasicSection form={form} />
                      <FacilityAddressSection form={form} />
                      <FacilityFeaturesSection form={form} />
                    </TabsContent>

                    <TabsContent value="contact" className="mt-0">
                      <FacilityContactSection form={form} />
                    </TabsContent>

                    <TabsContent value="config" className="mt-0">
                      <FacilityConfigSection form={form} />
                    </TabsContent>

                    <TabsContent value="images" className="mt-0">
                      {isEditing ? (
                        <FacilityImageManagement facilityId={facility.id} />
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <p className="text-sm">{tSync("admin.facilities.form.saveFirstForImages", "Please save the facility first before managing images.")}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="calendar" className="mt-0">
                      {isEditing ? (
                        <FacilityCalendarManagement facilityId={facility.id} />
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <p className="text-sm">{tSync("admin.facilities.form.saveFirstForCalendar", "Please save the facility first before managing calendar settings.")}</p>
                        </div>
                      )}
                    </TabsContent>
                  </div>

                  {/* Compact Form Actions Footer */}
                  <div className="border-t border-gray-200 bg-gray-50 px-4 py-2">
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={onCancel} className="px-3 h-8 text-xs">
                        <X className="w-3 h-3 mr-1" />
                        {tSync("admin.common.cancel", "Cancel")}
                      </Button>
                      <Button type="submit" disabled={mutation.isPending} className="px-3 h-8 text-xs">
                        <Save className="w-3 h-3 mr-1" />
                        {mutation.isPending 
                          ? tSync("admin.common.saving", "Saving...") 
                          : (isEditing ? tSync("admin.facilities.form.updateFacility", "Update Facility") : tSync("admin.facilities.form.createFacility", "Create Facility"))
                        }
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
