
import React from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ActorType } from '@/types/pricing';
import { EnumSelect } from '@/components/common/EnumSelect';
import { useTranslation } from '@/i18n/hooks/useTranslation';

interface EnhancedCustomerTypeSelectorProps {
  value: ActorType;
  onChange: (value: ActorType) => void;
}

export function EnhancedCustomerTypeSelector({ value, onChange }: EnhancedCustomerTypeSelectorProps) {
  const { t } = useTranslation();
  const requiresApproval = ['lag-foreninger', 'paraply'].includes(value);

  return (
    <div className="space-y-3">
      <EnumSelect
        enumType="ActorType"
        value={value}
        onValueChange={(newValue) => onChange(newValue as ActorType)}
        label={t('forms.labels.actorType')}
        description={t('forms.descriptions.actorType')}
        placeholder={t('forms.placeholders.selectActorType')}
        required
        showDescription={true}
      />

      {requiresApproval && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="font-medium mb-1">{t('forms.messages.requiresApproval')}</div>
            <div className="text-sm">
              {t('forms.descriptions.approvalProcess')}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
