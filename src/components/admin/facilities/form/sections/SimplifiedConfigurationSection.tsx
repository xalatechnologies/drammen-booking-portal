
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FacilityFormData } from '../FacilityFormSchema';

interface SimplifiedConfigurationSectionProps {
  form: UseFormReturn<FacilityFormData>;
}

export function SimplifiedConfigurationSection({ form }: SimplifiedConfigurationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Simplified configuration interface</p>
        </div>
      </CardContent>
    </Card>
  );
}
