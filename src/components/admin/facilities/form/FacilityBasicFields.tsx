
import React from "react";
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface FacilityFormData {
  name: string;
  type: string;
  area: string;
  description: string;
  capacity: number;
  area_sqm: number;
  status: string;
  has_auto_approval: boolean;
}

interface FacilityBasicFieldsProps {
  register: UseFormRegister<FacilityFormData>;
  setValue: UseFormSetValue<FacilityFormData>;
  watch: UseFormWatch<FacilityFormData>;
  errors: FieldErrors<FacilityFormData>;
}

export const FacilityBasicFields: React.FC<FacilityBasicFieldsProps> = ({
  register,
  setValue,
  watch,
  errors
}) => {
  return (
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

      <div className="md:col-span-2 space-y-3">
        <Label htmlFor="description" className="text-base font-medium">Description</Label>
        <Textarea
          id="description"
          rows={4}
          className="text-base resize-none"
          {...register("description")}
          placeholder="Enter facility description..."
        />
      </div>

      <div className="md:col-span-2 flex items-center space-x-3">
        <Checkbox
          id="has_auto_approval"
          checked={watch("has_auto_approval")}
          onCheckedChange={(checked) => setValue("has_auto_approval", checked as boolean)}
          className="w-5 h-5"
        />
        <Label htmlFor="has_auto_approval" className="text-base font-medium">Enable automatic booking approval</Label>
      </div>
    </div>
  );
};
