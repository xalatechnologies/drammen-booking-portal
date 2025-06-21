
import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FacilityFormData } from "./types";

interface FacilityContactFieldsProps {
  register: UseFormRegister<FacilityFormData>;
}

export const FacilityContactFields: React.FC<FacilityContactFieldsProps> = ({
  register
}) => {
  return (
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
  );
};
