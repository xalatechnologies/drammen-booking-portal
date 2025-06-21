
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FacilityService } from "@/services/facilityService";
import { FacilityFormTabs } from "./FacilityFormTabs";
import { FacilityBasicFields } from "./form/FacilityBasicFields";
import { FacilityAddressFields } from "./form/FacilityAddressFields";
import { FacilityContactFields } from "./form/FacilityContactFields";
import { FacilityFormData } from "./form/types";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FacilityFormViewProps {
  facility?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const FacilityFormView: React.FC<FacilityFormViewProps> = ({
  facility,
  onSuccess,
  onCancel
}) => {
  const isEditing = !!facility;
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FacilityFormData>({
    defaultValues: {
      name: facility?.name || "",
      type: facility?.type || "",
      address_street: facility?.address_street || "",
      address_city: facility?.address_city || "",
      address_postal_code: facility?.address_postal_code || "",
      area: facility?.area || "",
      description: facility?.description || "",
      capacity: facility?.capacity || 1,
      area_sqm: facility?.area_sqm || 0,
      status: facility?.status || "active",
      has_auto_approval: facility?.has_auto_approval || false,
      contact_email: facility?.contact_email || "",
      contact_phone: facility?.contact_phone || "",
      contact_name: facility?.contact_name || "",
    }
  });

  const mutation = useMutation({
    mutationFn: (data: FacilityFormData) => {
      if (isEditing) {
        return FacilityService.updateFacility(facility.id.toString(), data);
      } else {
        return FacilityService.createFacility(data);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Facility ${isEditing ? 'updated' : 'created'} successfully`,
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? 'update' : 'create'} facility`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FacilityFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="w-full space-y-8 p-8">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="lg" onClick={onCancel} className="text-base px-6 py-3">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Facilities
        </Button>
        <h1 className="text-4xl font-bold text-gray-900">
          {isEditing ? `Edit: ${facility.name}` : 'Add New Facility'}
        </h1>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">Facility Management</CardTitle>
        </CardHeader>
        <CardContent>
          <FacilityFormTabs 
            facilityId={facility?.id}
            title="Facility Details"
            actions={
              <div className="flex justify-end space-x-4 pt-6">
                <Button variant="outline" type="button" size="lg" onClick={onCancel} className="text-base px-8 py-3">
                  Cancel
                </Button>
                <Button type="submit" size="lg" disabled={mutation.isPending} className="text-base px-8 py-3">
                  {mutation.isPending ? "Saving..." : (isEditing ? "Update Facility" : "Create Facility")}
                </Button>
              </div>
            }
            onSubmit={handleSubmit(onSubmit)}
          >
            <form className="space-y-8">
              <FacilityBasicFields 
                register={register}
                setValue={setValue}
                watch={watch}
                errors={errors}
              />

              <FacilityAddressFields 
                register={register}
                errors={errors}
              />

              <FacilityContactFields 
                register={register}
              />
            </form>
          </FacilityFormTabs>
        </CardContent>
      </Card>
    </div>
  );
};
