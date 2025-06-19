
import React from 'react';
import { CreditCard } from 'lucide-react';
import { ActorType } from '@/types/pricing';
import { EnumSelect } from '@/components/common/EnumSelect';
import { useTranslation } from '@/i18n/hooks/useTranslation';

interface CustomerTypeSelectorProps {
  value: ActorType;
  onChange: (value: ActorType) => void;
}

export function CustomerTypeSelector({ value, onChange }: CustomerTypeSelectorProps) {
  const { t } = useTranslation();

  return (
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
  );
}
