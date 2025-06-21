
import React from "react";
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
      price_per_hour: facility?.price_per_hour || 450,
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

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to List
        </Button>
        <h2 className="text-2xl font-bold">
          {isEditing ? 'Edit Facility' : 'Add New Facility'}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Facility Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select onValueChange={(value) => setValue("type", value)} defaultValue={watch("type")}>
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="area">Area *</Label>
                <Select onValueChange={(value) => setValue("area", value)} defaultValue={watch("area")}>
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => setValue("status", value)} defaultValue={watch("status")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  {...register("capacity", { 
                    required: "Capacity is required",
                    min: { value: 1, message: "Capacity must be at least 1" }
                  })}
                />
                {errors.capacity && (
                  <p className="text-sm text-red-500">{errors.capacity.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_per_hour">Price per Hour (NOK) *</Label>
                <Input
                  id="price_per_hour"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("price_per_hour", { 
                    required: "Price is required",
                    min: { value: 0, message: "Price cannot be negative" }
                  })}
                />
                {errors.price_per_hour && (
                  <p className="text-sm text-red-500">{errors.price_per_hour.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address_street">Street Address *</Label>
                  <Input
                    id="address_street"
                    {...register("address_street", { required: "Street address is required" })}
                  />
                  {errors.address_street && (
                    <p className="text-sm text-red-500">{errors.address_street.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_postal_code">Postal Code *</Label>
                  <Input
                    id="address_postal_code"
                    {...register("address_postal_code", { required: "Postal code is required" })}
                  />
                  {errors.address_postal_code && (
                    <p className="text-sm text-red-500">{errors.address_postal_code.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_city">City *</Label>
                  <Input
                    id="address_city"
                    {...register("address_city", { required: "City is required" })}
                  />
                  {errors.address_city && (
                    <p className="text-sm text-red-500">{errors.address_city.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">Contact Name</Label>
                  <Input id="contact_name" {...register("contact_name")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input id="contact_email" type="email" {...register("contact_email")} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input id="contact_phone" {...register("contact_phone")} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                {...register("description")}
                placeholder="Enter facility description..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="has_auto_approval"
                checked={watch("has_auto_approval")}
                onCheckedChange={(checked) => setValue("has_auto_approval", checked)}
              />
              <Label htmlFor="has_auto_approval">Enable automatic booking approval</Label>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : (isEditing ? "Update" : "Create")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
