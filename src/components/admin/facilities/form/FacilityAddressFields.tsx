
import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FacilityFormData {
  address_street: string;
  address_city: string;
  address_postal_code: string;
}

interface FacilityAddressFieldsProps {
  register: UseFormRegister<FacilityFormData>;
  errors: FieldErrors<FacilityFormData>;
}

export const FacilityAddressFields: React.FC<FacilityAddressFieldsProps> = ({
  register,
  errors
}) => {
  return (
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
  );
};
