
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign } from 'lucide-react';

interface FacilityPricingSectionProps {
  facilityId?: number;
}

export function FacilityPricingSection({ facilityId }: FacilityPricingSectionProps) {
  const handleAddPricingRule = () => {
    console.log('Add pricing rule for facility:', facilityId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing Rules
          </div>
          <Button onClick={handleAddPricingRule} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!facilityId ? (
          <p className="text-gray-500">Save the facility first to manage pricing rules</p>
        ) : (
          <div className="text-center py-8">
            <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No pricing rules configured</p>
            <p className="text-sm text-gray-400">
              Add pricing rules to customize rates for different user types
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
