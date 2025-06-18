
import React from 'react';
import { Users } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ActorType } from '@/types/pricing';

interface EnhancedCustomerTypeSelectorProps {
  value: ActorType;
  onChange: (value: ActorType) => void;
}

export function EnhancedCustomerTypeSelector({ value, onChange }: EnhancedCustomerTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
        <Users className="h-5 w-5 text-slate-600" />
        Aktørtype
      </Label>
      <p className="text-sm text-gray-600 mb-3">
        Velg hvilken type aktør du representerer. Dette påvirker pris og godkjenningsprosess.
      </p>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-1 gap-3"
      >
        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
          <RadioGroupItem value="lag-foreninger" id="lag-foreninger" className="border-gray-400 text-slate-700" />
          <Label htmlFor="lag-foreninger" className="text-sm font-medium cursor-pointer flex-1">
            <div>
              <div className="font-medium">Lag og foreninger (frivillige)</div>
              <div className="text-xs text-green-600 font-medium">Gratis eller redusert pris - krever godkjenning</div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
          <RadioGroupItem value="paraply" id="paraply" className="border-gray-400 text-slate-700" />
          <Label htmlFor="paraply" className="text-sm font-medium cursor-pointer flex-1">
            <div>
              <div className="font-medium">Paraplyorganisasjoner</div>
              <div className="text-xs text-blue-600 font-medium">Spesiell rabatt - krever godkjenning</div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
          <RadioGroupItem value="private-firma" id="private-firma" className="border-gray-400 text-slate-700" />
          <Label htmlFor="private-firma" className="text-sm font-medium cursor-pointer flex-1">
            <div>
              <div className="font-medium">Private firmaer</div>
              <div className="text-xs text-red-600 font-medium">Full markedspris</div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
          <RadioGroupItem value="kommunale-enheter" id="kommunale-enheter" className="border-gray-400 text-slate-700" />
          <Label htmlFor="kommunale-enheter" className="text-sm font-medium cursor-pointer flex-1">
            <div>
              <div className="font-medium">Kommunale enheter</div>
              <div className="text-xs text-blue-600 font-medium">Redusert pris for kommunale aktører</div>
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
          <RadioGroupItem value="private-person" id="private-person" className="border-gray-400 text-slate-700" />
          <Label htmlFor="private-person" className="text-sm font-medium cursor-pointer flex-1">
            <div>
              <div className="font-medium">Private personer</div>
              <div className="text-xs text-gray-500 font-medium">Standard pris for privatpersoner</div>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
