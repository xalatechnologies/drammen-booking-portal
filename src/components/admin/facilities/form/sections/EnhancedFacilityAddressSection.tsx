
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { FacilityAddressFields } from '../FacilityAddressFields';
import { UseFormReturn } from 'react-hook-form';
import { FacilityFormData } from '../FacilityFormSchema';

interface EnhancedFacilityAddressSectionProps {
  form: UseFormReturn<FacilityFormData>;
}

export function EnhancedFacilityAddressSection({ form }: EnhancedFacilityAddressSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Address Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FacilityAddressFields form={form} />
      </CardContent>
    </Card>
  );
}
