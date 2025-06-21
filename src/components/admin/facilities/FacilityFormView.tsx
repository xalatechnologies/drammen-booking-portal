
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FacilityService } from "@/services/facilityService";
import { FacilityFormTabs } from "./FacilityFormTabs";
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
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
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
    mutationFn: (data: any) => {
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

  const onSubmit = async (data: any) => {
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
          <FacilityFormTabs facilityId={facility?.id}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-base font-medium">Name *</Label>
                  <Input
                    id="name"
                    className="h-12 text-base"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message as string}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="type" className="text-base font-medium">Type *</Label>
                  <Select onValueChange={(value) => setValue("type", value)} defaultValue={watch("type")}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select facility type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gym">Gym</SelectItem>
                      <SelectItem value="hall">Hall</SelectItem>
                      <SelectItem value="court">Court</SelectItem>
                      <SelectItem value="room">Room</SelectItem>
                      <SelectItem value="field">Field</SelectItem>
                      <SelectItem value="pool">Pool</SelectItem>
                      <SelectItem value="auditorium">Auditorium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="area" className="text-base font-medium">Area *</Label>
                  <Select onValueChange={(value) => setValue("area", value)} defaultValue={watch("area")}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drammen-sentrum">Drammen Sentrum</SelectItem>
                      <SelectItem value="stromso">Strømsø</SelectItem>
                      <SelectItem value="bragernes">Bragernes</SelectItem>
                      <SelectItem value="tanganvik">Tangen/Åsvik</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="status" className="text-base font-medium">Status</Label>
                  <Select onValueChange={(value) => setValue("status", value)} defaultValue={watch("status")}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="capacity" className="text-base font-medium">Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    className="h-12 text-base"
                    {...register("capacity", { 
                      required: "Capacity is required",
                      min: { value: 1, message: "Capacity must be at least 1" }
                    })}
                  />
                  {errors.capacity && (
                    <p className="text-sm text-red-500">{errors.capacity.message as string}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="area_sqm" className="text-base font-medium">Area (m²)</Label>
                  <Input
                    id="area_sqm"
                    type="number"
                    min="0"
                    step="0.01"
                    className="h-12 text-base"
                    {...register("area_sqm", { 
                      min: { value: 0, message: "Area cannot be negative" }
                    })}
                  />
                  {errors.area_sqm && (
                    <p className="text-sm text-red-500">{errors.area_sqm.message as string}</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="address_street" className="text-base font-medium">Street Address *</Label>
                    <Input
                      id="address_street"
                      className="h-12 text-base"
                      {...register("address_street", { required: "Street address is required" })}
                    />
                    {errors.address_street && (
                      <p className="text-sm text-red-500">{errors.address_street.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="address_postal_code" className="text-base font-medium">Postal Code *</Label>
                    <Input
                      id="address_postal_code"
                      className="h-12 text-base"
                      {...register("address_postal_code", { required: "Postal code is required" })}
                    />
                    {errors.address_postal_code && (
                      <p className="text-sm text-red-500">{errors.address_postal_code.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="address_city" className="text-base font-medium">City *</Label>
                    <Input
                      id="address_city"
                      className="h-12 text-base"
                      {...register("address_city", { required: "City is required" })}
                    />
                    {errors.address_city && (
                      <p className="text-sm text-red-500">{errors.address_city.message as string}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="contact_name" className="text-base font-medium">Contact Name</Label>
                    <Input id="contact_name" className="h-12 text-base" {...register("contact_name")} />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="contact_email" className="text-base font-medium">Contact Email</Label>
                    <Input id="contact_email" type="email" className="h-12 text-base" {...register("contact_email")} />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="contact_phone" className="text-base font-medium">Contact Phone</Label>
                    <Input id="contact_phone" className="h-12 text-base" {...register("contact_phone")} />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-medium">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  className="text-base resize-none"
                  {...register("description")}
                  placeholder="Enter facility description..."
                />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="has_auto_approval"
                  checked={watch("has_auto_approval")}
                  onCheckedChange={(checked) => setValue("has_auto_approval", checked)}
                  className="w-5 h-5"
                />
                <Label htmlFor="has_auto_approval" className="text-base font-medium">Enable automatic booking approval</Label>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button variant="outline" type="button" size="lg" onClick={onCancel} className="text-base px-8 py-3">
                  Cancel
                </Button>
                <Button type="submit" size="lg" disabled={mutation.isPending} className="text-base px-8 py-3">
                  {mutation.isPending ? "Saving..." : (isEditing ? "Update Facility" : "Create Facility")}
                </Button>
              </div>
            </form>
          </FacilityFormTabs>
        </CardContent>
      </Card>
    </div>
  );
};
