
import React, { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
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
import { Save, X, Shield, AlertCircle, Loader2 } from "lucide-react";
import { useJsonTranslation } from "@/hooks/useJsonTranslation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFacilityAdminStore } from '@/stores/useFacilityAdminStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface EnhancedFacilityFormProps {
  onSuccess?: () => void;
}

// Define ref interfaces for each section that needs to save data
interface SectionSaveRef {
  saveData: () => Promise<boolean>;
}

export const EnhancedFacilityForm: React.FC<EnhancedFacilityFormProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();
  const { tSync } = useJsonTranslation();
  const { currentRole, hasPermission, canAccessTab, getAvailableTabs } = useRoleBasedAccess();
  const {
    currentFacility,
    createFacility,
    updateFacility,
    deleteFacility,
    isLoading,
    error,
    formMode,
    closeForm
  } = useFacilityAdminStore();
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState<boolean>(false);
  const [sectionErrors, setSectionErrors] = React.useState<string[]>([]);
  const [sectionLoading, setSectionLoading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  console.log('EnhancedFacilityForm: currentFacility', currentFacility);

  const isEdit = formMode === 'edit';

  // Create refs for sections that need to save their own data
  const openingHoursRef = useRef<SectionSaveRef>(null);
  const zonesRef = useRef<SectionSaveRef>(null);
  const blackoutsRef = useRef<SectionSaveRef>(null);
  const pricingRulesRef = useRef<SectionSaveRef>(null);

  const form = useForm<FacilityFormData>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: isEdit && currentFacility ? currentFacility : {
      name: currentFacility?.name || "",
      type: currentFacility?.type || "",
      area: currentFacility?.area || "",
      description: currentFacility?.description || "",
      capacity: currentFacility?.capacity || 1,
      area_sqm: currentFacility?.area_sqm || 0,
      address_street: currentFacility?.address_street || "",
      address_city: currentFacility?.address_city || "",
      address_postal_code: currentFacility?.address_postal_code || "",
      address_country: currentFacility?.address_country || "Norway",
      contact_name: currentFacility?.contact_name || "",
      contact_email: currentFacility?.contact_email || "",
      contact_phone: currentFacility?.contact_phone || "",
      status: currentFacility?.status || "active",
      has_auto_approval: currentFacility?.has_auto_approval || false,
      price_per_hour: currentFacility?.price_per_hour || 450,
      time_slot_duration: currentFacility?.time_slot_duration || 1,
      booking_lead_time_hours: currentFacility?.booking_lead_time_hours || 2,
      max_advance_booking_days: currentFacility?.max_advance_booking_days || 365,
      cancellation_deadline_hours: currentFacility?.cancellation_deadline_hours || 24,
      allowed_booking_types: currentFacility?.allowed_booking_types || ["engangs"],
      equipment: currentFacility?.equipment || [],
      amenities: currentFacility?.amenities || [],
      accessibility_features: currentFacility?.accessibility_features || [],
      latitude: currentFacility?.latitude || undefined,
      longitude: currentFacility?.longitude || undefined,
      season_from: currentFacility?.season_from || "",
      season_to: currentFacility?.season_to || "",
      is_featured: currentFacility?.is_featured || false,
    }
  });

  useEffect(() => {
    console.log('EnhancedFacilityForm useEffect: isEdit', isEdit, 'currentFacility', currentFacility);
    if (isEdit && currentFacility) {
      form.reset(currentFacility);
    } else {
      form.reset({});
    }
  }, [isEdit, currentFacility]);

  // Watch form values to pass to components
  const watchedEquipment = form.watch("equipment");
  const watchedAmenities = form.watch("amenities");
  const watchedCapacity = form.watch("capacity");

  // Helper to show global loading if main or any section is loading
  const globalLoading = isLoading || sectionLoading;

  // Helper to collect section errors
  const handleSectionError = (err: string) => {
    setSectionErrors(prev => [...prev, err]);
  };
  const clearSectionErrors = () => setSectionErrors([]);

  const onSubmit = async (data: FacilityFormData) => {
    console.log('onSubmit handler triggered');
    setSaveError(null);
    clearSectionErrors(); // Clear previous section errors
    setSaveSuccess(false);
    console.log('EnhancedFacilityForm onSubmit: data', data);

    try {
      // Save main facility data
      const facilityResult = isEdit && currentFacility
        ? await updateFacility(currentFacility.id.toString(), data)
        : await createFacility(data);

      if (facilityResult.error || !facilityResult.data) {
        throw new Error(facilityResult.error || 'Failed to save facility');
      }

      const facilityId = facilityResult.data.id;
      console.log('Facility saved successfully:', facilityId);
      
      // Save data from other sections
      const savePromises = [
        openingHoursRef.current?.saveData(),
        zonesRef.current?.saveData(),
        blackoutsRef.current?.saveData(),
        pricingRulesRef.current?.saveData(),
      ].filter(Boolean);

      const results = await Promise.all(savePromises);
      const sectionSaveErrors = results.reduce((errors, result, index) => {
        if (!result) {
          // This is a bit generic. In a real app, you'd want more specific error messages from each section
          const sectionName = ['Opening Hours', 'Zones', 'Blackouts', 'Pricing Rules'][index];
          errors.push(`Failed to save ${sectionName}.`);
        }
        return errors;
      }, [] as string[]);

      if (sectionSaveErrors.length > 0) {
        setSectionErrors(sectionSaveErrors);
        throw new Error('Some sections failed to save.');
      }

      setSaveSuccess(true);
      toast({
        title: "Success",
        description: `Facility ${isEdit ? 'updated' : 'created'} successfully.`,
      });
      if (onSuccess) onSuccess();
      closeForm();

    } catch (err: unknown) {
      const error = err as Error;
      setSaveError(error.message || 'An unknown error occurred.');
      console.error('EnhancedFacilityForm onSubmit: error', err);
    }
  };

  const handleDelete = async () => {
    if (!currentFacility) return;
    setIsDeleting(true);
    try {
      await deleteFacility(currentFacility.id.toString());
      toast({
        title: "Facility Deleted",
        description: "The facility has been permanently removed.",
      });
      closeForm();
    } catch (error) {
      toast({
        title: "Error Deleting Facility",
        description: "Could not delete the facility. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const availableTabs = getAvailableTabs().filter(tab => tab !== 'analytics' && tab !== 'advanced');

  // Early returns *after* all hooks have been called
  if (isEdit && !currentFacility) {
    return <div>Loading facility data...</div>;
  }
  
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
    <div className="min-h-screen bg-gray-50 relative">
      {/* Full-page loading spinner overlay */}
      {globalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <Loader2 className="animate-spin w-16 h-16 text-blue-600" />
        </div>
      )}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <FacilityFormBreadcrumb 
            isEditing={isEdit} 
            facilityName={currentFacility?.name}
            onCancel={closeForm}
          />
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {isEdit ? `${tSync("admin.facilities.form.edit", "Edit")}: ${currentFacility?.name}` : tSync("admin.facilities.form.addNew", "Add New Facility")}
            </h1>
            <div className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
              <Shield className="w-3 h-3" />
              {currentRole}
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">
            {isEdit 
              ? tSync("admin.facilities.form.editDescription", "Update facility information and settings")
              : tSync("admin.facilities.form.createDescription", "Create a new facility with all necessary details")
            }
          </p>
        </div>

        {/* Role-based Info */}
        {currentRole === 'saksbehandler' && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              {tSync("admin.facilities.form.limitedAccess", "As a case handler, you have limited access to facility settings. Contact an admin for advanced configuration.")}
            </AlertDescription>
          </Alert>
        )}

        {/* Global Error Summary */}
        {(saveError || sectionErrors.length > 0) && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-4 text-lg font-semibold border border-red-300">
            {saveError && <div>{saveError}</div>}
            {sectionErrors.length > 0 && (
              <ul className="list-disc ml-6 mt-2">
                {sectionErrors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            )}
          </div>
        )}

        {/* Main Content */}
        <Card className="shadow-sm border-0 ring-1 ring-gray-200">
          <CardContent className="p-0">
            <Tabs defaultValue={availableTabs[0]} className="w-full">
              <div className="border-b border-gray-100 px-6 pt-6 pb-2">
                <TabsList className="grid w-full gap-2" style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}>
                  {availableTabs.includes('basic') && (
                    <TabsTrigger value="basic" className="text-xl h-14 px-6 font-bold">
                      {tSync("admin.facilities.form.tabs.basic", "Basic")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('location') && (
                    <TabsTrigger value="location" className="text-xl h-14 px-6 font-bold">
                      {tSync("admin.facilities.form.tabs.location", "Location")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('features') && (
                    <TabsTrigger value="features" className="text-xl h-14 px-6 font-bold">
                      {tSync("admin.facilities.form.tabs.features", "Features")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('pricing') && (
                    <TabsTrigger value="pricing" className="text-xl h-14 px-6 font-bold">
                      {tSync("admin.facilities.form.tabs.pricing", "Pricing")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('zones') && (
                    <TabsTrigger value="zones" className="text-xl h-14 px-6 font-bold">
                      {tSync("admin.facilities.form.tabs.zones", "Zones")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('schedule') && (
                    <TabsTrigger value="schedule" className="text-xl h-14 px-6 font-bold">
                      {tSync("admin.facilities.form.tabs.schedule", "Schedule")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('blackouts') && (
                    <TabsTrigger value="blackouts" className="text-xl h-14 px-6 font-bold">
                      {tSync("admin.facilities.form.tabs.blackouts", "Blackouts")}
                    </TabsTrigger>
                  )}
                  {availableTabs.includes('images') && (
                    <TabsTrigger value="images" disabled={!isEdit} className="text-xl h-14 px-6 font-bold">
                      {tSync("admin.facilities.form.tabs.images", "Images")}
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full px-4 sm:px-6 lg:px-8 space-y-4 p-6 bg-white rounded shadow">
                  {saveSuccess && (
                    <div className="bg-green-100 text-green-800 p-4 rounded mb-4 text-lg font-semibold border border-green-300">
                      {tSync('admin.facilities.form.saveSuccess', 'Facility saved successfully!')}
                    </div>
                  )}
                  <TabsContent value="basic" className="space-y-6">
                    <EnhancedFacilityBasicSection form={form} />
                  </TabsContent>
                  <TabsContent value="location" className="space-y-6">
                    <EnhancedFacilityAddressSection form={form} />
                  </TabsContent>
                  <TabsContent value="contact" className="space-y-6">
                    <FacilityContactSection form={form} />
                  </TabsContent>
                  <TabsContent value="config" className="space-y-6">
                    <FacilityConfigSection form={form} />
                  </TabsContent>
                  <TabsContent value="features" className="space-y-6">
                    <FacilityFeaturesSection form={form} equipment={watchedEquipment} amenities={watchedAmenities} capacity={watchedCapacity} />
                  </TabsContent>
                  <TabsContent value="pricing" className="space-y-6">
                    <FacilityPricingSection ref={pricingRulesRef} form={form} facilityId={currentFacility?.id} />
                  </TabsContent>
                  <TabsContent value="zones" className="space-y-6">
                    <FacilityZonesSection ref={zonesRef} facilityId={currentFacility?.id} />
                  </TabsContent>
                  <TabsContent value="schedule" className="space-y-6">
                    <FacilityOpeningHoursSection ref={openingHoursRef} facilityId={currentFacility?.id} />
                  </TabsContent>
                  <TabsContent value="blackouts" className="space-y-6">
                    <FacilityBlackoutSection ref={blackoutsRef} facilityId={currentFacility?.id} form={form} />
                  </TabsContent>
                  <TabsContent value="images" className="space-y-6">
                    <FacilityImageManagement facilityId={currentFacility?.id} />
                  </TabsContent>
                  {/* Add more sections as needed */}
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <div className="flex justify-end gap-4 mt-8">
                    {isEdit && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="h-12 px-6 text-lg font-bold" disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the
                              facility and all its related data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    <Button type="submit" className="h-12 px-6 text-lg font-bold" disabled={isLoading}>
                      {isLoading ? "Saving..." : (isEdit ? tSync('admin.facilities.form.save', 'Save Changes') : tSync('admin.facilities.form.create', 'Create Facility'))}
                    </Button>
                    {closeForm && (
                      <Button type="button" variant="secondary" onClick={closeForm} className="h-12 px-6 text-lg">
                        {tSync('admin.facilities.form.cancel', 'Cancel')}
                      </Button>
                    )}
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
