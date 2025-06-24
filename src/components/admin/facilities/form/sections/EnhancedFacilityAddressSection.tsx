
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Street Address</label>
            <input 
              {...form.register('address_street')} 
              className="w-full p-2 border rounded-md"
              placeholder="Enter street address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input 
                {...form.register('address_city')} 
                className="w-full p-2 border rounded-md"
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Postal Code</label>
              <input 
                {...form.register('address_postal_code')} 
                className="w-full p-2 border rounded-md"
                placeholder="Enter postal code"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input 
              {...form.register('address_country')} 
              className="w-full p-2 border rounded-md"
              defaultValue="Norway"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
