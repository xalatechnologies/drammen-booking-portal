
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { useTranslation } from '@/i18n/hooks/useTranslation';

interface PricingRule {
  id: string;
  name: string;
  facilityId?: number;
  zoneId?: string;
  actorType: string;
  bookingType: string;
  basePrice: number;
  multiplier: number;
  isActive: boolean;
  validFrom: string;
  validTo?: string;
}

interface PricingRulesManagementProps {
  facilityId?: number;
  zoneId?: string;
}

export function PricingRulesManagement({ facilityId, zoneId }: PricingRulesManagementProps) {
  const { t } = useTranslation();
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddRule = () => {
    console.log('Add pricing rule for facility:', facilityId, 'zone:', zoneId);
  };

  const handleEditRule = (ruleId: string) => {
    console.log('Edit pricing rule:', ruleId);
  };

  const handleDeleteRule = (ruleId: string) => {
    console.log('Delete pricing rule:', ruleId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            {t('admin.common.loading', 'Loading pricing rules...')}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {t('admin.facilities.pricing.title', 'Pricing Rules Management')}
          </div>
          <Button onClick={handleAddRule} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            {t('admin.facilities.pricing.addRule', 'Add Rule')}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rules.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">
              {t('admin.facilities.pricing.noPricingRules', 'No pricing rules configured')}
            </p>
            <p className="text-sm text-gray-400">
              {t('admin.facilities.pricing.addRuleDescription', 'Add pricing rules to define custom rates for different user types and booking scenarios')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{rule.name}</h3>
                    <p className="text-sm text-gray-600">
                      {t('admin.facilities.pricing.basePrice', 'Base Price')}: {rule.basePrice} NOK
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('admin.facilities.pricing.multiplier', 'Multiplier')}: {rule.multiplier}x
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditRule(rule.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
