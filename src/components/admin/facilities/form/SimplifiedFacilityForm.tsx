
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacilityService } from "@/services/facilityService";
import { facilityFormSchema, FacilityFormData } from "./FacilityFormSchema";
import { SimplifiedBasicSection } from "./sections/SimplifiedBasicSection";
import { SimplifiedConfigurationSection } from "./sections/SimplifiedConfigurationSection";
import { SimplifiedManagementSection } from "./sections/SimplifiedManagementSection";
import { ArrowLeft, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SimplifiedFacilityFormProps {
  facility?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const SimplifiedFacilityForm: React.FC<SimplifiedFacilityFormProps> = ({
  facility,
  onSuccess,
  onCancel
}) => {
  const queryClient = useQueryClient();
  const isEditing = !!facility;
  const [activeTab, setActiveTab] = useState("basic");
  
  // Refs for sections that need to save their own data
  const configRef = useRef<{ saveData: () => Promise<boolean> }>(null);
  const managementRef = useRef<{ saveData: () => Promise<boolean> }>(null);

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

  // Watch the name field to pass to management section
  const facilityName = form.watch("name");

  const mutation = useMutation({
    mutationFn: async (data: FacilityFormData) => {
      console.log('Saving facility data...');
      
      // First save the main facility data
      let facilityResult;
      if (isEditing) {
        facilityResult = await FacilityService.updateFacility(facility.id.toString(), data);
      } else {
        facilityResult = await FacilityService.createFacility(data);
      }

      if (!facilityResult.success) {
        throw new Error(facilityResult.error?.message || 'Failed to save facility');
      }

      console.log('Facility saved successfully');

      // Save data from other sections if facility is saved
      const savePromises = [];

      if (configRef.current) {
        console.log('Saving configuration data...');
        savePromises.push(configRef.current.saveData());
      }

      if (managementRef.current && isEditing) {
        console.log('Saving management data...');
        savePromises.push(managementRef.current.saveData());
      }

      // Wait for all section saves to complete
      if (savePromises.length > 0) {
        const results = await Promise.all(savePromises);
        const failed = results.some(result => !result);
        if (failed) {
          console.warn('Some sections failed to save, but facility was saved successfully');
        }
      }

      return facilityResult;
    },
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Success",
          description: `Facility ${isEditing ? 'updated' : 'created'} successfully`,
        });
        queryClient.invalidateQueries({ queryKey: ['facilities'] });
        onSuccess();
      }
    },
    onError: (error: any) => {
      console.error('Facility save error:', error);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={onCancel} className="text-base">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Facilities
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditing ? `Edit: ${facility.name}` : 'Add New Facility'}
          </h1>
          <p className="text-gray-600 text-lg">
            {isEditing 
              ? 'Update facility information and settings'
              : 'Create a new facility with all necessary details'
            }
          </p>
        </div>

        {/* Main Form */}
        <Card className="shadow-sm border-0 ring-1 ring-gray-200">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-gray-100 px-8 pt-8 pb-4">
                <TabsList className="grid w-full grid-cols-3 h-12 text-base">
                  <TabsTrigger value="basic" className="text-base font-medium">
                    Basic Information
                  </TabsTrigger>
                  <TabsTrigger value="configuration" className="text-base font-medium">
                    Configuration
                  </TabsTrigger>
                  <TabsTrigger 
                    value="management" 
                    disabled={!isEditing} 
                    className="text-base font-medium"
                  >
                    Management
                  </TabsTrigger>
                </TabsList>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="p-8">
                    <TabsContent value="basic" className="mt-0">
                      <SimplifiedBasicSection form={form} />
                    </TabsContent>

                    <TabsContent value="configuration" className="mt-0">
                      <SimplifiedConfigurationSection 
                        form={form} 
                        facilityId={facility?.id}
                        ref={configRef}
                      />
                    </TabsContent>

                    <TabsContent value="management" className="mt-0">
                      {isEditing ? (
                        <SimplifiedManagementSection 
                          facilityId={facility.id}
                          facilityName={facilityName || facility.name}
                          ref={managementRef}
                        />
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <p className="text-lg">Save the facility first to access management features.</p>
                        </div>
                      )}
                    </TabsContent>
                  </div>

                  {/* Form Actions */}
                  <div className="border-t border-gray-100 px-8 py-6 bg-gray-50">
                    <div className="flex justify-end space-x-4">
                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={onCancel}
                        className="text-base px-6 py-3"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={mutation.isPending}
                        className="text-base px-6 py-3"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {mutation.isPending ? "Saving..." : (isEditing ? "Update Facility" : "Create Facility")}
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
