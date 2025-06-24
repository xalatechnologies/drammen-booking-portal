
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Facility Name</label>
            <input 
              {...form.register('name')} 
              className="w-full p-2 border rounded-md"
              placeholder="Enter facility name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <input 
              {...form.register('type')} 
              className="w-full p-2 border rounded-md"
              placeholder="Enter facility type"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Area</label>
            <input 
              {...form.register('area')} 
              className="w-full p-2 border rounded-md"
              placeholder="Enter area description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              {...form.register('description')} 
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Enter facility description"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
