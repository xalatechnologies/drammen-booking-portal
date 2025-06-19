
import React from 'react';
import { CreditCard } from 'lucide-react';
import { CustomerType } from '@/types/pricing';
import { EnumSelect } from '@/components/common/EnumSelect';

interface CustomerTypeSelectorProps {
  value: CustomerType;
  onChange: (value: CustomerType) => void;
}

export function CustomerTypeSelector({ value, onChange }: CustomerTypeSelectorProps) {
  return (
    <EnumSelect
      enumType="ActorType"
      value={value}
      onValueChange={(newValue) => onChange(newValue as CustomerType)}
      label="Prisgruppe"
      description="Utleier tilbyr egne priser til enkelte kundegrupper. Valg av prisgruppe medfører en godkjenningsprosess."
      placeholder="Velg prisgruppe"
      required
      showDescription={true}
    />
  );
}
