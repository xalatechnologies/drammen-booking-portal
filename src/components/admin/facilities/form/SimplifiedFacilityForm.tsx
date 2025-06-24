
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

interface SimplifiedFacilityFormProps {
  facilityId?: number;
  onSuccess?: () => void;
}

export function SimplifiedFacilityForm({ facilityId, onSuccess }: SimplifiedFacilityFormProps) {
  const form = useForm({
    defaultValues: {
      name: '',
      address: '',
      capacity: 0
    }
  });

  const onSubmit = (data: any) => {
    console.log('Save facility:', data);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {facilityId ? 'Edit Facility' : 'Create New Facility'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-center py-8">
              <p className="text-gray-500">Simplified facility form</p>
              <p className="text-sm text-gray-400">Basic facility management interface</p>
            </div>
            
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Save Facility
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
