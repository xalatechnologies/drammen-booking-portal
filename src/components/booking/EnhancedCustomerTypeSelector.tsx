
import React from 'react';
import { Users } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ActorType } from '@/types/pricing';

interface EnhancedCustomerTypeSelectorProps {
  value: ActorType;
  onChange: (value: ActorType) => void;
}

const actorTypeOptions = [
  {
    value: 'lag-foreninger' as ActorType,
    label: 'Lag og foreninger (frivillige)',
    description: 'Gratis eller redusert pris - krever godkjenning',
    color: 'text-green-600'
  },
  {
    value: 'paraply' as ActorType,
    label: 'Paraplyorganisasjoner',
    description: 'Spesiell rabatt - krever godkjenning',
    color: 'text-blue-600'
  },
  {
    value: 'private-firma' as ActorType,
    label: 'Private firmaer',
    description: 'Full markedspris',
    color: 'text-red-600'
  },
  {
    value: 'kommunale-enheter' as ActorType,
    label: 'Kommunale enheter',
    description: 'Redusert pris for kommunale aktører',
    color: 'text-blue-600'
  },
  {
    value: 'private-person' as ActorType,
    label: 'Private personer',
    description: 'Standard pris for privatpersoner',
    color: 'text-gray-500'
  }
];

export function EnhancedCustomerTypeSelector({ value, onChange }: EnhancedCustomerTypeSelectorProps) {
  const selectedOption = actorTypeOptions.find(option => option.value === value);

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
        <Users className="h-5 w-5 text-slate-600" />
        Aktørtype
      </Label>
      <p className="text-sm text-gray-600 mb-3">
        Velg hvilken type aktør du representerer. Dette påvirker pris og godkjenningsprosess.
      </p>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 border-gray-300 focus:border-slate-700">
          <SelectValue placeholder="Velg aktørtype" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
          {actorTypeOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
            >
              <div className="flex flex-col items-start py-1">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className={`text-xs font-medium ${option.color}`}>
                  {option.description}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedOption && (
        <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className={`text-sm font-medium ${selectedOption.color}`}>
            {selectedOption.description}
          </div>
        </div>
      )}
    </div>
  );
}
