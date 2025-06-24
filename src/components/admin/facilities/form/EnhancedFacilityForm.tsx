
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnhancedFacilityBasicSection } from "./sections/EnhancedFacilityBasicSection";
import { EnhancedFacilityAddressSection } from "./sections/EnhancedFacilityAddressSection";
import { FacilityContactSection } from "./sections/FacilityContactSection";
import { FacilityConfigSection } from "./sections/FacilityConfigSection";
import { FacilityFeaturesSection } from "./sections/FacilityFeaturesSection";
import { FacilityPricingSection } from "./sections/FacilityPricingSection";
import { FacilityZonesSection } from "./sections/FacilityZonesSection";
import { FacilityBlackoutSection } from "./sections/FacilityBlackoutSection";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { facilityFormSchema, FacilityFormData } from "./FacilityFormSchema";
import { Form } from "@/components/ui/form";

interface EnhancedFacilityFormProps {
  facilityId?: number;
  onSuccess?: () => void;
}

export function EnhancedFacilityForm({ facilityId, onSuccess }: EnhancedFacilityFormProps) {
  const form = useForm<FacilityFormData>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: {
      name: '',
      type: '',
      area: '',
      description: '',
      status: 'active',
      address_street: '',
      address_city: '',
      address_postal_code: '',
      address_country: 'Norway',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      capacity: 1,
      price_per_hour: 450,
      time_slot_duration: 1,
      has_auto_approval: false,
      booking_lead_time_hours: 2,
      max_advance_booking_days: 365,
      cancellation_deadline_hours: 24,
      amenities: [],
      equipment: [],
      accessibility_features: [],
      allowed_booking_types: ['engangs'],
      is_featured: false
    }
  });

  const handleSubmit = (data: FacilityFormData) => {
    console.log('Enhanced facility form submission:', data);
    if (onSuccess) {
      onSuccess();
    }
  };

  const watchedValues = form.watch();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {facilityId ? 'Edit Facility' : 'Create New Facility'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <EnhancedFacilityBasicSection form={form} />
                <EnhancedFacilityAddressSection form={form} />
                <FacilityContactSection form={form} />
              </div>
              
              <div className="space-y-6">
                <FacilityConfigSection form={form} />
                <FacilityFeaturesSection 
                  form={form} 
                  equipment={watchedValues.equipment || []}
                  amenities={watchedValues.amenities || []}
                  capacity={watchedValues.capacity || 1}
                />
              </div>
            </div>

            {facilityId && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <FacilityPricingSection facilityId={facilityId} />
                <FacilityZonesSection facilityId={facilityId} />
              </div>
            )}

            {facilityId && (
              <FacilityBlackoutSection facilityId={facilityId} />
            )}

            <div className="flex gap-3 pt-6">
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {facilityId ? 'Update Facility' : 'Create Facility'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
