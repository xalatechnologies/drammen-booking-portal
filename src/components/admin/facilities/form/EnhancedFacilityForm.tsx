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
import { useTranslation } from "@/hooks/useTranslation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFacilityStore } from '@/stores/useGenericFacilityStore';
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
  const { tSync, isInitialized } = useTranslation();
  const { currentRole, hasPermission, canAccessTab, getAvailableTabs } = useRoleBasedAccess();
  const {
    selectedItem: currentFacility,
    create: createFacility,
    update: updateFacility,
    delete: deleteFacility,
    isLoading,
    error,
    formMode,
    closeForm
  } = useFacilityStore();
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
    
    // Set loading state to prevent multiple submissions
    setSectionLoading(true);
    
    try {
      // Save main facility data
      // The generic store returns the entity directly or null if there was an error
      const facilityResult = isEdit && currentFacility
        ? await updateFacility(currentFacility.id, data)
        : await createFacility(data);

      if (!facilityResult) {
        throw new Error('Failed to save facility');
      }

      const facilityId = facilityResult.id;
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
    } finally {
      setSectionLoading(false);
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
  if (!isInitialized) {
    return <div>Loading translations...</div>;
  }
  
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {isEdit ? `${tSync("admin.facilities.form.edit", "Edit")}: ${currentFacility?.name}` : tSync("admin.facilities.form.addNew", "Add New Facility")}
            </h1>
            <div className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
              <Shield className="w-3 h-3" />
              {currentRole}
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-lg">
            {isEdit 
              ? tSync("admin.facilities.form.editDescription", "Update facility information and settings")
              : tSync("admin.facilities.form.createDescription", "Create a new facility with all necessary details")
            }
          </p>
        </div>

        {/* Global Error Summary */}
        {(saveError || sectionErrors.length > 0) && (
          <div className="bg-red-100 text-red-800 p-4 rounded mb-4 border border-red-300" id="validation-error-summary">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {tSync('admin.facilities.form.validationErrors', 'Please correct the following errors:')}
            </h3>
            {saveError && (
              <div className="mt-2">
                {saveError.split('\n').map((line, idx) => {
                  // Check if this is a field: error format
                  const fieldMatch = line.match(/^([^:]+):\s*(.+)$/);
                  if (fieldMatch) {
                    const [, fieldName, errorMessage] = fieldMatch;
                    return (
                      <div key={idx} className="py-1 border-b border-red-200 last:border-0">
                        <span className="font-medium">{fieldName}:</span> {errorMessage}
                      </div>
                    );
                  }
                  return <div key={idx}>{line}</div>;
                })}
              </div>
            )}
            {sectionErrors.length > 0 && (
              <ul className="list-disc ml-6 mt-2">
                {sectionErrors.map((err, idx) => <li key={idx} className="py-1">{err}</li>)}
              </ul>
            )}
          </div>
        )}

        {/* Main Content */}
        <Form {...form}>
          <form onSubmit={(e) => { 
              e.preventDefault();
              console.log('Form submitted');
              form.handleSubmit(onSubmit)(e);
            }} 
            className="space-y-4">
            <Card className="shadow-sm border-0 ring-1 ring-gray-200 overflow-hidden">
              <CardContent className="p-0">
                <Tabs defaultValue={availableTabs[0]} className="w-full">
                  <div className="bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-200 px-6 pt-6 pb-4 mb-4">
                    <TabsList 
                      className="grid w-full gap-2 h-18 bg-white/80 backdrop-blur-sm shadow-sm rounded-lg p-1 border border-gray-100" 
                      style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}
                    >
                      {availableTabs.includes('basic') && (
                        <TabsTrigger 
                          value="basic" 
                          className="text-lg h-14 px-4 font-medium tracking-tight transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-800 data-[state=active]:font-semibold data-[state=active]:shadow-sm rounded-md"
                        >
                          {tSync("admin.facilities.form.tabs.basic", "Basic")}
                        </TabsTrigger>
                      )}
                      {availableTabs.includes('location') && (
                        <TabsTrigger 
                          value="location" 
                          className="text-lg h-14 px-4 font-medium tracking-tight transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-800 data-[state=active]:font-semibold data-[state=active]:shadow-sm rounded-md"
                        >
                          {tSync("admin.facilities.form.tabs.location", "Location")}
                        </TabsTrigger>
                      )}
                      {availableTabs.includes('features') && (
                        <TabsTrigger 
                          value="features" 
                          className="text-lg h-14 px-4 font-medium tracking-tight transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-800 data-[state=active]:font-semibold data-[state=active]:shadow-sm rounded-md"
                        >
                          {tSync("admin.facilities.form.tabs.features", "Features")}
                        </TabsTrigger>
                      )}
                      {availableTabs.includes('pricing') && (
                        <TabsTrigger 
                          value="pricing" 
                          className="text-lg h-14 px-4 font-medium tracking-tight transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-800 data-[state=active]:font-semibold data-[state=active]:shadow-sm rounded-md"
                        >
                          {tSync("admin.facilities.form.tabs.pricing", "Pricing")}
                        </TabsTrigger>
                      )}
                      {/* {availableTabs.includes('zones') && (
                        <TabsTrigger 
                          value="zones" 
                          className="text-lg h-14 px-4 font-medium tracking-tight transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-800 data-[state=active]:font-semibold data-[state=active]:shadow-sm rounded-md"
                        >
                          {tSync("admin.facilities.form.tabs.zones", "Zones")}
                        </TabsTrigger>
                      )} */}
                      {/* Schedule tab removed - content moved to basic tab */}
                      {availableTabs.includes('blackouts') && (
                        <TabsTrigger 
                          value="blackouts" 
                          className="text-lg h-14 px-4 font-medium tracking-tight transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-800 data-[state=active]:font-semibold data-[state=active]:shadow-sm rounded-md"
                        >
                          {tSync("admin.facilities.form.tabs.blackouts", "Blackouts")}
                        </TabsTrigger>
                      )}
                      {availableTabs.includes('images') && (
                        <TabsTrigger 
                          value="images" 
                          disabled={!isEdit} 
                          className="text-lg h-12 px-4 font-medium tracking-tight transition-all data-[state=active]:bg-blue-50 data-[state=active]:text-blue-800 data-[state=active]:font-semibold data-[state=active]:shadow-sm data-[state=inactive]:opacity-70 rounded-md"
                        >
                          {tSync("admin.facilities.form.tabs.images", "Images")}
                        </TabsTrigger>
                      )}
                    </TabsList>
                  </div>
                  
                  <div className="w-full px-4 sm:px-6 lg:px-8 p-6 bg-white rounded">
                    {saveSuccess && (
                      <div className="bg-green-100 text-green-800 p-4 rounded mb-4 text-lg font-semibold border border-green-300">
                        {tSync('admin.facilities.form.saveSuccess', 'Facility saved successfully!')}
                      </div>
                    )}
                    <TabsContent value="basic" className="space-y-8 pt-2">
                      <EnhancedFacilityBasicSection form={form} />
                      <FacilityZonesSection ref={zonesRef} facilityId={currentFacility?.id?.toString()} />
                      <FacilityOpeningHoursSection ref={openingHoursRef} facilityId={currentFacility?.id} />
                    </TabsContent>
                    <TabsContent value="location" className="space-y-8 pt-2">
                      <EnhancedFacilityAddressSection form={form} />
                    </TabsContent>
                    <TabsContent value="contact" className="space-y-8 pt-2">
                      <FacilityContactSection form={form} />
                    </TabsContent>
                    <TabsContent value="config" className="space-y-8 pt-2">
                      <FacilityConfigSection form={form} />
                    </TabsContent>
                    <TabsContent value="features" className="space-y-8 pt-2">
                      <FacilityFeaturesSection form={form} equipment={watchedEquipment} amenities={watchedAmenities} capacity={watchedCapacity} />
                    </TabsContent>
                    <TabsContent value="pricing" className="space-y-8 pt-2">
                      <FacilityPricingSection ref={pricingRulesRef} form={form} facilityId={currentFacility?.id} />
                    </TabsContent>
                    {/* <TabsContent value="zones" className="space-y-8 pt-2">
                      <FacilityZonesSection ref={zonesRef} facilityId={currentFacility?.id} />
                    </TabsContent> */}
                    {/* Schedule tab removed - content moved to basic tab */}
                    <TabsContent value="blackouts" className="space-y-8 pt-2">
                      <FacilityBlackoutSection ref={blackoutsRef} facilityId={currentFacility?.id} form={form} />
                    </TabsContent>
                    <TabsContent value="images" className="space-y-8 pt-2">
                      <FacilityImageManagement facilityId={currentFacility?.id} />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
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
              <Button 
                type="button" 
                className="h-12 px-6 text-lg font-bold" 
                disabled={globalLoading}
                onClick={async () => {
                  console.log('Save button clicked directly submitting');
                  setSectionLoading(true);
                  setSaveError(null);
                  clearSectionErrors();
                  setSaveSuccess(false);
                  
                  try {
                    // Get values directly from form
                    const formValues = form.getValues();
                    console.log('Form values to submit:', formValues);
                    
                    // Validate before submitting
                    const isValid = await form.trigger();
                    if (!isValid) {
                      console.error('Form validation failed');
                      const formErrors = form.formState.errors;
                      console.log('Validation errors:', formErrors);
                      
                      // Create a more user-friendly summary of validation errors
                      const errorFields = Object.entries(formErrors).map(([field, error]) => {
                        // Convert camelCase field names to user-friendly format
                        const fieldName = field
                          .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                          .replace(/_/g, ' ') // Replace underscores with spaces
                          .trim() // Remove extra spaces
                          .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
                        
                        return `${fieldName}: ${error.message}`;
                      });
                      
                      // Set descriptive error message
                      setSaveError(
                        `${errorFields.join('\n')}`
                      );
                      
                      // Show toast notification for validation errors
                      toast({
                        title: tSync('admin.facilities.form.validationFailed', 'Validation Failed'),
                        description: tSync('admin.facilities.form.validationErrorsPresent', 'Please correct the highlighted fields'),
                        variant: "destructive"
                      });
                      
                      // Find which tab contains the first error and switch to it
                      const firstErrorField = Object.keys(formErrors)[0];
                      
                      if (firstErrorField) {
                        try {
                          // Determine which tab contains the error
                          let tabToActivate = 'basic';
                          
                          // Map fields to tabs (add more mappings as needed)
                          const fieldToTabMap: Record<string, string> = {
                            // Basic tab fields
                            'name': 'basic',
                            'type': 'basic',
                            'description': 'basic',
                            'capacity': 'basic',
                            'area_sqm': 'basic',
                            'status': 'basic',
                            // Location tab fields
                            'address_street': 'location',
                            'address_city': 'location',
                            'address_postal_code': 'location',
                            'latitude': 'location',
                            'longitude': 'location',
                            // Features tab
                            'equipment': 'features',
                            'amenities': 'features',
                            'accessibility_features': 'features',
                            // And so on for other tabs
                          };
                          
                          if (fieldToTabMap[firstErrorField]) {
                            tabToActivate = fieldToTabMap[firstErrorField];
                          }
                          
                          // Activate the tab containing the error
                          const tabTrigger = document.querySelector(`[data-state="inactive"][value="${tabToActivate}"]`) as HTMLButtonElement;
                          if (tabTrigger) {
                            console.log(`Switching to tab: ${tabToActivate}`);
                            tabTrigger.click();
                          }
                          
                          // Scroll to error element after a short delay to allow tab switch
                          setTimeout(() => {
                            const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
                            if (errorElement) {
                              errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              // Add a pulsing outline to highlight the field
                              errorElement.classList.add('ring-2', 'ring-red-500', 'animate-pulse');
                              setTimeout(() => {
                                errorElement.classList.remove('animate-pulse');
                              }, 2000);
                            } else {
                              // If we couldn't find the element, scroll to the error summary
                              const errorSummary = document.getElementById('validation-error-summary');
                              if (errorSummary) {
                                errorSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }
                          }, 100);
                        } catch (e) {
                          console.error('Error handling validation display:', e);
                          // Fallback: scroll to error summary
                          const errorSummary = document.getElementById('validation-error-summary');
                          if (errorSummary) {
                            errorSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                      }
                      return;
                    }
                    
                    // Save main facility data directly
                    const facilityResult = isEdit && currentFacility
                      ? await updateFacility(currentFacility.id.toString(), formValues)
                      : await createFacility(formValues);

                    if (!facilityResult) {
                      throw new Error('Failed to save facility');
                    }
                    
                    const facilityId = facilityResult.id;
                    console.log('Facility saved successfully:', facilityId);
                    
                    // Save data from other sections
                    console.log('EnhancedFacilityForm - Starting to save sections for facility ID:', facilityId);
                    
                    // Create array of section refs with names for better debugging
                    const sectionRefs = [
                      { name: 'Opening Hours', ref: openingHoursRef.current },
                      { name: 'Zones', ref: zonesRef.current },
                      { name: 'Blackouts', ref: blackoutsRef.current },
                      { name: 'Pricing Rules', ref: pricingRulesRef.current },
                    ];
                    
                    // Log which sections are available to save
                    sectionRefs.forEach(section => {
                      console.log(`EnhancedFacilityForm - Section ${section.name} ref exists:`, !!section.ref);
                    });
                    
                    // Filter out sections that don't have refs or don't have saveData method
                    const validSectionRefs = sectionRefs.filter(section => {
                      const hasRef = !!section.ref;
                      const hasSaveMethod = hasRef && typeof section.ref.saveData === 'function';
                      
                      if (hasRef && !hasSaveMethod) {
                        console.warn(`EnhancedFacilityForm - Section ${section.name} has ref but no saveData method`);
                      }
                      
                      return hasRef && hasSaveMethod;
                    });
                    
                    const savePromises = validSectionRefs.map(section => ({
                      name: section.name,
                      promise: section.ref!.saveData()
                    }));
                    
                    console.log(`EnhancedFacilityForm - Executing ${savePromises.length} section save promises`);
                    
                    // Execute each save promise individually to better track which one fails
                    const results = [];
                    const sectionSaveErrors = [];
                    
                    for (const { name, promise } of savePromises) {
                      try {
                        console.log(`EnhancedFacilityForm - Saving section: ${name}`);
                        
                        // Handle potential promise rejection
                        let result;
                        try {
                          result = await promise;
                        } catch (promiseError) {
                          console.error(`EnhancedFacilityForm - Promise rejected for section ${name}:`, promiseError);
                          throw promiseError;
                        }
                        
                        console.log(`EnhancedFacilityForm - Section ${name} save result:`, result);
                        results.push(result);
                        
                        if (!result) {
                          console.error(`EnhancedFacilityForm - Failed to save section: ${name}`);
                          sectionSaveErrors.push(`Failed to save ${name}.`);
                        }
                      } catch (error) {
                        console.error(`EnhancedFacilityForm - Error saving section ${name}:`, error);
                        results.push(false);
                        sectionSaveErrors.push(`Error saving ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                      }
                    }
                    
                    console.log('EnhancedFacilityForm - All section save results:', results);
                    console.log('EnhancedFacilityForm - Section save errors:', sectionSaveErrors);

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
                    console.error('Save error:', err);
                  } finally {
                    setSectionLoading(false);
                  }
                }}
              >
                {globalLoading ? "Saving..." : (isEdit ? tSync('admin.facilities.form.save', 'Save Changes') : tSync('admin.facilities.form.create', 'Create Facility'))}
              </Button>
              {closeForm && (
                <Button type="button" variant="secondary" onClick={closeForm} className="h-12 px-6 text-lg">
                  {tSync('admin.facilities.form.cancel', 'Cancel')}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
