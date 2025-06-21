import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacilityService } from "@/services/facilityService";
import { facilityFormSchema, FacilityFormData } from "./FacilityFormSchema";
import { EnhancedFacilityBasicSection } from "./sections/EnhancedFacilityBasicSection";
import { EnhancedFacilityAddressSection } from "./sections/EnhancedFacilityAddressSection";
import { FacilityContactSection } from "./sections/FacilityContactSection";
import { FacilityConfigSection } from "./sections/FacilityConfigSection";
import { FacilityFeaturesSection } from "./sections/FacilityFeaturesSection";
import { FacilitySeasonSection } from "./sections/FacilitySeasonSection";
import { FacilityOpeningHoursSection } from "./sections/FacilityOpeningHoursSection";
import { FacilityPricingSection } from "./sections/FacilityPricingSection";
import { FacilityZonesSection } from "./sections/FacilityZonesSection";
import { FacilityBlackoutSection } from "./sections/FacilityBlackoutSection";
import { FacilityImageManagement } from "../FacilityImageManagement";
import { FacilityCalendarManagement } from "./sections/FacilityCalendarManagement";
import { FacilityFormBreadcrumb } from "./FacilityFormBreadcrumb";
import { useRoleBasedAccess } from "@/hooks/useRoleBasedAccess";
import { toast } from "@/hooks/use-toast";
import { Save, X, Shield, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const { currentRole, hasPermission, canAccessTab, getAvailableTabs } = useRoleBasedAccess();

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

  const availableTabs = getAvailableTabs();

  // Check if user can create/edit facilities
  if (!hasPermission('edit_facility') && !hasPermission('create_facility')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            {tSync("admin.facilities.form.noPermission", "You don't have permission to access facility management.")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
        {/* Breadcrumb */}
        <div className="mb-3">
          <FacilityFormBreadcrumb 
            isEditing={isEditing} 
            facilityName={facility?.name}
            onCancel={onCancel}
          />
        </div>

        {/* Page Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold text-gray-900">
              {isEditing ? `${tSync("admin.facilities.form.edit", "Edit")}: ${facility.name}` : tSync("admin.facilities.form.addNew", "Add New Facility")}
            </h1>
            <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              <Shield className="w-3 h-3" />
              {currentRole}
            </div>
          </div>
          <p className="text-sm text-gray-600">
            {isEditing 
              ? tSync("admin.facilities.form.editDescription", "Update facility information and settings")
              : tSync("admin.facilities.form.createDescription", "Create a new facility with all necessary details")
            }
          </p>
        </div>

        {/* Role-based Info */}
        {currentRole === 'saksbehandler' && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {tSync("admin.facilities.form.limitedAccess", "As a case handler, you have limited access to facility settings. Contact an admin for advanced configuration.")}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Card className="shadow-sm border">
          <CardContent className="p-0">
            <Tabs defaultValue={availableTabs[0]} className="w-full">
              <div className="border-b border-gray-200 px-4 pt-3">
                <TabsList className="grid w-full h-8" style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}>
                  {availableTabs.includes('basic') && (
                    <TabsTrigger value="basic" className="text-xs py-1 px-2">
                      {tSync("admin.facilities.form.tabs.basic", "Basic")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('location') && (
                    <TabsTrigger value="location" className="text-xs py-1 px-2">
                      {tSync("admin.facilities.form.tabs.location", "Location")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('features') && (
                    <TabsTrigger value="features" className="text-xs py-1 px-2">
                      {tSync("admin.facilities.form.tabs.features", "Features")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('pricing') && (
                    <TabsTrigger value="pricing" className="text-xs py-1 px-2">
                      {tSync("admin.facilities.form.tabs.pricing", "Pricing")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('zones') && (
                    <TabsTrigger value="zones" className="text-xs py-1 px-2">
                      {tSync("admin.facilities.form.tabs.zones", "Zones")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('schedule') && (
                    <TabsTrigger value="schedule" className="text-xs py-1 px-2">
                      {tSync("admin.facilities.form.tabs.schedule", "Schedule")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('blackouts') && (
                    <TabsTrigger value="blackouts" className="text-xs py-1 px-2">
                      {tSync("admin.facilities.form.tabs.blackouts", "Blackouts")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('images') && (
                    <TabsTrigger value="images" disabled={!isEditing} className="text-xs py-1 px-2">
                      {tSync("admin.facilities.form.tabs.images", "Images")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('analytics') && (
                    <TabsTrigger value="analytics" disabled={!isEditing} className="text-xs py-1 px-2">
                      {tSync("admin.facilities.form.tabs.analytics", "Analytics")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('advanced') && (
                    <TabsTrigger value="advanced" disabled={!isEditing} className="text-xs py-1 px-2">
                      {tSync("admin.facilities.form.tabs.advanced", "Advanced")}
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="p-4 space-y-4">
                    <TabsContent value="basic" className="mt-0 space-y-4">
                      <EnhancedFacilityBasicSection form={form} />
                      <FacilityContactSection form={form} />
                    </TabsContent>

                    <TabsContent value="location" className="mt-0 space-y-4">
                      <EnhancedFacilityAddressSection form={form} />
                      <FacilitySeasonSection form={form} />
                    </TabsContent>

                    <TabsContent value="features" className="mt-0 space-y-4">
                      <FacilityFeaturesSection form={form} />
                      <FacilityConfigSection form={form} />
                    </TabsContent>

                    <TabsContent value="pricing" className="mt-0 space-y-4">
                      <FacilityPricingSection form={form} />
                    </TabsContent>

                    <TabsContent value="zones" className="mt-0 space-y-4">
                      <FacilityZonesSection form={form} facilityId={facility?.id} />
                    </TabsContent>

                    <TabsContent value="schedule" className="mt-0 space-y-4">
                      <FacilityOpeningHoursSection facilityId={facility?.id} />
                    </TabsContent>

                    <TabsContent value="blackouts" className="mt-0 space-y-4">
                      <FacilityBlackoutSection form={form} facilityId={facility?.id} />
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

                    <TabsContent value="analytics" className="mt-0">
                      {isEditing ? (
                        <Card>
                          <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-4">{tSync("admin.facilities.form.analytics.title", "Facility Analytics")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">0</div>
                                <div className="text-sm text-muted-foreground">{tSync("admin.facilities.form.analytics.totalBookings", "Total Bookings")}</div>
                              </div>
                              <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-green-600">0%</div>
                                <div className="text-sm text-muted-foreground">{tSync("admin.facilities.form.analytics.utilization", "Utilization Rate")}</div>
                              </div>
                              <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">0</div>
                                <div className="text-sm text-muted-foreground">{tSync("admin.facilities.form.analytics.revenue", "Revenue (NOK)")}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <p className="text-sm">{tSync("admin.facilities.form.saveFirstForAnalytics", "Please save the facility first before viewing analytics.")}</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="advanced" className="mt-0">
                      {isEditing ? (
                        <FacilityCalendarManagement facilityId={facility.id} />
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          <p className="text-sm">{tSync("admin.facilities.form.saveFirstForAdvanced", "Please save the facility first before accessing advanced features.")}</p>
                        </div>
                      )}
                    </TabsContent>
                  </div>

                  {/* Form Actions */}
                  <div className="border-t border-gray-200 bg-gray-50 px-4 py-2">
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={onCancel} className="px-3 h-8 text-sm">
                        <X className="w-3 h-3 mr-1" />
                        {tSync("admin.common.cancel", "Cancel")}
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={mutation.isPending || (!hasPermission('create_facility') && !isEditing) || (!hasPermission('edit_facility') && isEditing)} 
                        className="px-3 h-8 text-sm"
                      >
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
