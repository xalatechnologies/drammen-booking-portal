
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';
import { FacilityBasicFields } from '../FacilityBasicFields';
import { UseFormReturn } from 'react-hook-form';
import { FacilityFormData } from '../FacilityFormSchema';

interface EnhancedFacilityBasicSectionProps {
  form: UseFormReturn<FacilityFormData>;
}

export function EnhancedFacilityBasicSection({ form }: EnhancedFacilityBasicSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FacilityBasicFields form={form} />
      </CardContent>
    </Card>
  );
}
