
import React from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ActorType } from '@/types/pricing';
import { useTranslation } from '@/i18n/hooks/useTranslation';

interface CustomerTypeSectionProps {
  value: ActorType;
  onChange: (value: ActorType) => void;
}

// Actor types with Norwegian labels
const actorTypes = [
  { 
    value: 'private-person' as ActorType, 
    label: 'Privatperson',
    description: 'For privatpersoner og familier'
  },
  { 
    value: 'lag-foreninger' as ActorType, 
    label: 'Lag og foreninger',
    description: 'Registrerte idrettslag og foreninger'
  },
  { 
    value: 'paraply' as ActorType, 
    label: 'Paraplyorganisasjoner',
    description: 'Paraplyorganisasjoner og større sammenslutninger'
  },
  { 
    value: 'private-firma' as ActorType, 
    label: 'Private bedrifter',
    description: 'Kommersielle aktører og bedrifter'
  },
  { 
    value: 'kommunale-enheter' as ActorType, 
    label: 'Kommunale enheter',
    description: 'Kommunale avdelinger og enheter'
  }
];

export function CustomerTypeSection({ value, onChange }: CustomerTypeSectionProps) {
  const { t } = useTranslation();
  
  // Check if booking requires approval
  const requiresApproval = ['lag-foreninger', 'paraply'].includes(value);

  console.log('CustomerTypeSection - Current value:', value);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Users className="h-5 w-5 text-slate-600" />
          {t('forms.labels.actorType', {}, 'Aktørtype')} *
        </Label>
        <Select value={value} onValueChange={(newValue) => onChange(newValue as ActorType)}>
          <SelectTrigger className="h-11 border-gray-300 focus:border-slate-700">
            <SelectValue placeholder={t('forms.placeholders.selectActorType', {}, 'Velg aktørtype')} />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
            {actorTypes.map((type) => (
              <SelectItem key={type.value} value={type.value} className="cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-start py-1">
                  <div className="font-medium text-gray-900">{type.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {requiresApproval && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="font-medium mb-1">{t('booking.approval.required', {}, 'Krever godkjenning')}</div>
            <div className="text-sm">
              {t('booking.approval.description', {}, 'Denne bookingen krever godkjenning fra kommunen på grunn av aktørtype eller spesielle betingelser. Du vil motta en bekreftelse når bookingen er behandlet.')}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
