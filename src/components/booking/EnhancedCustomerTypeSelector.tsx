
import React from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ActorType } from '@/types/pricing';
import { EnumSelect } from '@/components/common/EnumSelect';

interface EnhancedCustomerTypeSelectorProps {
  value: ActorType;
  onChange: (value: ActorType) => void;
}

export function EnhancedCustomerTypeSelector({ value, onChange }: EnhancedCustomerTypeSelectorProps) {
  const requiresApproval = ['lag-foreninger', 'paraply'].includes(value);

  return (
    <div className="space-y-3">
      <EnumSelect
        enumType="ActorType"
        value={value}
        onValueChange={(newValue) => onChange(newValue as ActorType)}
        label="Aktørtype"
        description="Velg hvilken type aktør du representerer. Dette påvirker pris og godkjenningsprosess."
        placeholder="Velg aktørtype"
        required
        showDescription={true}
      />

      {requiresApproval && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="font-medium mb-1">Krever godkjenning</div>
            <div className="text-sm">
              Denne bookingen krever godkjenning fra kommunen på grunn av aktørtype eller spesielle betingelser. 
              Du vil motta en bekreftelse når bookingen er behandlet.
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
